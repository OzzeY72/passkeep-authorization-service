import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  providers: [OauthService],
  controllers: [OauthController],
})
export class OauthModule {}
