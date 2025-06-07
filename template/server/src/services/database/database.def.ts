import { User } from "../../../../shared";
import { IUserEntity, IUserRecord } from "./entity.def";

export interface DatabaseResult<T> {
  failed?: string;
  result: T;
}

export interface IDatabase {
  getOrCreateUser(partial: Partial<IUserEntity>): Promise<DatabaseResult<IUserRecord>>;
  delete(entity: IUserEntity): Promise<DatabaseResult<IUserEntity>>;
}