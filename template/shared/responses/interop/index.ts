
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
  export interface BashScript {
    output: string;
  }
  export interface ExecCommand {
    error: string | undefined;
    stdout: string;
    stderr: string;
  }
}