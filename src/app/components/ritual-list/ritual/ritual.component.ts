import { Component, HostBinding, Input } from '@angular/core';
import { Ritual } from '../../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ritual',
  imports: [],
  templateUrl: './ritual.component.html',
  styleUrl: './ritual.component.scss'
})
export class RitualComponent {
  @Input() public ritual!: Ritual;

  constructor(private readonly router: Router){}

  public view(): void {
    this.router.navigate(['/rituals/', this.ritual.id]);
  }
}
