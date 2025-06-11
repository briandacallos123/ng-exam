import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscriber = interval(2000).subscribe({
      next: (val) => {
        console.log(val, ' <--------');
      },
    });

    this.destroyRef.onDestroy(() => {
      subscriber.unsubscribe();
    });
  }
}
