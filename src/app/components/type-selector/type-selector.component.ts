import { Component, computed, effect, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RitualType } from '../../models/models';

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrl: './type-selector.component.scss',
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

  protected helptext = computed(() => {
    switch(this.type()) {
      case RitualType.Daily:
        return 'Selecting daily will enable you to perform this Ritual once per day';
      case RitualType.Weekly:
        return 'Selecting weekly will enable you to perform this Ritual once per week (Monday to Sunday)';
      case RitualType.Monthly:
        return 'Selecting monthly will enable you to perform this Ritual once per calendar month';
    }
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
