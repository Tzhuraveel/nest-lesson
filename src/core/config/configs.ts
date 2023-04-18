import { config } from 'dotenv';

config();

export const configs = {
  TOKENS: {
    TOKEN_SECRET_KEY: process.env.JWT_TOKEN,
  },
};
