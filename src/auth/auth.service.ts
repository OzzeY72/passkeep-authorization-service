import { Injectable, Redirect, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokensService } from 'src/tokens/tokens.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}

  async getToken(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password == null || !await bcrypt.compare(pass,user?.password)  ) {
      throw new UnauthorizedException();
    }
    //const payload = { sub: user.userId, username: user.username };
    //Here we must send request to db with scopes alllowed

    let token = await this.tokensService.findToken(user.userId);
    if(token != undefined){
      return token;
    }
    else{
      token = await this.tokensService.createToken({
        scope:["read"],
        exp:Math.floor(Date.now()/1000)+86400,
        userId:user.userId
      });
    }

    return token;
  }
  async signUp(
    username: string,
    pass: string
  ){
    if(!await this.usersService.findOne(username)){
      const hashed_pass = await bcrypt.hash(pass,10);
      this.usersService.add(username,hashed_pass);
    }
    else{
      throw new UnauthorizedException();
    }
  }

  async googleSignIn(user)
  {
    const payload = { sub: user.userId, username: user.username };
    return await this.jwtService.signAsync(payload);
  }

  async googleLogin(req){
    if(!req.user){
      throw new UnauthorizedException(); 
    }
    else{
      return {
        access_token: await this.googleSignIn(await this.usersService.findOne(req.user.firstName)),
        user: req.user,
      };
    }
  }


}