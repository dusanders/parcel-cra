import { User } from "../../../../shared";
import { AuthenticationService } from "../auth/auth";

/**
 * Defined the database schema for a user
 */
export interface IUserEntity extends User {
  id: string;
  secret: string;
}

/**
 * Contract for mutating User entities
 */
export interface IUserRecord {
  /**
   * Get the base database model
   */
  getEntity(): IUserEntity;
  /**
   * Get the client-side model
   */
  getClientModel(): User;
  /**
   * Authenticate this user
   * @param service 
   */
  authenticate(service: AuthenticationService): Promise<IUserEntity>;
}

/**
 * Implement the entity contract
 */
export class UserEntity implements IUserRecord {
  private entity: IUserEntity;
  constructor(entity: IUserEntity) {
    this.entity = entity;
  }
  getEntity(): IUserEntity {
    return this.entity;
  }
  getClientModel(): User {
    const { secret, ...clientModel } = this.entity;
    return clientModel as User;
  }
  async authenticate(service: AuthenticationService): Promise<IUserEntity> {
    this.entity.jwt = await service.getJwtForUser(this.getClientModel());
    return this.entity
  }
  toClientModel(): User {
    throw new Error("Method not implemented.");
  }
}