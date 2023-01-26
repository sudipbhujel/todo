import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (
            // Cookie Session Authentication
            request?.cookies?.Authentication ||
            // Bearer Token Authentication
            request?.headers?.authorization?.split('Bearer ')[1]
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { email: string; sub: string }) {
    return { id: payload.sub, email: payload.email };
  }
}
