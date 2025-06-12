import { User } from "../../models/user";

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
   * Update user request
   */
  export interface Update {
    newValues: Omit<User, 'jwt' | 'hasAuth' | 'name'>;
  }
  /**
   * Class to validate user request models
   */
  export class Validator {
    static isCreate(body: Create | unknown): body is Create {
      const valid = body as Create;
      return valid && Boolean(valid.name) && Boolean(valid.secret);
    }
    static isUpdate(body: Update | unknown): body is Update {
      const valid = body as Update;
      const isValid = valid && valid.newValues && Object.keys(valid.newValues).length > 0
        && valid.newValues.id !== undefined;
      return isValid
    }
    static isAuthRequest(body: Auth | unknown): body is Auth {
      const valid = body as Auth;
      return valid && Boolean(valid.name) && Boolean(valid.secret);
    }
  }
}