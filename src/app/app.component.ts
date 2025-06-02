import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ngExam';
}
