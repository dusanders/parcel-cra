
import * as Path from 'path';
import * as FS from 'fs-extra';
import { DatabaseError, IDatabase } from '../database.def';
import { IUserEntity, IUserRecord, UserEntity } from '../entity.def';
import { v4 as uuid4 } from 'uuid';
import { Log } from '../../logger/logger';

/**
 * Define the User table
 */
interface UserTable {
  [id: string]: IUserEntity;
}

/**
 * Define the overall JSON database
 */
interface IJsonDatabase {
  users: UserTable
}

/**
 * Implement the database contract using a JSON file as a database
 */
export class JsonDatabase implements IDatabase {
  static async fromFile(filename: string) {
    const newDb = new JsonDatabase(filename);
    await newDb.initialize();
    return newDb;
  }
  private tag = 'JsonDatabase';
  private database?: IJsonDatabase;
  private filename: string;
  private fullPath: string = '';

  private constructor(filename: string) {
    this.filename = filename;
  }

  isError(body: DatabaseError | unknown): body is DatabaseError {
    const valid = body as DatabaseError;
    return Boolean(valid.code) && Boolean(valid.message);
  }

  async initialize(): Promise<void> {
    const absParent = __dirname
    const absDbPath = Path.resolve(absParent, this.filename);
    if (!FS.existsSync(absDbPath)) {
      FS.createFileSync(absDbPath);
    }
    this.fullPath = absDbPath;
    const json = (await FS.readFile(absDbPath)).toString();
    if (json) {
      this.database = JSON.parse(json);
    } else {
      this.database = {
        users: {

        }
      }
      await this.save();
    }
  }

  private save() {
    Log.d(this.tag, `db path: ${this.fullPath} -> ${JSON.stringify(this.database)}`)
    return FS.writeFile(this.fullPath, JSON.stringify(this.database));
  }

  private async saveEntity(entity: IUserEntity) {
    return this.ensureDb(async (ensured) => {
      ensured.users[entity.id] = entity;
      return this.save();
    });
  }

  getOrCreateUser(partial: Partial<IUserEntity>): Promise<IUserRecord | DatabaseError> {
    return this.ensureDb(async (ensured) => {
      if (partial.id) {
        Log.i(this.tag, `found id: ${partial.id}`);
        let found = ensured.users[partial.id];
        return new UserEntity(
          found,
          (updated) => this.saveEntity(updated)
        );
      }
      let nameTaken = false;
      for (const user in ensured.users) {
        if (user == partial.name) {
          Log.w(this.tag, `name ${partial.name} taken`);
          nameTaken = true;
          break;
        }
      }
      if (!nameTaken) {
        partial.id = uuid4();
        Log.d(this.tag, `create new ${JSON.stringify(partial)}`);
        return new UserEntity(
          partial as IUserEntity,
          (updated) => this.saveEntity(updated)
        );
      }
      return this.returnError({
        code: 500,
        message: 'name taken'
      });
    });
  }

  returnError(err: DatabaseError) {
    return err;
  }

  delete(entity: IUserEntity): Promise<IUserEntity | DatabaseError> {
    return this.ensureDb(async (ensured) => {
      delete ensured.users[entity.id];
      return entity;
    })
  }

  private ensureDb<T>(fn: (ensured: IJsonDatabase) => T) {
    if (!this.database) {
      throw new Error(`${this.tag} : Not initialized`);
    }
    return fn(this.database!);
  }
}