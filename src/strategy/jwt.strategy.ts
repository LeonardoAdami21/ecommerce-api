import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { JwtPayloadInterface } from '../interfaces/jwt.payload';
import { PassportStrategy } from '@nestjs/passport';
import { accessTokenSecret } from '../env/envoriment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenSecret as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      profile: payload.profile,
    };
  }
}
