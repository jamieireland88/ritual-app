import { Component, HostBinding, inject, Input } from '@angular/core';
import { Ritual } from '../../../models/models';
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

  private readonly router = inject(Router);

  public view(): void {
    this.router.navigate(['/rituals/', this.ritual.id, encodeURI(this.ritual.name)]);
  }
}
