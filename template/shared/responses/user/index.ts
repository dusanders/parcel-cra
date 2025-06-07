import { User } from "../..";
import { BaseResponse } from "../base";

export namespace UserResponses {
  export interface Create extends BaseResponse {
    user?: User;
  }
}