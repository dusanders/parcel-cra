import { exec } from "node:child_process";
import * as Path from "path";
import * as FS from 'fs-extra';
import { Log } from "../logger/logger";

export class ProcessService implements IProcessService {
  private static instance: ProcessService;

  private tag = 'ProcessService';
  private tmpDir: string = '';

  private constructor(tmpDir?: string) {
    this.tmpDir = tmpDir || '';
  }

  static getInstance(tmpDir: string): ProcessService {
    if (!ProcessService.instance) {
      ProcessService.instance = new ProcessService(tmpDir);
    }
    return ProcessService.instance;
  }

  async runCommand(command: string, cwd: string): Promise<ProcessResult> {
    // Simulate running a command and returning the output
    return new Promise((resolve) => {
      exec(command,
        { cwd: cwd },
        (error, stdout, stderr) => {
          resolve({
            error: error?.message,
            stdout: stdout,
            stderr: stderr
          })
        }
      );
    });
  }

  async downloadFileWithGit(cwd: string, branch: string, filepath: string): Promise<string> {
    if(!FS.existsSync(this.tmpDir)) {
      FS.mkdirpSync(this.tmpDir);
    }
    const destPath = Path.resolve(this.tmpDir, filepath);
    const gitCommand = `git show ${branch}:${filepath} > ${destPath}`;
    const result = await this.runCommand(gitCommand, cwd);
    Log.i(this.tag, `Downloaded file with git command: ${gitCommand} with result: ${result.stdout} error: ${result.error}`);
    return destPath
  }

  deleteFile(path: string): void {
    FS.unlinkSync(path);
  }
}

export interface ProcessResult {
  stdout: string;
  stderr: string;
  error: string | undefined;
}
export interface IProcessService {
  runCommand(command: string, cwd: string): Promise<ProcessResult>;
  downloadFileWithGit(cwd: string, branch: string, filepath: string): Promise<string>;
  deleteFile(path: string): void;
}