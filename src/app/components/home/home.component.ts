import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RitualService } from '../../services/ritual.service';
import { HeaderService } from '../../services/header.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public loginForm: FormGroup;

  private readonly ritualService = inject(RitualService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly headerService = inject(HeaderService);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
    this.headerService.resetData();
  }

  async ngOnInit(): Promise<void> {
    await SocialLogin.initialize({
      google: {
        webClientId: '264927648797-l56u7ut9ihdvj7qkdr4qur2i84avgibl.apps.googleusercontent.com',        // Required for Android and Web
        iOSClientId: 'YOUR_IOS_CLIENT_ID',        // Required for iOS
        iOSServerClientId: 'YOUR_WEB_CLIENT_ID',  // Required for iOS offline mode and server authorization (same as webClientId)
        mode: 'online',  // 'online' or 'offline'
      },
      apple: {
        clientId: 'com.owlsnake-studios.ritual-services'
      }
    });

    const status = await SocialLogin.isLoggedIn({
      provider: 'google'
    });
    if (status.isLoggedIn) {
      const code = await SocialLogin.getAuthorizationCode({
        provider: 'google',
      });
      this.ritualService.loginWithCredential('google.com', code.jwt || '', code.accessToken || '')
    }
  }

  public async login(): Promise<void> {
    this.ritualService.login(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );
  }

  public async loginWithGoogle(): Promise<void> {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    }) as any;
    this.ritualService.loginWithCredential('google.com', res.result.idToken, res.result.accessToken.token)
    console.log(res);
  }

  public async loginWithApple(): Promise<void> {
    const res = await SocialLogin.login({
      provider: 'apple',
      options: {
        scopes: ['email', 'name'],
      },
    }) as any;
    this.ritualService.loginWithCredential('apple.com', res.result.idToken, res.result.accessToken.token)
    console.log(res);
  }
}
