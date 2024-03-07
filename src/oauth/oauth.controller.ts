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
    Request,
    Query,
    UseGuards
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { OauthService } from './oauth.service';


@Controller('oauth')
export class OauthController {
    constructor(
        private OauthService: OauthService,
    ){}
    @HttpCode(HttpStatus.OK)
    @Get('authorize')
    @Redirect('/',302)
    async authorize(@Query() query: Record<string,any>){
        if(query.response_type == 'code')
        {
            return this.OauthService.authorize(query);
        }
        else
        {
            console.log("response_type is not code");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('access_token')
    async access_token(@Query() query: Record<string,any>){
        if(query.grant_type == 'access_token')
        {
            return this.OauthService.access_token(query);
        }
        else
        {
            console.log("grant_type is not access_token");
        }
    }


}
