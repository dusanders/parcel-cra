
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
  export interface BashScript {
    cwd: string;
    args: string[];
  }
  /**
   * Represents a file to be exported from a Git repository.
   *
   * @property rootDirectory - The root directory of the Git repository.
   * @property branch - The name of the branch from which the file is exported.
   * @property filePath - The path to the file within the repository.
   */
  export interface GitExportFile {
    rootDirectory: string;
    branch: string;
    filePath: string;
  }

  export interface GitHasFile {
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
    static isGitHasFile(body: GitHasFile | unknown): body is GitHasFile {
      const valid = body as GitExportFile;
      return Boolean(valid.rootDirectory) && Boolean(valid.branch) && Boolean(valid.filePath);
    }
    static isBashScript(body: BashScript | unknown): body is BashScript {
      const valid = body as BashScript;
      return Boolean(valid.cwd) && valid.args !== undefined
    }
  }
}