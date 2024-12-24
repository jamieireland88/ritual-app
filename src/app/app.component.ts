import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor( private readonly router: Router){}

  public get year(): string {return new Date().getFullYear().toString()}

  public home(): void {
    this.router.navigate(['']);
  }

  public ngOnInit(): void {
    this.router.events.subscribe((value) => {
      if (this.router.url.toString() !== '/') {
        const title = document.getElementById('appTitle');
        title?.classList.add('small');
      }
    });
  }
}
