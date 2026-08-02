import { Component, inject, OnInit, signal } from '@angular/core';
import { RitualService } from '../../services/ritual.service';
import { HeaderService } from '../../services/header.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly headerService = inject(HeaderService);
  private readonly ritualService = inject(RitualService);

  protected isLoading = signal(false);

  constructor() {
    this.headerService.resetData();
  }
}
