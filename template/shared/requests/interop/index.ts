
export namespace InteropRequests {
  export interface ExecCommand {
    command: string;
    cwd: string;
  }

  export class Validator {
    static isExecCommand(body: ExecCommand | unknown): body is ExecCommand {
      const valid = body as ExecCommand;
      return Boolean(valid.command) && Boolean(valid.cwd);
    }
  }
}