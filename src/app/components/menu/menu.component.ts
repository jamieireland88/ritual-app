import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { SocketAddress } from 'node:net';
import { Router } from '@angular/router';
import { RitualService } from '../../services/ritual.service';

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  protected dialogRef = inject(DialogRef);
  protected router = inject(Router);
  protected ritualService = inject(RitualService);

  protected version = signal('1.0.0');

  protected close(): void {
    this.dialogRef.close();
  }

  protected async logout(): Promise<void> {
    this.ritualService.logout();
    this.close();
  }

  protected async deleteUserAccount(): Promise<void> {
    const result = await this.ritualService.deleteUserAccount();
    if (result) {
      this.router.navigateByUrl('');
      this.close();
    }
  }
}
