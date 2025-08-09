import { describe, it, expect } from 'vitest';
import { projectSchema } from '../src/schemas';

describe('Zod Schemas', () => {
  it('should validate a correct project object', () => {
    const validProject = {
      orgId: 'org_123',
      name: 'Test Project',
      vertical: 'b2b-agency',
      stageOrder: ['Validate', 'Plan', 'Launch', 'Run'],
      projectId: 'proj_123',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user_123',
    };
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should fail validation for an incorrect project object', () => {
    const invalidProject = {
      orgId: 'org_123',
      name: 'Test Project',
      vertical: 'invalid-vertical', // This is the invalid field
      stageOrder: ['Validate', 'Plan', 'Launch', 'Run'],
      projectId: 'proj_123',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user_123',
    };
    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });
});
