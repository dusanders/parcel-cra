import { exec } from "node:child_process";

export class ProcessService implements IProcessService {
  private static instance: ProcessService;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): ProcessService {
    if (!ProcessService.instance) {
      ProcessService.instance = new ProcessService();
    }
    return ProcessService.instance;
  }

  public async runCommand(command: string, cwd: string): Promise<ProcessResult> {
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
}

export interface ProcessResult {
  stdout: string;
  stderr: string;
  error: string | undefined;
}
export interface IProcessService {
  runCommand(command: string, cwd: string): Promise<ProcessResult>;
}