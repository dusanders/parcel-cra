
/**
 * Namespace for API routes
 */
export namespace Api {
  /**
   * User endpoints
   */
  export enum User {
    create = '/api/user/create',
    login = '/api/user/login',
    verify = '/api/user/verify'
  }

  export enum Interop {
    exec = '/api/interop/exec'
  }
}