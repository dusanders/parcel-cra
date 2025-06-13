
/**
 * Namespace for API routes
 */
export namespace Api {
  /**
   * User endpoints
   */
  export enum User {
    BASE = '/api/user',
    create = '/api/user/create',
    login = '/api/user/login',
    update = '/api/user/update',
    verify = '/api/user/verify'
  }

  export enum Interop {
    exec = '/api/interop/exec',
    scanDirectory = '/api/interop/scan-directory',
    searchGitBranches = '/api/interop/git/search-branches',
    gitExportFile = '/api/interop/git/export-file'
  }
}