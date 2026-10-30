import { PUBLIC_DEMO_CREDENTIALS } from '../../../config/public-demo-credentials';

export const users = {
  standard_user: {
    username: PUBLIC_DEMO_CREDENTIALS.saucedemo.standardUser.username,
    password:
      process.env.SAUCEDEMO_PASSWORD || PUBLIC_DEMO_CREDENTIALS.saucedemo.standardUser.password,
  },
  locked_out_user: {
    username: PUBLIC_DEMO_CREDENTIALS.saucedemo.lockedOutUser.username,
    password:
      process.env.SAUCEDEMO_PASSWORD || PUBLIC_DEMO_CREDENTIALS.saucedemo.lockedOutUser.password,
  },
};
