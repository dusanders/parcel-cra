import { v4 as uuid4 } from 'uuid';
import { IJwtService } from './jwt.def';

/**
 * Implement the JWT contract
 */
export class JWTService implements IJwtService {
  private active: Map<string, any>;
  constructor() {
    this.active = new Map();
  }
  async isValid(jwt: string) {
    return this.active.has(jwt);
  }
  async signJwt() {
    let uuid = uuid4();
    this.active.set(uuid, {});
    return uuid;
  }
}