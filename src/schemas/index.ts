import { z } from 'zod';

export const orgSchema = z.object({
  name: z.string(),
  billingTier: z.string(),
  orgId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
});

export const projectSchema = z.object({
  orgId: z.string(),
  name: z.string(),
  vertical: z.enum(['b2b-agency', 'b2b-saas', 'creator-consultant', 'dtc-e-com', 'local-services', 'light-mfg-wholesale']),
  stageOrder: z.array(z.string()),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
});

export const stageSchema = z.object({
  orgId: z.string(),
  projectId: z.string(),
  name: z.string(),
  gateIds: z.array(z.string()),
  stageId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
});

export const gateSchema = z.object({
  orgId: z.string(),
  projectId: z.string(),
  stageId: z.string(),
  name: z.string(),
  requiredEvidence: z.array(z.enum(['note', 'invoice_url', 'signed_link'])),
  passed: z.boolean(),
  gateId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
});

export const deliverableSchema = z.object({
  orgId: z.string(),
  projectId: z.string(),
  kind: z.enum(['proposal', 'sow', 'onboarding']),
  title: z.string(),
  contentMd: z.string(),
  deliverableId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
});

export const evidenceSchema = z.object({
  orgId: z.string(),
  projectId: z.string(),
  kind: z.enum(['note', 'invoice_url', 'signed_link']),
  url: z.string().optional(),
  note: z.string().optional(),
  evidenceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
});

export const logSchema = z.object({
  orgId: z.string(),
  projectId: z.string().optional(),
  actor: z.string(),
  event: z.string(),
  level: z.enum(['INFO', 'WARN', 'ERROR']),
  payload: z.any(),
  durationMs: z.number().optional(),
  error: z.string().optional(),
  logId: z.string(),
  createdAt: z.date(),
});
