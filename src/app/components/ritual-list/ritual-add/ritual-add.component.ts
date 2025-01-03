import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RitualService } from '../../../services/ritual.service';

@Component({
  selector: 'app-ritual-add',
  imports: [ReactiveFormsModule],
  templateUrl: './ritual-add.component.html',
  styleUrl: './ritual-add.component.scss'
})
export class RitualAddComponent{
  public addForm: FormGroup;

  @Output()
  public toggleDrawer = new EventEmitter<void>();

  @Output()
  public listChanged = new EventEmitter<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ritualService: RitualService,
  ){
    this.addForm = this.formBuilder.group({
      name: new FormControl('', Validators.required)
    })
  }

  public closeDrawer(): void {
    this.toggleDrawer.emit();
  }

  public async create(): Promise<void> {
    await this.ritualService.createRitual(this.addForm.value.name).then(() => {
      this.listChanged.emit();
      this.closeDrawer();
    });
  }
}
