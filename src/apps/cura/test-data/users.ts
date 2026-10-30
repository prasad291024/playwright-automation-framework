import { PUBLIC_DEMO_CREDENTIALS } from '../../../config/public-demo-credentials';

export const user = {
  username: process.env.CURA_USERNAME || PUBLIC_DEMO_CREDENTIALS.cura.username,
  password: process.env.CURA_PASSWORD || PUBLIC_DEMO_CREDENTIALS.cura.password,
};
