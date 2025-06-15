import { test, expect } from '@playwright/test';

test.describe('Story Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
        }),
      });
    });

    // Mock stories list
    await page.route('**/api/stories', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    // Navigate to dashboard
    await page.goto('/');
  });

  test('creates and edits a story', async ({ page }) => {
    // Mock story creation
    await page.route('**/api/stories', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify({
            id: '1',
            title: 'New Story',
            content: 'Initial content',
            genre: 'Fantasy',
            status: 'draft',
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      }
    });

    // Click new story button
    await page.click('text=New Story');

    // Fill in story details
    await page.fill('input[placeholder="Enter story title"]', 'New Story');
    await page.fill('textarea[placeholder="Write your story here..."]', 'Initial content');

    // Save story
    await page.click('text=Save');

    // Verify success message
    await expect(page.locator('text=Story saved successfully')).toBeVisible();

    // Edit story
    await page.fill('textarea[placeholder="Write your story here..."]', 'Updated content');
    await page.click('text=Save');

    // Verify update message
    await expect(page.locator('text=Story updated successfully')).toBeVisible();
  });

  test('exports story as PDF', async ({ page }) => {
    // Mock stories list with one story
    await page.route('**/api/stories', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([{
          id: '1',
          title: 'Test Story',
          content: 'Test content',
          genre: 'Fantasy',
          status: 'draft',
        }]),
      });
    });

    // Mock export endpoint
    await page.route('**/api/stories/1/export', async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="test_story.pdf"',
        },
        body: Buffer.from('fake pdf content'),
      });
    });

    // Click actions dropdown
    await page.click('text=Actions');

    // Click export PDF
    await page.click('text=Download PDF');

    // Verify success message
    await expect(page.locator('text=exported as PDF successfully')).toBeVisible();
  });

  test('analyzes story content', async ({ page }) => {
    // Mock stories list with one story
    await page.route('**/api/stories', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([{
          id: '1',
          title: 'Test Story',
          content: 'Test content',
          genre: 'Fantasy',
          status: 'draft',
        }]),
      });
    });

    // Mock analysis endpoint
    await page.route('**/api/stories/1/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          coherence_score: 8.5,
          style_score: 7.5,
          pacing_score: 9.0,
          feedback: {
            coherence: 'Good coherence',
            style: 'Nice style',
            pacing: 'Excellent pacing',
          },
        }),
      });
    });

    // Click actions dropdown
    await page.click('text=Actions');

    // Click analyze button
    await page.click('text=Analyze');

    // Verify analysis results
    await expect(page.locator('text=Story Analysis')).toBeVisible();
    await expect(page.locator('text=Good coherence')).toBeVisible();
    await expect(page.locator('text=Nice style')).toBeVisible();
    await expect(page.locator('text=Excellent pacing')).toBeVisible();
  });
}); 