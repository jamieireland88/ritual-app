import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { SocketAddress } from 'node:net';
import { Router } from '@angular/router';
import { RitualService } from '../../services/ritual.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';

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
  protected dialog = inject(Dialog);
  protected translateService = inject(TranslateService);

  protected version = signal('1.0.0');

  protected close(): void {
    this.dialogRef.close();
  }

  protected async logout(): Promise<void> {
    this.ritualService.logout();
    this.close();
  }

  protected deleteUserAccount(): void {
    const modal = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: this.translateService.instant('confirmation-modal.delete-user.title'),
        message: this.translateService.instant('confirmation-modal.delete-user.message'),
      }
    });
    modal.closed.pipe(take(1)).subscribe( async (action) => {
      if (action) {
        const result = await this.ritualService.deleteUserAccount();
        if (result) {
          this.router.navigateByUrl('');
          this.close();
        }
      }
    });
  }
}
