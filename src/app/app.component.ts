import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {TranslateService} from "@ngx-translate/core";

const supportedLanguages: string[] = [
  'en', 'es', 'fr', 'it', 'de', 'ga'
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public get year(): string {return new Date().getFullYear().toString()}

  private translateService = inject(TranslateService)

  ngOnInit(): void {
      let browserLang = this.translateService.getBrowserLang();
      browserLang = supportedLanguages.includes(browserLang || 'en') ? browserLang : 'en';
      this.translateService.use(browserLang || 'en');
  }
}
