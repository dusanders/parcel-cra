
export namespace InteropResponses {
  export interface ScanDirectory {
    scanDirectory: string;
    files: string[];
  }
  export interface ExecCommand {
    error: string | undefined;
    stdout: string;
    stderr: string;
  }
}