import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './openid.google.strategy';
import { GoogleOAuthGuard } from './openid.google.guard';

@Module({
    imports: [
      UsersModule,
      JwtModule.register({
        global: true,
        secret: process.env.JWT_KEY!,
        signOptions: { expiresIn: '3600s' },
      }),
    ],
    providers: [AuthService, GoogleStrategy,GoogleOAuthGuard],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}
