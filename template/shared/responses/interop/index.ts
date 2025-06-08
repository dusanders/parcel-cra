
export namespace InteropResponses {
  export interface ExecCommand {
    error: string | undefined;
    stdout: string;
    stderr: string;
  }
}