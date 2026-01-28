import { Component, inject, OnInit } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { HeaderService } from '../../services/header.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly ritualService = inject(RitualService);
  private readonly headerService = inject(HeaderService);

  constructor() {
    this.headerService.resetData();
  }

  async ngOnInit(): Promise<void> {
    await SocialLogin.initialize({
      google: {
        webClientId: '264927648797-l56u7ut9ihdvj7qkdr4qur2i84avgibl.apps.googleusercontent.com',
        iOSClientId: '264927648797-1d87q07j8sbkdsameuh1fn0uj7s6jbg7.apps.googleusercontent.com',
        mode: 'online'
      },
      apple: {
        clientId: 'com.owlsnake-studios.ritual-services',
        redirectUrl: 'https://ritual-95fff.firebaseapp.com/__/auth/handler'
      }
    });

    const googleStatus = await SocialLogin.isLoggedIn({
      provider: 'google'
    });
    const appleStatus = await SocialLogin.isLoggedIn({
      provider: 'google'
    });
    if (googleStatus.isLoggedIn) {
      const code = await SocialLogin.getAuthorizationCode({
        provider: 'google',
      });
      this.ritualService.loginWithCredential('google.com', code.jwt || '', code.accessToken || '')
    }
    if (appleStatus.isLoggedIn) {
      const code = await SocialLogin.getAuthorizationCode({
        provider: 'apple',
      });
      this.ritualService.loginWithCredential('apple.com', code.jwt || '', code.accessToken || '')
    }
  }

  public async loginWithGoogle(): Promise<void> {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    }) as any;
    this.ritualService.loginWithCredential('google.com', res.result.idToken, res.result.accessToken.token)
  }

  public async loginWithApple(): Promise<void> {
    const res = await SocialLogin.login({
      provider: 'apple',
      options: {
        scopes: ['email', 'name'],
      },
    }) as any;
    this.ritualService.loginWithCredential('apple.com', res.result.idToken, res.result.accessToken.token);
  }
}
