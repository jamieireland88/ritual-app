import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RitualService } from '../../services/ritual.service';

@Component({
  selector: 'app-home',
  imports: [GoogleSigninButtonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private readonly router: Router,
    private authService: SocialAuthService,
    private readonly ritualService: RitualService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.router.navigate(['rituals']);
    });
    this.ritualService.isAuthenticated$.subscribe((auth) => {
      if (auth) {
        this.router.navigate(['rituals']);
      }
    });
  }

  public async login(): Promise<void> {
      this.ritualService.login(
        this.loginForm.value.email,
        this.loginForm.value.password,
      );
  }
}
