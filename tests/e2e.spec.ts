import { test, expect } from '@playwright/test';

test('Core user flow', async ({ page }) => {
  // For this test, we will assume the user is already authenticated.
  // In a real-world scenario, you would programmatically log in.

  await page.goto('http://localhost:3000/');

  // 1. Create a new project
  await page.getByRole('button', { name: 'Create Your First Project' }).click();
  await page.waitForTimeout(1000); // Wait for the prompt to appear
  page.on('dialog', dialog => dialog.accept('My New Project'));
  await page.waitForTimeout(2000); // Wait for the project to be created and the page to reload

  // 2. Verify the project was created
  await expect(page.getByRole('heading', { name: 'My New Project' })).toBeVisible();

  // 3. Add evidence
  await page.getByRole('button', { name: 'Select evidence type' }).click();
  await page.getByRole('option', { name: 'Note' }).click();
  await page.getByPlaceholder('Note').fill('This is a test note.');
  await page.getByRole('button', { name: 'Add Evidence' }).click();

  // 4. Evaluate gates
  await page.getByRole('button', { name: 'Evaluate Gates' }).click();
  await expect(page.getByText('Evaluation Complete')).toBeVisible();

  // 5. Create a proposal
  await page.getByPlaceholder('Client Name').fill('Test Client');
  await page.getByPlaceholder('Your Company').fill('Test Company');
  await page.getByRole('button', { name: 'Create Proposal' }).click();
  await expect(page.getByText('Proposal Created')).toBeVisible();
});
