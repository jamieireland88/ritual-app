import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RitualService } from '../../services/ritual.service';
import { HeaderService } from '../../services/header.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from '../../../environment';

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

  public async ngOnInit(): Promise<void> {
    await SocialLogin.initialize({
      apple: {
        clientId: environment.appleClientId
      }
    })
  }

  public async login(): Promise<void> {
    const res = await SocialLogin.login({
      provider: 'apple',
      options: {
        scopes: ['email', 'name'],
      },
    });
    // this.ritualService.login(
    //   this.loginForm.value.email,
    //   this.loginForm.value.password,
    // );
  }

  public loginWithGoogle(): void {
    this.ritualService.loginWithGoogle();
  }
}
