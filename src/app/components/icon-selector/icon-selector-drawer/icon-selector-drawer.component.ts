import { Component, inject } from '@angular/core';
import { IconType } from '../../../models/models';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-icon-selector-drawer',
  imports: [],
  templateUrl: './icon-selector-drawer.component.html',
  styleUrl: './icon-selector-drawer.component.scss'
})
export class IconSelectorDrawerComponent {
  protected iconOptions = Object.values(IconType);

  protected selected: IconType | null = inject(DIALOG_DATA).selected;

  private dialogRef = inject(DialogRef);

  close() {
    this.dialogRef.close(this.selected);
  }

  handleSelection(selected: IconType): void {
    this.selected = selected;
    this.close();
  }
}
