import { Component, inject, OnInit } from '@angular/core';
import { RitualService } from '../../../services/ritual.service';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from '../../calendar/calendar.component';
import { Daily } from '../../../models/raw-models';
import { HeaderService } from '../../../services/header.service';
import { StatTileComponent } from '../../stat-tile/stat-tile.component';

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

  public daily: Date | null = null;

  public isLoading: boolean = true;

  public id: string | null = null;

  public name?: string;

  public async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name') || undefined;
    const daily: Daily | null = await this.ritualService.getDailyCheckIn(this.id!);
    this.daily = daily!.created;
    this.isLoading = false;
    // TODO: find a better way to do this that triggers dead on midnight
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      if (hour === 0) {
        clearInterval(interval);
        this.ngOnInit();
      }
    }, 60000);

    this.headerService.setData({
      title: decodeURI(this.name || ''),
      showBackButton: true,
      showMenuButton: true,
    });
  }

  public async checkIn(): Promise<void> {

  }
}
