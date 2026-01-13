import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { Ritual } from '../../models/models';
import { RitualAddComponent } from '../ritual-list/ritual-add/ritual-add.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.component.html',
  styleUrl: './action-sheet.component.scss'
})
export class ActionSheetComponent {
  private dialogRef = inject(DialogRef);
  private dialog = inject(Dialog);

  private ritualService = inject(RitualService);

  private ritual: Ritual = inject(DIALOG_DATA).ritual

  private router = inject(Router);


  protected handleAction(type: string) {
    switch(type) {
      case 'delete':
        this.ritualService.deleteRitual(this.ritual.id);
        // TODO: add confirmation modal
        this.router.navigate(['rituals']);
        break;
      case 'edit':
        this.dialog.open(RitualAddComponent, {
          data: { ritual: this.ritual }
        })
        break;
    }
    this.dialogRef.close();
  }
}
