import { User } from "../../../../../shared";

export interface IJwtService {
  isValid(jwt: string): Promise<boolean>;
  signJwt(user: User): Promise<string>;
}