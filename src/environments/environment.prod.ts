interface Environment {
  readonly production: boolean;
  readonly API_URL: string;
}

export const environment: Environment = {
  production: true,
  API_URL: 'http://localhost:8080/api',
};
