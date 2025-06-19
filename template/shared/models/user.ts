
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

export interface GitTreeItem {
  fileMode: GitFileModes,
  type: GitFileType,
  hashName: string,
  size: number,
  path: string
}

export enum GitFileModes {
  normal = '100644',
  executable = '100755',
  symLink = '120000'
}

export enum GitFileType {
  blob = 'blob',
  commit = 'commit',
  tree = 'tree'
}