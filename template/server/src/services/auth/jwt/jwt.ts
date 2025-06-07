import { v4 as uuid4 } from 'uuid'
export class JWTService {
  private active: Map<string, any>;
  constructor() {
    this.active = new Map();
  }
  isValid(jwt: string) {
    return this.active.has(jwt);
  }
  signJwt(): string {
    let uuid = uuid4();
    this.active.set(uuid, {});
    return uuid;
  }
}