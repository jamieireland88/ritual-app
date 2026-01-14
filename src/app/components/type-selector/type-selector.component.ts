import { Component, computed, effect, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RitualType } from '../../models/models';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrl: './type-selector.component.scss',
  imports: [TranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeSelectorComponent),
      multi: true
    }
  ]
})
export class TypeSelectorComponent implements ControlValueAccessor {
  protected type = signal<RitualType>(RitualType.Daily);

  protected RitualType = RitualType;

  protected translateService = inject(TranslateService);

  protected helptext = computed(() => {
    return this.translateService.instant(`type.${this.type()}.helptext`)
  });

  private onChange = (value: RitualType) => {};

  private onTouched = () => {};

  constructor() {
    effect(() => {
      const type = this.type();
      this.onChange(type);
    });
  }

  writeValue(value: RitualType): void {
    this.type.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
