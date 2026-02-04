import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { Ritual } from '../../models/models';
import { RitualAddComponent } from '../ritual-list/ritual-add/ritual-add.component';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.component.html',
  styleUrl: './action-sheet.component.scss',
  imports: [TranslatePipe]
})
export class ActionSheetComponent {
  private dialogRef = inject(DialogRef);
  private dialog = inject(Dialog);

  private ritualService = inject(RitualService);

  private ritual: Ritual = inject(DIALOG_DATA).ritual

  private router = inject(Router);

  private translateService = inject(TranslateService);


  protected handleAction(type: string) {
    switch(type) {
      case 'delete':
        this.handleDelete();
        break;
      case 'edit':
        this.dialog.open(RitualAddComponent, {
          data: { ritual: this.ritual }
        })
        break;
    }
    this.dialogRef.close();
  }

  private handleDelete(): void {
    this.dialogRef.close();
    const modal = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: this.translateService.instant('confirmation-modal.delete-ritual.title'),
        message: this.translateService.instant('confirmation-modal.delete-ritual.message'),
      }
    });
    modal.closed.pipe(take(1)).subscribe((action) => {
      if (action) {
        this.ritualService.deleteRitual(this.ritual.id);
        this.router.navigate(['rituals']);
        Haptics.impact({ style: ImpactStyle.Heavy });
      }
    });
  }
}
