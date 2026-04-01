export const env = {
  environment: process.env.ENV ?? 'qa',
  baseUrl: process.env.BASE_URL ?? '',
  loginUser: process.env.LOGIN_USER ?? '',
  loginPassword: process.env.LOGIN_PASSWORD ?? '',
};
