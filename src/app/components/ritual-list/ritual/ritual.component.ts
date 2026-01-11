import { ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { Ritual, RitualType } from '../../../models/models';
import { Router } from '@angular/router';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { gsap } from 'gsap';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { RitualService } from '../../../services/ritual.service';

@Component({
  selector: 'app-ritual',
  imports: [CdkDragHandle],
  templateUrl: './ritual.component.html',
  styleUrl: './ritual.component.scss'
})
export class RitualComponent {
  @ViewChild('check') check!: ElementRef;
  @ViewChild('fire') fire!: ElementRef;
  @ViewChild('ritualEle') ritualEle!: ElementRef;

  @Input() public ritual!: Ritual;

  protected RitualType = RitualType;

  private readonly router = inject(Router);

  private readonly cdRef = inject(ChangeDetectorRef);

  private readonly ritualService = inject(RitualService);

  public view(): void {
    this.router.navigate(['/rituals/', this.ritual.id, encodeURI(this.ritual.name)]);
  }

  public action(event: Event): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.ritual.actioned = true;

    this.cdRef.detectChanges();

    gsap.fromTo(this.check.nativeElement, {scale: 0}, { scale: 1, duration: 1, ease: 'elastic.out' });
    gsap.fromTo(this.fire.nativeElement, {scaleY: 1.4}, { scaleY: 1, duration: 0.5, ease: 'sine.out' });
    gsap.timeline()
    .to(this.ritualEle.nativeElement, {scale: 1.02, duration: 0.1})
    .to(this.ritualEle.nativeElement, {scale: 1, duration: 0.1})
    .play();
    this.ritual.streak++;
    Haptics.impact({ style: ImpactStyle.Heavy });
    this.ritualService.createCheckIn(this.ritual.id);
  }
}
