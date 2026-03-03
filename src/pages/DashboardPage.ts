import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { IDashboardPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Dashboard Page Object Model
 * Handles dashboard interactions and assertions
 * Uses stable, retry-enabled methods for better reliability
 */
export class DashboardPage extends BasePage implements IDashboardPage {
  /**
   * Navigate to dashboard page with stability checks
   */
  async goto(): Promise<void> {
    await this.navigateTo('/dashboard');

    // Verify dashboard is loaded before returning
    await this.expectWithRetry(
      async () => {
        const dashboard = await this.findElement([
          this.getByTestId(SELECTORS_BY_TESTID.dashboard.welcomeHeader),
          this.locator(SELECTORS.dashboard.welcomeHeader),
        ]);
        expect(dashboard).not.toBeNull();
      },
      { maxAttempts: 4 },
    );
  }

  /**
   * Verify welcome message is visible
   * Uses retry logic for slow page updates
   */
  async verifyWelcomeMessage(): Promise<void> {
    await this.expectWithRetry(
      async () => {
        const welcomeElement = await this.findElement([
          this.getByTestId(SELECTORS_BY_TESTID.dashboard.welcomeHeader),
          this.locator(SELECTORS.dashboard.welcomeHeader),
          this.getByText(/welcome|hello|dashboard/i),
        ]);
        expect(welcomeElement).not.toBeNull();

        if (welcomeElement) {
          expect(await welcomeElement.isVisible()).toBe(true);
        }
      },
      { maxAttempts: 5 },
    );
    console.log(`✓ Welcome message verified`);
  }

  /**
   * Navigate to profile page
   * Uses stable click with fallback locators
   */
  async navigateToProfile(): Promise<void> {
    const candidates = [
      this.getByRole('link', { name: /profile|my profile/i }),
      this.getByTestId(SELECTORS_BY_TESTID.dashboard.profileLink),
      this.locator(SELECTORS.dashboard.profileLink),
      this.getByRole('button', { name: /profile/i }),
    ];

    for (const candidate of candidates) {
      try {
        if ((await candidate.count()) > 0) {
          try {
            await this.scrollIntoView(candidate);
          } catch {
            // Ignore if not scrollable
          }

          // Wait for element to be stable before clicking
          await this.waitForStableVisibility(candidate);
          await this.stableClick(candidate);

          // Wait for navigation to complete
          await this.page.waitForNavigation({ timeout: 5000 }).catch(() => {
            console.log('No navigation occurred (might be SPA)');
          });
          await this.waitForPageLoad();
          console.log(`✓ Navigated to profile`);
          return;
        }
      } catch (e) {
        // Continue to next candidate
      }
    }

    throw new Error(`Unable to find profile link using any strategy`);
  }

  /**
   * Navigate to settings page
   * Uses stable click with fallback locators
   */
  async navigateToSettings(): Promise<void> {
    const candidates = [
      this.getByRole('link', { name: /settings|preferences/i }),
      this.getByRole('button', { name: /settings/i }),
      this.locator('[class*="settings"]'),
    ];

    for (const candidate of candidates) {
      try {
        if ((await candidate.count()) > 0) {
          try {
            await this.scrollIntoView(candidate);
          } catch {
            // Ignore if not scrollable
          }

          await this.waitForStableVisibility(candidate);
          await this.stableClick(candidate);

          await this.page.waitForNavigation({ timeout: 5000 }).catch(() => {
            console.log('No navigation occurred (might be SPA)');
          });
          await this.waitForPageLoad();
          console.log(`✓ Navigated to settings`);
          return;
        }
      } catch (e) {
        // Continue to next candidate
      }
    }

    throw new Error(`Unable to find settings link using any strategy`);
  }
}
