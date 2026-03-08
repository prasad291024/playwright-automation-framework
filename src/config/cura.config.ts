/**
 * CURA Healthcare Application Configuration
 */

export const curaConfig = {
  name: 'CURA Healthcare',
  baseUrl: 'https://katalon-demo-cura.herokuapp.com',
  storageState: 'storage-state/cura.json',
  authType: 'username',
  authEndpoint: '/#login',
  timeouts: {
    page: 12000,
    action: 6000,
    navigation: 18000,
  },
  selectors: {
    login: {
      usernameInput: '#txt-username',
      passwordInput: '#txt-password',
      loginButton: '#btn-login',
    },
    appointment: {
      facilityDropdown: '#combo_facility',
      visitDate: '#txt_visit_date',
      comment: '#txt_comment',
      bookAppointmentButton: '#btn-book-appointment',
    },
    confirmation: {
      confirmationSection: '#summary',
    },
  },
  features: ['auth', 'appointments', 'confirmation'],
  retryStrategy: 'standard',
  tags: ['@cura', '@healthcare'],
};
