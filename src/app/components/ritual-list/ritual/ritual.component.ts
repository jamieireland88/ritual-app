import {
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  Output,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { Ritual, RitualType } from '../../../models/models';
import { Router } from '@angular/router';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { gsap } from 'gsap';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { RitualService } from '../../../services/ritual.service';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';


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

  @Output() public ritualDeleted = new EventEmitter<void>();

  protected RitualType = RitualType;

  protected translateService = inject(TranslateService);

  protected type = computed(() => {
    return this.translateService.instant(`type.${this.ritual.type}`);
  });

  private readonly router = inject(Router);

  private readonly cdRef = inject(ChangeDetectorRef);

  private readonly ritualService = inject(RitualService);

  private readonly dialog = inject(Dialog);

  public view(): void {
    this.router.navigate(['/rituals/', this.ritual.id, encodeURI(this.ritual.name)]);
  }

  public action(event?: Event): void {
    event?.stopImmediatePropagation();
    event?.preventDefault();
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

  public onSwipeRight(): void {
    if (this.ritual.actioned) return;
    gsap.timeline()
    .to(this.ritualEle.nativeElement, {transform: 'translateX(20px)', duration: 0.05})
    .to(this.ritualEle.nativeElement, {transform: 'translateX(0px)', duration: 0.05})
    .play().then(() => this.action());
  }

  public onSwipeLeft(): void {
    gsap.timeline()
    .to(this.ritualEle.nativeElement, {transform: 'translateX(20px)', duration: 0.05})
    .to(this.ritualEle.nativeElement, {transform: 'translateX(0px)', duration: 0.05})
    .play().then(() => {
      Haptics.impact({ style: ImpactStyle.Heavy });
    });
    const modal = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: this.translateService.instant('confirmation-modal.delete-ritual.title'),
        message: this.translateService.instant('confirmation-modal.delete-ritual.message'),
      }
    });
    modal.closed.pipe(take(1)).subscribe((action) => {
      if (action) {
        this.ritualService.deleteRitual(this.ritual.id).finally(() => this.ritualDeleted.emit());
        Haptics.impact({ style: ImpactStyle.Heavy });
      }
    });
  }
}
