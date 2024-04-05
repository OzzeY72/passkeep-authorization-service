import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Response,
    RawBodyRequest,
    Redirect,
    Req,
    Options,
    Request,
    Query,
    UseGuards,
    Header
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { OauthService } from './oauth.service';
import { AuthGuard } from '../auth/auth.guard';


@Controller('oauth')
export class OauthController {
    constructor(
        private OauthService: OauthService,
        private tokensService: TokensService,
    ){}

    @HttpCode(HttpStatus.OK)
    @Header("Access-Control-Allow-Methods","GET")
    @Header("Access-Control-Allow-Headers","Authorization")
    @Header("Access-Control-Allow-Origin","http://127.0.0.1:3000")
    @Options('authorize')
    authorize_cors(){}

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Header("Access-Control-Allow-Origin","http://127.0.0.1:3000")
    @Get('authorize')
    async authorize(@Query() query: Record<string,any>,@Response() res){
        if(query.response_type == 'code')
        {
            const url = await this.OauthService.authorize(query);
            res.redirect(url.url);
        }
        else
        {
            console.log("response_type is not code");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Header("Access-Control-Allow-Methods","GET")
    @Header("Access-Control-Allow-Headers","Authorization")
    @Header("Access-Control-Allow-Origin","http://127.0.0.1:3002")
    @Options('access_token')
    access_token_cors(){}

    @Header("Access-Control-Allow-Origin","http://127.0.0.1:3002")
    @Header("Content-Type","application/json")
    @HttpCode(HttpStatus.OK)
    @Get('access_token')
    async access_token(@Query() query: Record<string,any>){
        if(query.grant_type == 'access_token')
        {
            const token = await this.OauthService.access_token(query);
            console.log(token);
            return JSON.stringify(token);
            //res.redirect(token.url);
        }
        else
        {
            console.log("grant_type is not access_token");
        }
    }

    @HttpCode(HttpStatus.OK)
    //TODO Guard
    @Get('token/verify')
    async verifyToken(@Request() req) {
        console.log(req.query.access_token);
        const status = await this.tokensService.verifyToken(req.query.access_token)
        console.log(status)
        const response = {
            status: status ? "Token valid" : "Token invalid",
            token: status ? req.query.access_token : undefined,
        }
        return response
    }
}
