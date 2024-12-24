import { Component, inject, OnInit } from '@angular/core';
import { RitualService } from '../../../services/ritual.service';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from '../../calendar/calendar.component';

@Component({
  selector: 'app-check-in-button',
  imports: [CalendarComponent],
  templateUrl: './check-in-button.component.html',
  styleUrl: './check-in-button.component.scss',
})
export class CheckInButtonComponent implements OnInit {
  private readonly ritualService = inject(RitualService);
  private readonly route = inject(ActivatedRoute);

  public daily: Date | null = null;

  public isLoading: boolean = true;

  public id: string | null = null;

  public ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.ritualService.getDailyCheckIn(this.id!).subscribe((response) => {
      this.daily = response?.created ? new Date(response.created) : null;
      this.isLoading = false;
    });
  }

  public checkIn(): void {
    this.ritualService.createCheckIn(this.id!).subscribe((response) => {
      this.daily = response?.created ? new Date(response.created) : null;
    });
  }
}
