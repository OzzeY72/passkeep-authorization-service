import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';

type AuthorizeDto = 
{
    response_type:string,
    client_id:string,
    redirect_uri:string,
    scope:string,
    state:string,
}
type OauthClient = 
{
    client_id:string,
    client_secret:string,
    redirect_uri: [string,string],
    valid_codes: [string],
}


@Injectable()
export class OauthService {
    constructor(
        private tokensService: TokensService,
    ){}

    public clients:[OauthClient] = [
        {
            client_id:"test",
            client_secret:"test",
            redirect_uri:["http://127.0.0.1:3002/api/passkeep-callback","http://127.0.0.1:3002/"],
            valid_codes:["test"],
        }
    ];

    async authorize(params :Record<string,any>){
        const oauthClient = this.clients.find((el) => el.client_id == params.client_id);
        console.log(params);
        console.log(oauthClient);
        //verify client_id
        if(oauthClient != undefined)
        {
            //Verify if redirect_uri is allowed
            const redirect_uri = oauthClient.redirect_uri.find((el) => el === params.redirect_uri)
            if(redirect_uri != undefined)
            {
                const code = this.tokensService.generateRandomToken(24);
                oauthClient.valid_codes.push(code);
                console.log(code);
                return {url: `${params.redirect_uri}?code=${code}&state=${params.state}`};
            }
            else
            {
                throw new HttpException(`URL: ${params.redirect_uri} is not allowed`,HttpStatus.FORBIDDEN);
            }
        }   
    }

    async access_token(params :Record<string,any>){
        const oauthClient = this.clients.find((el) => el.client_id == params.client_id);
        console.log(params);
        //verify client_id
        if(oauthClient != undefined)
        {
            //verify client_secret
            if(oauthClient.client_secret == params.client_secret)
            {
                //Verify if redirect_uri is allowed
                if(oauthClient.redirect_uri.find((el) => el == params.redirect_uri) != undefined)
                {
                    const code = oauthClient.valid_codes.find((el) => el == params.code)
                    console.log(oauthClient.valid_codes)
                    console.log(params.code)
                    if(code != undefined)
                    {
                        //TODO
                        //oauthClient.valid_codes.splice(oauthClient.valid_codes.indexOf(code),1);
                        const token = await this.tokensService.createToken({scope:["write"],exp:Math.floor(Date.now()/1000)+86400,userId:1});

                        console.log(oauthClient.valid_codes);
                        console.log(token.access_token);
                        //return token;
                        return {url: `${params.redirect_uri}?access_token=${token.access_token}&refresh_token=${token.refresh_token}&exp=${token.exp}&scope=${token.scope}`};
                    }
                    else
                    {
                        throw new HttpException("Code invalid",HttpStatus.I_AM_A_TEAPOT);
                    }
                }
                else
                {
                    throw new HttpException(`URL: ${oauthClient.redirect_uri} is not allowed`,HttpStatus.FORBIDDEN);
                }
            }
            else
            {
                throw new HttpException("Client authorization invalid",HttpStatus.UNAUTHORIZED);
            }
        }
        else
        {
            throw new HttpException("Client authorization invalid",HttpStatus.UNAUTHORIZED);
        }

    }

}
