import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RitualService } from '../../../services/ritual.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponent } from '../../calendar/calendar.component';
import { HeaderService } from '../../../services/header.service';
import { StatTileComponent } from '../../stat-tile/stat-tile.component';
import { Ritual } from '../../../models/models';
import { Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-check-in-button',
  imports: [CalendarComponent, StatTileComponent, TranslatePipe],
  templateUrl: './check-in-button.component.html',
  styleUrl: './check-in-button.component.scss',
})
export class CheckInButtonComponent implements OnInit, OnDestroy {
  private readonly ritualService = inject(RitualService);
  private readonly route = inject(ActivatedRoute);
  private readonly headerService = inject(HeaderService);

  public ritual!: Ritual;

  public isLoading: boolean = true;

  public id: string | null = null;

  public name?: string;

  private destroy$ = new Subject<void>;

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

    this.headerService.setData({
      title: this.ritual.name,
      showBackButton: true,
      showMenuButton: true,
      ritual: this.ritual,
    });

    this.ritualService.ritualUpdated.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
