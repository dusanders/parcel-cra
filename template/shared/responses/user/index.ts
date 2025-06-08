import { User } from "../..";

/**
 * Namespace to hold all /api/user responses
 */
export namespace UserResponses {
  /**
   * Response object for an /api/user/create request
   */
  export interface Create {
    user: User;
  }
  /**
   * Response object for an /api/user/auth request
   */
  export interface Auth {
    user: User;
  }
}