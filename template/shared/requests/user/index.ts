
export namespace UserRequests {
  export interface Create {
    name: string;
    secret: string;
  }
  export interface Auth {
    name: string;
    secret: string;
  }
  export class Validator {
    static isCreate(body: Create | unknown): body is Create {
      const valid = body as Create;
      return Boolean(valid) && Boolean(valid);
    }
    static isAuthRequest(body: Auth | unknown): body is Auth {
      const valid = body as Auth;
      return Boolean(valid.name)
        && Boolean(valid.secret);
    }
  }
}