import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RitualService } from '../../services/ritual.service';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public loginForm: FormGroup;

  constructor(
    private readonly ritualService: RitualService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  public login(): void {
    this.ritualService.login(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );
  }

  public loginWithGoogle(): void {
    this.ritualService.loginWithGoogle();
  }
}
