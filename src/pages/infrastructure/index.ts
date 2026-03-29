// Base class for all page objects
export { BasePage } from '../base/BasePage';

// Page object models - App specific
export { VwoLoginPage } from '../apps/vwo';
export { CuraConfirmationPage, CuraLoginPage, CuraAppointmentPage } from '../apps/cura';
export { SauceDemoCartPage, SauceDemoInventoryPage, SauceDemoLoginPage } from '../apps/saucedemo';
export { OrangeHrmLoginPage } from '../apps/orangehrm';

// Generic page objects (may need app-specific overrides)
export { LoginPage } from '../LoginPage';
export { DashboardPage } from '../DashboardPage';
export { ProfilePage } from '../ProfilePage';
export { SearchPage } from '../SearchPage';
export { RegisterPage } from '../RegisterPage';
