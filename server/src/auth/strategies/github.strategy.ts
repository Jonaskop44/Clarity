import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import githubOauthConfig from '../config/github-oauth.config';
import { ConfigType } from '@nestjs/config';
import { VerifyCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(githubOauthConfig.KEY)
    private githubConfiguration: ConfigType<typeof githubOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: githubConfiguration.clientID,
      clientSecret: githubConfiguration.clientSecret,
      callbackURL: githubConfiguration.callbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.authService.handleGithubLogin(profile);
  }
}
