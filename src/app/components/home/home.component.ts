import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RitualService } from '../../services/ritual.service';
import { HeaderService } from '../../services/header.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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

  public async login(): Promise<void> {
    this.ritualService.login(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );
  }

  public loginWithGoogle(): void {
    this.ritualService.loginWithGoogle();
  }
}
