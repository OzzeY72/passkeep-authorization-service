import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    constructor(
        private jwtService: JwtService
    ){}
    //for now hardcoded token array, db in future
    /*public tokens = [
        {
            access_token:"urJ1WAAhSLpAcf1UFkgexCAu7QJoqLdEv0Mi4OTIXxOum9qzOCfQyK1OGV2U0sAr5S0I3ZmPReGRBY4MjUdSdl28Dp6VyQjWwhzKBRIyT8c2zqLGiJO8QZuvftjWWYST",
            refresh_token: "J6XUwqw3Uhvc4zQz4896tZcbELKhPtF9bRreWEaAOA0h8PJCBAksBpvUhSZO4vD4VYVkLx8YwlvUw6087GEsOzLltSM2cd30w5yjI7dIPMvqVhGSqcUCcWzWVeJlbV06",
            exp:1710536754,
            scope:["read","write"],
            userId: 1,
        },
    ];*/

    //user:{userId:number,username:string}
    async generateJWT(payload : any)
    {
        //const payload = {sub: user.userId,username: user.username};
        return {access_token: await this.jwtService.signAsync(payload)}
    }

    async decodeJWT(token: string){
        let payload
        try{
            payload =  await this.jwtService.verifyAsync(
                token,
                {
                secret: process.env.JWT_KEY
                }
            );
        }
        catch{
            return undefined
        }
        return payload
    }
    
    generateRandomToken(length:number){
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for(let i = 0;i < length;i++){
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
    /*
    async findToken(userId:number){
        return this.tokens.find(token => token.userId === userId);
    }

    async findTokenByToken(access_token:string){
        return this.tokens.find(token => token.access_token === access_token);
    }*/

    async verifyToken(token:string)
    {
        if (await this.decodeJWT(token) != undefined)
            return true
        else
            return false
    }

    async generateAccessToken(props: {scope: [string],iat:number, userId: number, aud:[string]})
    {
        const payload = {
            "iss": process.env.ISS,
            "sub": props.userId,
            "aud": props.aud,
            "iat": props.iat,
            "scope": props.scope
        };

        return await this.generateJWT(payload);
    }
    
    async createToken(props: {scope: [string],iat:number, userId: number, aud:[string]})
    {
        return await this.generateAccessToken(props);
    }
}
