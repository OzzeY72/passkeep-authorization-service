import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Redirect,
    Req,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './openid.google.guard';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {
    constructor (
        private authService : AuthService,
        private usersService: UsersService,
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
    @Post('login')
    signIn(@Body() signInDto: Record<string,any>) {
        return this.authService.signIn(signInDto.username,signInDto.password);
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
