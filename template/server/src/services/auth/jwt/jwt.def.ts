import { User } from "../../../../../shared";

/**
 * Define the contract for the JWT auth service
 */
export interface IJwtService {
  /**
   * Validate a JWT token
   * @param jwt 
   */
  isValid(jwt: string): Promise<boolean>;
  /**
   * Sign a JWT token
   * @param user 
   */
  signJwt(user: User): Promise<string>;
}