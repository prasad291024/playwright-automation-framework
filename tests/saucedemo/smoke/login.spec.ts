import { test } from '../../../src/core/fixtures/test.fixture';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test('@smoke @saucedemo - user can login successfully', async ({ saucedemoApp }) => {
  await saucedemoApp.login(users.standard_user.username, users.standard_user.password);
  await saucedemoApp.inventoryPage.verifyInventoryLoaded();
});
