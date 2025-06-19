import { FirebaseProject, GitTreeItem } from "../../models/user";

export namespace InteropResponses {
  export interface ScanDirectory {
    scanDirectory: string;
    files: string[];
  }
  export interface GitSearchBranches {
    originUrl: string;
    branches: string[];
  }
  export interface GitExportFile {

  }
  export interface GitHasFile {
    files: GitTreeItem[];
  }
  export interface BashScript {
    output: string;
  }
  export interface FirebaseListProjects {
    projects: FirebaseProject[];
  }
  export interface ExecCommand {
    error: string | undefined;
    stdout: string;
    stderr: string;
  }
}