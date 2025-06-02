import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavComponent } from '../../components/ui/nav/nav.component';

@Component({
  selector: 'app-home-layout',
  imports: [NavComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css',
})
export class HomeLayoutComponent {}
