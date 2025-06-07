
export namespace LoginRequests {
  export interface LoginRequest {
    name: string;
    secret: string;
  }
  export class Validator {
    static isLoginRequest(body: LoginRequest | unknown): body is LoginRequest {
      const valid = body as LoginRequest;
      return Boolean(valid.name)
        && Boolean(valid.secret);
    }
  }
}