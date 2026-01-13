import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { Dialog } from '@angular/cdk/dialog';
import { ActionSheetComponent } from '../action-sheet/action-sheet.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected showBackButton = signal(false);
  protected showMenuButton = signal(false);
  protected readonly location = inject(Location);

  private readonly router = inject(Router);
  private readonly headerService = inject(HeaderService);
  private readonly dialog = inject(Dialog);

  protected headerData = computed(() => this.headerService.getData());

  protected home(): void {
    this.router.navigate(['rituals']);
  }

  protected openMenu(): void {
    this.dialog.open(ActionSheetComponent, {
      data: { ritual: this.headerData().ritual }
    });
  }
}
