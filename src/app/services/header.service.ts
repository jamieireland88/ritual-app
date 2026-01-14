import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Ritual } from '../models/models';
import { TranslateService } from '@ngx-translate/core';

export interface HeaderData {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  smallTitle?: boolean;
  ritual?: Ritual
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private data: WritableSignal<HeaderData> = signal({});

  private translateService = inject(TranslateService)

  public getData = computed(() => {
    return {
      ...this.data(),
    ...(this.data().showBackButton || this.data().showMenuButton ? { smallTitle: true } : {}),
    ...(!this.data().title ? { title: this.translateService.instant('common.ritual') } : { title: this.data().title }),
    }
  });

  public setData(data: HeaderData): void {
    this.data.set(data);
  }

  public resetData(): void {
    this.data.set({});
  }
}
