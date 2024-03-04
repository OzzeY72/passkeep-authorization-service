import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleModule } from './proiders/google/openid.google.module';
import { TokensService } from 'src/tokens/tokens.service';
import { TokensModule } from 'src/tokens/tokens.module';


@Module({
    imports: [
      ConfigModule.forRoot(),
      UsersModule,
      JwtModule.register({
        global: true,
        secret: process.env.JWT_KEY!,
        signOptions: { expiresIn: '3600s' },
      }),
      GoogleModule,
      TokensModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}
