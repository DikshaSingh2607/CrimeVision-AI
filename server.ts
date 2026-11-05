/**
 * CrimeVision AI - Express Server & REST API
 * Port 3000 // Full-Stack Entry Point
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db';
import { executeGroundedQA } from './server/ai';
import { User } from './src/types/forensic';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to resolve currently simulated authenticated user from header or default
function getAuthUser(req: Request): User {
  const userId = (req.headers['x-user-id'] as string) || 'usr-001';
  const user = db.getUserById(userId);
  return user || db.getUsers()[0];
}

// ==========================================
// 1. AUTHENTICATION REST ENDPOINTS
// ==========================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.getUserByEmail(email) || db.getUserById(req.body.id);
  if (!user) {
    res.status(401).json({ error: 'Invalid forensic credentials or badge number.' });
    return;
  }
  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    targetResource: user.email,
    details: `User ${user.name} logged into terminal from ${req.ip || '127.0.0.1'}`
  });
  res.json({ token: `mock-jwt-${user.id}`, user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGOUT',
    targetResource: user.email,
    details: `User ${user.name} logged out.`
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  res.json({ user, availableUsers: db.getUsers() });
});

// ==========================================
// 2. CASE MANAGEMENT REST ENDPOINTS
// ==========================================

app.get('/api/cases', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const cases = db.getCases(user.id);
  res.json(cases);
});

app.get('/api/cases/:id', (req: Request, res: Response) => {
  const c = db.getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: 'Case not found in forensic registry.' });
    return;
  }
  res.json(c);
});

app.post('/api/cases', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user.role !== 'INVESTIGATOR' && user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Only Investigators or Admins may open new cases.' });
    return;
  }
  const newCase = db.createCase(req.body, user);
  res.status(201).json(newCase);
});

app.patch('/api/cases/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const updated = db.updateCase(req.params.id, req.body, user);
  if (!updated) {
    res.status(404).json({ error: 'Case not found' });
    return;
  }
  res.json(updated);
});

// ==========================================
// 3. EVIDENCE VAULT & UPLOADS
// ==========================================

app.get('/api/cases/:id/evidence', (req: Request, res: Response) => {
  const evidence = db.getEvidenceByCase(req.params.id);
  res.json(evidence);
});

app.get('/api/evidence/:id', (req: Request, res: Response) => {
  const item = db.getEvidenceById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Evidence record not found.' });
    return;
  }
  res.json(item);
});

app.get('/api/evidence/:id/download', (req: Request, res: Response) => {
  const item = db.getEvidenceById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Evidence not found' });
    return;
  }
  const user = getAuthUser(req);
  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    caseId: item.caseId,
    action: 'EVIDENCE_DOWNLOAD',
    targetResource: item.id,
    details: `Downloaded original file ${item.fileName} (SHA-256: ${item.sha256Hash.slice(0, 16)}...)`
  });

  res.setHeader('Content-Disposition', `attachment; filename="${item.fileName}"`);
  res.setHeader('Content-Type', item.fileType || 'application/octet-stream');
  res.send(item.textContent || `[CrimeVision Evidence Vault // File: ${item.fileName} // Hash: ${item.sha256Hash}]`);
});

app.post('/api/cases/:id/evidence', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { fileName, fileType, category, content, fileSizeBytes, sourceDescription, mediaUrl } = req.body;

  if (!fileName || !category) {
    res.status(400).json({ error: 'Filename and evidence category are required.' });
    return;
  }

  const created = db.addEvidence(
    {
      caseId: req.params.id,
      fileName,
      fileType: fileType || 'text/plain',
      category,
      content,
      fileSizeBytes,
      sourceDescription,
      mediaUrl
    },
    user
  );

  res.status(201).json(created);
});

// ==========================================
// 4. MULTIMODAL AI ANALYSIS & Q&A
// ==========================================

app.post('/api/cases/:id/analyze', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const evidenceList = db.getEvidenceByCase(req.params.id);

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    caseId: req.params.id,
    action: 'AI_PIPELINE_RUN',
    targetResource: 'Multimodal Engine',
    details: `Executed analysis pipeline across ${evidenceList.length} evidence items.`
  });

  res.json({
    status: 'COMPLETED',
    processedEvidenceCount: evidenceList.length,
    extractedFindingsCount: db.getFindingsByCase(req.params.id).length,
    conflictsFlagged: db.getFlagsByCase(req.params.id).length,
    message: 'Multimodal processing pipeline completed successfully.'
  });
});

app.post('/api/cases/:id/ask', async (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Question string is required.' });
    return;
  }

  const user = getAuthUser(req);

  // Store user question
  db.addQAMessage(req.params.id, {
    caseId: req.params.id,
    sender: 'INVESTIGATOR',
    content: question
  });

  // Execute evidence-grounded QA
  const result = await executeGroundedQA(req.params.id, question);

  // Store AI response
  const aiMessage = db.addQAMessage(req.params.id, {
    caseId: req.params.id,
    sender: 'AI',
    content: result.answer,
    citations: result.citations,
    isRefusal: result.isRefusal,
    retrievedChunksCount: result.retrievedCount
  });

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    caseId: req.params.id,
    action: 'AI_QUESTION_ANSWERED',
    targetResource: 'Evidence Q&A',
    details: `Question asked: "${question.slice(0, 60)}...". Refusal: ${result.isRefusal ? 'YES' : 'NO'}. Citations: ${result.citations.length}`
  });

  res.json({
    message: aiMessage,
    citations: result.citations,
    isRefusal: result.isRefusal,
    engineUsed: result.engineUsed
  });
});

app.get('/api/cases/:id/qa', (req: Request, res: Response) => {
  const history = db.getQAHistory(req.params.id);
  res.json(history);
});

// ==========================================
// 5. FINDINGS & HUMAN REVIEW
// ==========================================

app.get('/api/cases/:id/findings', (req: Request, res: Response) => {
  const findings = db.getFindingsByCase(req.params.id);
  res.json(findings);
});

app.patch('/api/findings/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { reviewStatus, extractedInformation, investigatorNotes } = req.body;

  if (!reviewStatus || !['PENDING', 'ACCEPTED', 'REJECTED'].includes(reviewStatus)) {
    res.status(400).json({ error: 'Invalid review status (ACCEPTED, REJECTED, PENDING)' });
    return;
  }

  const updated = db.updateFindingReview(
    req.params.id,
    { reviewStatus, extractedInformation, investigatorNotes },
    user
  );

  if (!updated) {
    res.status(404).json({ error: 'Finding not found' });
    return;
  }

  res.json(updated);
});

// ==========================================
// 6. TIMELINE & CONFLICTS
// ==========================================

app.get('/api/cases/:id/timeline', (req: Request, res: Response) => {
  const timeline = db.getTimelineByCase(req.params.id);
  res.json(timeline);
});

app.get('/api/cases/:id/flags', (req: Request, res: Response) => {
  const flags = db.getFlagsByCase(req.params.id);
  res.json(flags);
});

app.patch('/api/flags/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { status, resolutionNotes } = req.body;
  const updated = db.updateFlag(req.params.id, { status, resolutionNotes }, user);
  if (!updated) {
    res.status(404).json({ error: 'Flag not found' });
    return;
  }
  res.json(updated);
});

// ==========================================
// 7. REPORTS & APPROVAL WORKFLOW
// ==========================================

app.get('/api/cases/:id/reports', (req: Request, res: Response) => {
  const reports = db.getReportsByCase(req.params.id);
  res.json(reports);
});

app.post('/api/cases/:id/report', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const report = db.createReport(req.params.id, user, req.body.title);
  res.status(201).json(report);
});

app.post('/api/reports/:id/approve', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { action, comments } = req.body;

  if (action === 'SUPERVISOR_APPROVE' && user.role !== 'SUPERVISOR' && user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Only a Supervisor or Admin can grant supervisory approval.' });
    return;
  }

  const updated = db.updateReportApproval(req.params.id, action, user, comments);
  if (!updated) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  res.json(updated);
});

// ==========================================
// 8. AUDIT LOGS & BENCHMARK EVALUATION
// ==========================================

app.get('/api/cases/:id/audit', (req: Request, res: Response) => {
  const logs = db.getAuditLogs(req.params.id);
  res.json(logs);
});

app.get('/api/audit', (req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json(logs);
});

app.get('/api/evaluation', (req: Request, res: Response) => {
  const bench = db.getBenchmark();
  res.json(bench);
});

app.post('/api/reset-demo', (req: Request, res: Response) => {
  db.seed();
  const user = getAuthUser(req);
  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'DEMO_RESET',
    targetResource: 'Synthetic Database',
    details: 'Reset system to initial synthetic state (CV-DEMO-001).'
  });
  res.json({ success: true, message: 'Synthetic dataset re-seeded successfully.' });
});

// ==========================================
// VITE INTEGRATION / STATIC SERVE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CrimeVision AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CrimeVision AI] Failed to start server:', err);
});
