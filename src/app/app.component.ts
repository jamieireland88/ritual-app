import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  public showBackButton: boolean = false;

  constructor(
    public readonly location: Location,
    private readonly router: Router,
  ){}

  public get year(): string {return new Date().getFullYear().toString()}

  public home(): void {
    this.router.navigate(['']);
  }

  public async ngOnInit(): Promise<void> {
    this.router.events.subscribe((value) => {
      const title = document.getElementById('appTitle');
      if (this.router.url.toString() !== '/') {
        title?.classList.add('small');
        this.showBackButton = true;
      } else {
        title?.classList.remove('small');
        this.showBackButton = false;
      }
    });
  }
}
