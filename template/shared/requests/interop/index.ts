
export namespace InteropRequests {
  export interface ExecCommand {
    command: string;
    cwd: string;
  }
  export interface ScanDirectory {
    directory?: string;
  }
  export interface GitSearchBranches {
    pattern: string;
    rootDirectory: string;
  }
  export interface GitExportFile {
    rootDirectory: string;
    branch: string;
    filePath: string;
  }
  export class Validator {
    static isExecCommand(body: ExecCommand | unknown): body is ExecCommand {
      const valid = body as ExecCommand;
      return Boolean(valid.command) && Boolean(valid.cwd);
    }
    static isScanDirectory(body: ScanDirectory | unknown): body is ScanDirectory {
      const valid = body as ScanDirectory;
      return true; //Boolean(valid.directory);
    }
    static isGitSearchBranches(body: GitSearchBranches | unknown): body is GitSearchBranches {
      const valid = body as GitSearchBranches;
      return Boolean(valid.rootDirectory);
    }
    static isGitExportFile(body: GitExportFile | unknown): body is GitExportFile {
      const valid = body as GitExportFile;
      return Boolean(valid.rootDirectory) && Boolean(valid.branch) && Boolean(valid.filePath);
    }
  }
}