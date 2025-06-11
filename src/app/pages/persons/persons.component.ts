import { Component, DestroyRef, Inject, inject, OnInit } from '@angular/core';
import { ControlComponent } from '../../components/forms/control/control.component';
import { TableComponent } from '../../components/forms/table/table.component';
import { HttpClient } from '@angular/common/http';
import { type personType } from '../../shared/models/person.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { SearchComponent } from '../../components/forms/search/search.component';
import { environment } from '../../../environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-persons',
  imports: [ControlComponent, TableComponent, SearchComponent, RouterLink],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css',
})
export class PersonsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  baseUrl = environment.apiUrl;
  isLoading = false;

  personList: any = [];

  toSearch = '';

  personTableHeader = [
    {
      key: 'name',
      label: 'name',
    },
    {
      key: 'team',
      label: 'team',
    },
    {
      key: 'salary',
      label: 'salary',
    },
    {
      key: 'gender',
      label: 'gender',
    },
    {
      key: 'status',
      label: 'status',
    },
  ];

  subHeader = [
    {
      key: 'title',
      label: 'hobbies',
    },
    {
      key: 'schedule',
      label: 'schedule',
    },
    {
      key: 'monthlyBudget',
      label: 'Monthly Budget',
    },
  ];

  subRow = [];
  subRowKey = 'hobbies';

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.fetchPersons();
  }

  get personApiUrl(): string {
    return `${this.baseUrl}/persons`;
  }

  fetchPersons() {
    this.isLoading = true;
    setTimeout(() => {
      const response = this.httpClient
        .get(this.personApiUrl)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (resData) => {
            this.personList = resData;
          },
          complete: () => {
            this.isLoading = false;
          },
        });

      this.destroyRef.onDestroy(() => response.unsubscribe());
    });
  }

  getHobbies(id: number): personType[] {
    return this.personList
      .find((user: personType) => user.id === id)
      ?.map((user: personType) => user.hobbies);
  }

  getPerson(person: personType) {
    this.subRow = this.personList?.find(
      (item: personType) => Number(item.id) === Number(person?.id)
    )?.hobbies;
  }

  getPersons(res: any) {
    this.personList = res?.filter((item: any) => {
      if (item.name.toLowerCase().includes(this.toSearch.toLowerCase())) {
        return item;
      }
    });
  }

  getByName(res: any) {
    this.toSearch = res;
  }
}
