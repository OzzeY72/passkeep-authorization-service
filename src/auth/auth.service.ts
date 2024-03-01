import { Injectable, Redirect, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password == null || !await bcrypt.compare(pass,user?.password)  ) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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

  googleLogin(req){
    if(!req.user){
      throw new UnauthorizedException(); 
    }
    else{
      return {
        message: "Success",
        user: req.user,
      };
    }
  }


}