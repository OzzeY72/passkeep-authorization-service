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
    @Post('token/generate')
    signIn(@Body() signInDto: Record<string,any>) {
        console.log("signInDto");
        console.log(signInDto);
        return this.authService.getToken(signInDto.username,signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Get('token/verify')
    async verifyToken(@Request() req) {
        console.log(req.query.access_token);
        const status = await this.tokensService.verifyToken(req.query.access_token)
        const response = {
            status: status ? "Token valid" : "Token invalid",
            token: status ? await this.tokensService.findTokenByToken(req.query.access_token) : undefined,
        }
        return response
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
