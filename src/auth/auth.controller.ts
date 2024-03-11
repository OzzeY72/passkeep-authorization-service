import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    RawBodyRequest,
    Redirect,
    Req,
    Response,
    Options,
    Request,
    Header,
    UseGuards,
    Head
} from '@nestjs/common';
import { Response as Res } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './proiders/google/openid.google.guard';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';


@Controller('auth')
export class AuthController {
    constructor (
        private authService : AuthService,
        private usersService: UsersService,
        private tokensService: TokensService,
    ){}

    @UseGuards(GoogleOAuthGuard)
    @Get('google')
    async googleGuard(@Request() req){
        return req.user;
    }

    @Get('google-redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Request() req) {
        await this.usersService.addGoogle(req.user);
        return this.authService.googleLogin(req);
    }
    
    @HttpCode(HttpStatus.OK)
    @Header("Access-Control-Allow-Methods","POST")
    @Header("Access-Control-Allow-Headers","Content-type")
    @Header("Access-Control-Allow-Origin","http://127.0.0.1:3000")
    @Options('login')
    allow_cors_login(){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Header("Access-Control-Allow-Origin","http://127.0.0.1:3000")
    signIn(@Body() signInDto: Record<string,any>) {
        console.log(signInDto);
        const token = this.authService.login(signInDto.username,signInDto.password);
        console.log(token);
        return token;
    }

    @HttpCode(HttpStatus.OK)
    @Post('signup')
    signUp(@Body() signInDto: Record<string,any>) {
        return this.authService.signUp(signInDto.username,signInDto.password);
    }
    
    @UseGuards(AuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }
}
