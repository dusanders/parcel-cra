
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
   */
  export interface GitExportFile {
    /**
     * The root directory of the Git repository.
     */
    rootDirectory: string;
    /**
     * The branch from which to export the file.
     */
    branch: string;
    /**
     * The path of the file to export from the Git repository.
     */
    filePath: string;
  }
  /**
   * Represents a request to check if a file exists in a Git repository.
   */
  export interface GitHasFile {
    /**
     * The root directory of the Git repository.
     */
    rootDirectory: string;
    /**
     * The branch in which to check for the file's existence.
     */
    branch: string;
    /**
     * The path of the file to check for existence in the Git repository.
     */
    filePath: string;
  }

  export interface FirebaseFindApp {
    pattern: string;
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
    static isFirebaseFindApp(body: FirebaseFindApp | unknown): body is FirebaseFindApp {
      const valid = body as FirebaseFindApp;
      return Boolean(valid.pattern);
    }
  }
}