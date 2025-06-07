import { User } from "../..";
import { BaseResponse } from "../base";

export namespace LoginResponses {
  export interface LoginResponse extends BaseResponse {
    user: User | undefined;
  }
}