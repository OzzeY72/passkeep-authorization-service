import { Injectable } from '@nestjs/common';
import { access } from 'fs';

export type TokenStruct = 
{
    access_token: string,
    refresh_token: string,
    exp: number,
    scope: [string],
    userId: number,
};

@Injectable()
export class TokensService {
    //for now hardcoded token array, db in future
    public tokens = [
        {
            access_token:"urJ1WAAhSLpAcf1UFkgexCAu7QJoqLdEv0Mi4OTIXxOum9qzOCfQyK1OGV2U0sAr5S0I3ZmPReGRBY4MjUdSdl28Dp6VyQjWwhzKBRIyT8c2zqLGiJO8QZuvftjWWYST",
            refresh_token: "J6XUwqw3Uhvc4zQz4896tZcbELKhPtF9bRreWEaAOA0h8PJCBAksBpvUhSZO4vD4VYVkLx8YwlvUw6087GEsOzLltSM2cd30w5yjI7dIPMvqVhGSqcUCcWzWVeJlbV06",
            exp:1709579501,
            scope:["read","write"],
            userId: 1,
        },
    ];
    
    generateRandomToken(length:number){
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for(let i = 0;i < length;i++){
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }

    async findToken(userId:number){
        return this.tokens.find(token => token.userId === userId);
    }

    async findTokenByToken(access_token:string){
        return this.tokens.find(token => token.access_token === access_token);
    }

    async verifyToken(access_token:string)
    {
        let token = await this.findTokenByToken(access_token);
        if(token != undefined && token.exp >= Math.floor(Date.now()/1000))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    async createToken(props: {scope: [string],exp: number, userId: number}){
        const token = {
            access_token: this.generateRandomToken(64),
            refresh_token: this.generateRandomToken(64),
            exp:  props.exp,
            scope: props.scope,
            userId: props.userId,
        }

        this.tokens.push(token);
        console.log(this.tokens);
        return token;
    }
}
