import { User } from "../../../../shared/models/user";
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
   * Update properties of the entity
   * @param newValues 
   */
  updateEntity(newValues: Partial<IUserEntity>): Promise<IUserRecord>;
  /**
   * Get the client-side model
   */
  getClientModel(): User;
  /**
   * Authenticate this user. Sets the jwt on the entity
   * @param service 
   */
  authenticate(service: AuthenticationService): Promise<IUserEntity>;
}

export type SaveFunction = (user: IUserEntity) => Promise<void>
/**
 * Implement the entity contract
 */
export class UserEntity implements IUserRecord {
  private entity: IUserEntity;
  private saveFn: SaveFunction;

  constructor(entity: IUserEntity, save: SaveFunction) {
    this.entity = entity;
    this.saveFn = save;
  }
  getEntity(): IUserEntity {
    return this.entity;
  }
  getClientModel(): User {
    const { secret, ...clientModel } = this.entity;
    return clientModel as User;
  }
  async updateEntity(newValues: Partial<IUserEntity>): Promise<IUserRecord> {
    this.entity = {
      ...this.entity,
      ...newValues
    };
    await this.saveFn(this.entity);
    return this;
  }
  async authenticate(service: AuthenticationService): Promise<IUserEntity> {
    this.entity.jwt = await service.getJwtForUser(this.getClientModel());
    await this.saveFn(this.entity);
    return this.entity
  }
  toClientModel(): User {
    throw new Error("Method not implemented.");
  }
}