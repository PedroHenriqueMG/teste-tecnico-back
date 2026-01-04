import dotenv from 'dotenv';

dotenv.config();

export default {
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    env: process.env,
  },
};
