import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-tile',
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss',
  imports: [PercentPipe]
})
export class StatTileComponent {
  public title = input.required<string>();
  public number = input.required<number>();
  public icon = input.required<string>();
  public isPercent = input<boolean>(false);
  public unit = input<string | null>(null);
}
