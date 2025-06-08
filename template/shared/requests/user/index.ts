
/**
 * Namespace to hold all /api/user request definitions
 */
export namespace UserRequests {
  /**
   * Create a new user request
   */
  export interface Create {
    name: string;
    secret: string;
  }
  /**
   * Auth / login a user
   */
  export interface Auth {
    name: string;
    secret: string;
  }
  /**
   * Class to validate user request models
   */
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