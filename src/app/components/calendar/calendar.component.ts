import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TitlePipe } from '../../pipes/title.pipe';
import { RitualService } from '../../services/ritual.service';

@Component({
  selector: 'app-calendar',
  imports: [TitlePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  @Input() public id!: string;

  public language: string = navigator.language;

  public selectedDate: Date = new Date();

  public selectedMonth: string = '';

  public selectedYear: number = this.selectedDate.getFullYear();

  public daysInMonth: number = 0;

  private daysList: number[] = [];

  constructor(
    private readonly ritualService: RitualService,
    private readonly cdRef: ChangeDetectorRef,
  ){}

  public get isCurrentMonth(): boolean {
    return this.selectedDate.getMonth() === new Date().getMonth();
  }

  public ngOnInit(): void {
    this.setDate();
  }

  public async setDate(): Promise<void> {
    this.language = navigator.language;
    this.selectedMonth = this.selectedDate.toLocaleString(
      `${this.language || 'default'}`, { month: 'long' }
    );
    this.daysInMonth = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      0
    ).getDate();
    this.selectedYear = this.selectedDate.getFullYear();
    await this.ritualService.getMonthlyCheckIns(this.id, this.selectedDate).then((resp) => {
        this.daysList = resp.map((d) => new Date(d.created!).getDate());
        this.cdRef.markForCheck();
    });
  }

  public checkInExists(day: number): boolean {
    return this.daysList.includes(day);
  }

  public switchMonth(direction: number): void {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + direction);
    this.setDate();
  }
}
