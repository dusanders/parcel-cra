
export const API_ENDPOINT = 'http://localhost:50001';

export interface User {
  name: string;
  hasAuth: boolean;
  jwt: string;
}