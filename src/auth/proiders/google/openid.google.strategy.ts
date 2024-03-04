import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google') {
  constructor(){
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,//"869391745908-hopou2j0bcam6t60jlol7l32omil73vu.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,//"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",//
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    })
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}