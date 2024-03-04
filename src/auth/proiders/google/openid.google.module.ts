import { Module } from '@nestjs/common';
import { GoogleStrategy } from './openid.google.strategy';
import { GoogleOAuthGuard } from './openid.google.guard';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [ConfigModule.forRoot(),],
    providers: [GoogleStrategy,GoogleOAuthGuard],
    exports: [GoogleOAuthGuard,GoogleStrategy],
  })
  export class GoogleModule {}
