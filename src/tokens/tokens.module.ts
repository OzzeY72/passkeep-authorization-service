import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({
      global:true,
      secret: process.env.JWT_KEY,
      signOptions:{expiresIn:'86400s'},
    }),
  ],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
