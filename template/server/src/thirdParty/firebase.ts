
export namespace Firebase {
  export interface FirebaseProject {
    projectId: string;
    projectName: string;
    displayName: string;
    name: string;
    resources: {
      hostingSite: string;
    };
    state: string;
    etag: string;
  }
  export interface ProjectListResponse {
    status: string;
    result: FirebaseProject[];
  }
}