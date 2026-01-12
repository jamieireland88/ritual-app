import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RitualService } from '../../../services/ritual.service';
import { IconType } from '../../../models/models';
import { IconSelectorComponent } from "../../icon-selector/icon-selector.component";

@Component({
  selector: 'app-ritual-add',
  imports: [ReactiveFormsModule, IconSelectorComponent],
  templateUrl: './ritual-add.component.html',
  styleUrl: './ritual-add.component.scss'
})
export class RitualAddComponent{
  public addForm: FormGroup;

  @Output()
  public toggleDrawer = new EventEmitter<void>();

  @Output()
  public listChanged = new EventEmitter<void>();

  protected iconList = Object.values(IconType);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ritualService: RitualService,
  ){
    this.addForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      icon: new FormControl<IconType | null>(null),
    })
  }

  public closeDrawer(): void {
    this.toggleDrawer.emit();
  }

  public async create(): Promise<void> {
    await this.ritualService.createRitual(this.addForm.value.name, this.addForm.value.icon).then(() => {
      this.listChanged.emit();
      this.closeDrawer();
    });
  }
}
