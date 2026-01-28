import { Component, inject } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { Ritual } from '../../models/models';
import { RitualComponent } from './ritual/ritual.component';
import { RitualAddComponent } from './ritual-add/ritual-add.component';
import { HeaderService } from '../../services/header.service';
import { DragDropModule, CdkDragDrop, moveItemInArray, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { Subject, take } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Dialog } from '@angular/cdk/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ritual-list',
  imports: [
    RitualComponent,
    DragDropModule,
    CdkDragPlaceholder,
    TranslatePipe
  ],
  templateUrl: './ritual-list.component.html',
  styleUrl: './ritual-list.component.scss'
})
export class RitualListComponent {
  public rituals!: Ritual[];

  public drawerIsOpen: boolean = false;

  private readonly ritualService = inject(RitualService);

  private readonly headerService = inject(HeaderService);

  private readonly translateService = inject(TranslateService);

  private readonly dialog = inject(Dialog);

  constructor(){
    this.loadData();
    this.headerService.setData({
      title: this.translateService.instant('list.my-rituals'),
      showMenuButton: true,
      smallTitle: true,
    })
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rituals, event.previousIndex, event.currentIndex);
    this.ritualService.updateSortOrder(this.rituals);
  }

  public swapped(): void {
    Haptics.impact({ style: ImpactStyle.Light });
  }

  public async listChanged(event?: Subject<void>): Promise<void> {
    await this.getRituals();
    event?.next();
  }

  public openDrawer() {
    const dialogRef = this.dialog.open(RitualAddComponent);
    dialogRef.closed.pipe(take(1)).subscribe(() => this.listChanged());
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
