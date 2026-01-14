import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RitualService } from '../../../services/ritual.service';
import { IconType, RitualType } from '../../../models/models';
import { IconSelectorComponent } from "../../icon-selector/icon-selector.component";
import { TypeSelectorComponent } from "../../type-selector/type-selector.component";
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-ritual-add',
  imports: [ReactiveFormsModule, IconSelectorComponent, TypeSelectorComponent],
  templateUrl: './ritual-add.component.html',
  styleUrl: './ritual-add.component.scss'
})
export class RitualAddComponent{
  public addForm: FormGroup;

  @Output()
  public listChanged = new EventEmitter<void>();

  protected iconList = Object.values(IconType);
  protected readonly ritual = inject(DIALOG_DATA)?.ritual;

  private readonly formBuilder = inject(FormBuilder);
  private readonly ritualService = inject(RitualService);
  private readonly dialogRef = inject(DialogRef);

  constructor() {
    this.addForm = this.formBuilder.group({
      name: new FormControl(this.ritual?.name || '', Validators.required),
      icon: new FormControl<IconType | null>(this.ritual?.icon || null),
      type: new FormControl<RitualType>(this.ritual?.type || RitualType.Daily),
    })
  }

  public closeDrawer(): void {
    this.dialogRef.close();
  }

  public async submit(): Promise<void> {
    const { name, icon, type } = this.addForm.value;

    if (!this.ritual) {
      await this.ritualService.createRitual(name, type, icon).then(() => {
        this.listChanged.emit();
        this.closeDrawer();
      });
    } else {
      await this.ritualService.updateRitual(this.ritual.id, name, type, icon).then(() => {
        this.listChanged.emit();
        this.closeDrawer();
      });
    }
  }
}
