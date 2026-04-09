export const env = {
  environment: process.env.ENV ?? 'login',
  baseUrl: process.env.BASE_URL ?? '',
  loginUser: process.env.LOGIN_USER ?? '',
  loginPassword: process.env.LOGIN_PASSWORD ?? '',
};
