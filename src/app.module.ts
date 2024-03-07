import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [AuthModule, UsersModule,ConfigModule.forRoot(), TokensModule, OauthModule],
  controllers: [AppController, AuthController],
  providers: [AppService,AuthService],
})
export class AppModule {}
