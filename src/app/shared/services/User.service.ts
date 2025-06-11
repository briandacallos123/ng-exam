import { inject, Injectable } from '@angular/core';
import { DBService } from './DB.service';
import { personType } from '../models/person.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  DB = inject(DBService);

  getUsers(): Observable<personType[]> {
    return this.DB.query('http://localhost:3000/persons');
  }
}
