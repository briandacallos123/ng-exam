import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DBService {
  private http = inject(HttpClient);

  query(path: string): Observable<any> {
    return this.http.get(path, {});
  }
}
