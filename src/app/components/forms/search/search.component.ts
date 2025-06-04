import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {
  private searchSubject = new Subject<string>();
  private subscription: Subscription;
  @Output() result = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Input({ required: true }) urlPath!: string;

  constructor(private http: HttpClient) {
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.http.get(this.urlPath))
      )
      .subscribe((results) => {
        this.result.emit(results);
      });
  }

  onSearchChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(inputValue);

    this.onSearch.emit(inputValue);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
