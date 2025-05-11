import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayload } from '../../interface/IPayload';
import { jwtSecret } from '../../env/envoriment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret || process.env.JWT_SECRET,
    });
  }

  async validate(payload: IPayload) {
    return { ...payload };
  }
}
