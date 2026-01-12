import { Component, ElementRef, forwardRef, inject, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconType } from '../../models/models';
import { Dialog } from '@angular/cdk/dialog';
import { IconSelectorDrawerComponent } from './icon-selector-drawer/icon-selector-drawer.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-icon-selector',
  imports: [],
  templateUrl: './icon-selector.component.html',
  styleUrl: './icon-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconSelectorComponent),
      multi: true
    }
  ]
})
export class IconSelectorComponent implements ControlValueAccessor {
  protected icon: IconType | null = null;

  public drawerToggle = signal(false);

  private dialog = inject(Dialog);

  private onChange = (value: IconType | null) => {};

  private onTouched = () => {};

  writeValue(value: IconType | null): void {
    this.icon = value || null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  openDrawer(): void {
    const dialogRef = this.dialog.open(IconSelectorDrawerComponent, {
      data: { selected: this.icon }
    });

    dialogRef.closed.pipe(take(1)).subscribe(result => {
      this.icon = result as IconType;
      this.onChange(this.icon);
      this.onTouched();
    });
  }
}
