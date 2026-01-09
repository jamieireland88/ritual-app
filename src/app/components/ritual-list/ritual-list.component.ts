import { Component, inject } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { Ritual } from '../../models/models';
import { RitualComponent } from './ritual/ritual.component';
import { RitualAddComponent } from './ritual-add/ritual-add.component';
import { HeaderService } from '../../services/header.service';
import { DragDropModule, CdkDragDrop, moveItemInArray, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ritual-list',
  imports: [RitualComponent, RitualAddComponent, DragDropModule, CdkDragPlaceholder],
  templateUrl: './ritual-list.component.html',
  styleUrl: './ritual-list.component.scss'
})
export class RitualListComponent {
  public rituals!: Ritual[];

  public drawerIsOpen: boolean = false;

  private readonly ritualService = inject(RitualService);

  private readonly headerService = inject(HeaderService);

  constructor(){
    this.loadData();
    this.headerService.setData({
      title: 'My Rituals',
      showMenuButton: true,
    })
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rituals, event.previousIndex, event.currentIndex);
  }

  public listChanged(): void {
    this.getRituals();
  }

  public toggleDrawer() {
    this.drawerIsOpen = !this.drawerIsOpen;
  }

  private async getRituals(): Promise<void> {
    this.rituals = await this.ritualService.getRituals();
    return Promise.resolve();
  }

  private async loadData(): Promise<void> {
    await this.getRituals();
    await this.ritualService.getProfile();
    return Promise.resolve();
  }
}
