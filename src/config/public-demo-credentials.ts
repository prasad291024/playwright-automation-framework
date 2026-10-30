export const PUBLIC_DEMO_CREDENTIALS = {
  cura: {
    username: 'John Doe',
    password: 'ThisIsNotAPassword',
  },
  saucedemo: {
    standardUser: {
      username: 'standard_user',
      password: 'secret_sauce',
    },
    lockedOutUser: {
      username: 'locked_out_user',
      password: 'secret_sauce',
    },
  },
  orangehrm: {
    username: 'Admin',
    password: 'admin123',
  },
} as const;
