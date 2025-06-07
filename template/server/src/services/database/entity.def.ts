import { User } from "../../../../shared";
import { AuthenticationService } from "../auth/auth";

export interface IUserEntity extends User {
  id: string;
  secret: string;
}

export interface IUserRecord {
  getEntity(): IUserEntity;
  getClientModel(): User;
  authenticate(service: AuthenticationService): Promise<IUserEntity>;
}

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
  authenticate(service: AuthenticationService): Promise<IUserEntity> {
    throw new Error("Method not implemented.");
  }
  toClientModel(): User {
    throw new Error("Method not implemented.");
  }
}