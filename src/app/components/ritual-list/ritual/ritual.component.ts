import { Component, inject, Input } from '@angular/core';
import { Ritual, RitualType } from '../../../models/models';
import { Router } from '@angular/router';
import { CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ritual',
  imports: [CdkDragHandle],
  templateUrl: './ritual.component.html',
  styleUrl: './ritual.component.scss'
})
export class RitualComponent {
  @Input() public ritual!: Ritual;

  protected RitualType = RitualType;

  private readonly router = inject(Router);

  public view(): void {
    this.router.navigate(['/rituals/', this.ritual.id, encodeURI(this.ritual.name)]);
  }

  public action(event: Event): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.ritual.actioned = true;
  }
}
