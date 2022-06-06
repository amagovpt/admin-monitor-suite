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

  getByWebsiteId(id:string): Observable<Array<AccessibilityStatement>> {
    return this.http
      .get<any>(this.config.getServer("accessibility-statement/website/"+id), { observe: "response" })
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

          return <Array<AccessibilityStatement>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

}
