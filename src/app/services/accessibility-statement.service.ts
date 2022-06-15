import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, map, catchError, of } from 'rxjs';
import { AdminError } from '../models/error';
import { ConfigService } from './config.service';
import { Response } from "../models/response";
import { AccessibilityStatement } from '../models/accessibilityStatement';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityStatementService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  getByWebsiteName(name:string): Observable<AccessibilityStatement> {
    return this.http
      .get<any>(this.config.getServer("/website/website/"+name), { observe: "response" })
      .pipe(
        retry(3),
        map((res) => {
          const response = <Response>res.body;

          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }
          return <AccessibilityStatement>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

}
