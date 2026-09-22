export const users = {
  standard_user: {
    username: 'standard_user',
    password: process.env.SAUCEDEMO_PASSWORD || '',
  },
  locked_out_user: {
    username: 'locked_out_user',
    password: process.env.SAUCEDEMO_PASSWORD || '',
  },
};
