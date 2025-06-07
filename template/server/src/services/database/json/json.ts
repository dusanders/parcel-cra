
import * as Path from 'path';
import * as FS from 'fs-extra';
import { DatabaseResult, IDatabase } from '../database.def';
import { IUserEntity, IUserRecord, UserEntity } from '../entity.def';
import { v4 as uuid4 } from 'uuid';

interface UserTable {
  [id: string]: IUserEntity;
}

interface IJsonDatabase {
  users: UserTable
}

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
    return FS.writeFile(this.fullPath, JSON.stringify(this.database));
  }

  getOrCreateUser(partial: Partial<IUserEntity>): Promise<DatabaseResult<IUserRecord>> {
    return this.ensureDb(async (ensured) => {
      let result: DatabaseResult<IUserRecord> | undefined;
      if (partial.id) {
        let found = ensured.users[partial.id];
        result = {
          result: new UserEntity(found)
        }
        return result;
      }
      let nameTaken = false;
      for (const user in ensured.users) {
        if (user == partial.name) {
          nameTaken = true;
          break;
        }
      }
      if (!nameTaken) {
        partial.id = uuid4();
        return {
          result: new UserEntity(partial as IUserEntity)
        }
      }
      result = {
        failed: 'name taken',
        result: {} as any
      };
      return result;
    });
  }

  delete(entity: IUserEntity): Promise<DatabaseResult<IUserEntity>> {
    return this.ensureDb(async (ensured) => {
      delete ensured.users[entity.id];
      return {
        result: entity
      }
    })
  }

  private ensureDb<T>(fn: (ensured: IJsonDatabase) => T) {
    if (!this.database) {
      throw new Error(`${this.tag} : Not initialized`);
    }
    return fn(this.database!);
  }
}