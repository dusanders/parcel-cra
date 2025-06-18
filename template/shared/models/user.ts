
export interface User {
  name: string;
  id: string;
  hasAuth: boolean;
  jwt: string;
  theme?: string;
}

export interface FirebaseProject {
  projectId: string;
  displayName: string;
}