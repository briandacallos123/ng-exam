import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DBService } from './DB.service';

@Injectable({
  providedIn: 'root',
})
export class Places {
  constructor(private DB: DBService) {}

  get getAllRegions() {
    return this.DB.query(
      'https://psgc.thecodebit.digital/api/v1/region?limit=18'
    );
  }

  getAllCities(regionCode: number) {
    return this.DB.query(
      `https://psgc.thecodebit.digital/api/v1/region/${regionCode}/cities`
    );
  }
}
