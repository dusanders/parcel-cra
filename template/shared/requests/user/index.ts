
export namespace UserRequests {
  export interface Create {
    name: string;
    secret: string;
  }
  export class Validator {
    static isCreate(body: Create | unknown): body is Create {
      const valid = body as Create;
      return Boolean(valid) && Boolean(valid);
    }
  }
}