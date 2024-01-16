interface Environment {
  readonly production: boolean;
  readonly API_URL: string;
}

export const environment: Environment = {
  production: false,
  API_URL: 'http://localhost:8080/api',
};
