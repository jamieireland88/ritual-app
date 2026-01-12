import { Component, inject, OnInit } from '@angular/core';
import { RitualService } from '../../../services/ritual.service';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from '../../calendar/calendar.component';
import { Daily } from '../../../models/raw-models';
import { HeaderService } from '../../../services/header.service';
import { StatTileComponent } from '../../stat-tile/stat-tile.component';
import { Ritual } from '../../../models/models';

@Component({
  selector: 'app-check-in-button',
  imports: [CalendarComponent, StatTileComponent],
  templateUrl: './check-in-button.component.html',
  styleUrl: './check-in-button.component.scss',
})
export class CheckInButtonComponent implements OnInit {
  private readonly ritualService = inject(RitualService);
  private readonly route = inject(ActivatedRoute);
  private readonly headerService = inject(HeaderService);

  public ritual!: Ritual;

  public isLoading: boolean = true;

  public id: string | null = null;

  public name?: string;

  public async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');

    // TODO: create get for individual ritual
    const rituals = (await this.ritualService.getRituals()).filter((item) => item.id === this.id);
    if (rituals.length) {
      this.ritual = rituals[0];
    }
    if (!this.ritual) {
      return;
    }

    console.log(this.ritual);

    this.headerService.setData({
      title: this.ritual.name,
      showBackButton: true,
      showMenuButton: true,
    });
  }

  public async checkIn(): Promise<void> {

  }
}
