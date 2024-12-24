import { Component } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { Ritual } from '../../models/models';
import { RitualComponent } from './ritual/ritual.component';
import { RitualAddComponent } from './ritual-add/ritual-add.component';
import { forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-ritual-list',
  imports: [RitualComponent, RitualAddComponent],
  templateUrl: './ritual-list.component.html',
  styleUrl: './ritual-list.component.scss'
})
export class RitualListComponent {
  public rituals!: Ritual[];

  public drawerIsOpen: boolean = false;

  constructor(
    private readonly ritualService: RitualService,
  ){
    this.loadData();
  }

  public listChanged(): void {
    this.getRituals();
  }

  public toggleDrawer() {
    this.drawerIsOpen = !this.drawerIsOpen;
  }

  private getRituals(): void {
    this.ritualService.getRituals().subscribe((items: Ritual[]) => {
      this.rituals = items;
    });
  }

  private loadData(): void {
    const requests = {
      rituals: this.ritualService.getRituals(),
      profile: this.ritualService.getProfile(),
    }
    forkJoin(requests).subscribe((responses) => {
      this.rituals = responses.rituals;
      console.log(responses.profile);
    });
  }
}
