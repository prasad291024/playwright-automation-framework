import { test } from '@playwright/test';
import { ProfilePage } from '../../src/pages/ProfilePage';

test('Profile name can be updated', async ({ page }) => {
  const profile = new ProfilePage(page);
  await profile.goto();
  await profile.updateName('Prasad Dev');
  await profile.assertNameUpdated('Prasad Dev');
});
