import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-tile',
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss'
})
export class StatTileComponent {
  public title = input.required<string>();
  public number = input.required<number>();
  public icon = input.required<string>();
  public suffix = input<string | null>(null);
  public unit = input<string | null>(null);
}
