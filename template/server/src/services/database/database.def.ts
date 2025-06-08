import { User } from "../../../../shared/models/user";
import { IUserEntity, IUserRecord } from "./entity.def";

/**
 * Define the result of any database call. Enforces a failed database
 * response as a possible result
 */
export interface DatabaseError {
  code: string | number;
  message: string;
}

/**
 * Define contract for the Database
 */
export interface IDatabase {
  /**
   * Determine if a model contains the required params to be considered a DatabaseError
   * @param body 
   */
  isError(body: DatabaseError | unknown): body is DatabaseError;
  /**
   * Create a user
   * @param partial 
   */
  getOrCreateUser(partial: Partial<IUserEntity>): Promise<IUserRecord | DatabaseError>;
  /**
   * Delete a user
   * @param entity 
   */
  delete(entity: IUserEntity): Promise<IUserEntity | DatabaseError>;
}