
export interface User {
  name: string;
  id: string;
  hasAuth: boolean;
  jwt: string;
  theme?: string;
}