import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { SocketAddress } from 'node:net';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  protected dialogRef = inject(DialogRef);
  protected router = inject(Router);

  protected version = signal('1.0.0');

  protected close(): void {
    this.dialogRef.close();
  }

  protected async logout(): Promise<void> {
    const appleStatus = await SocialLogin.isLoggedIn({ provider: 'apple' });
    let provider: 'google' | 'apple' = 'google';
    if (appleStatus.isLoggedIn) {
      provider = 'apple';
    }
    await SocialLogin.logout({ provider }).finally(() => {
      this.router.navigateByUrl('');
      this.close();
    });
  }
}
