import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../../common/constants/jwt.constant';
import { Errores_TOKEN } from 'src/common/helpers/Token.helper';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: any = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException(Errores_TOKEN.AUTH_TOKEN_NOT_FOUND);
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            request.user = payload;

            request.accountId = payload.accountId;

            return true;
        } catch (error) {
            throw new UnauthorizedException(Errores_TOKEN.AUTH_TOKEN_INVALID);
        }
    }

    private extractToken(request: Request): string | undefined {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException(Errores_TOKEN.AUTH_TOKEN_NOT_FOUND);
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            throw new UnauthorizedException(Errores_TOKEN.AUTH_TOKEN_MALFORMED);
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            throw new UnauthorizedException(Errores_TOKEN.AUTH_TOKEN_MALFORMED);
        }

        return token;
    }
}
