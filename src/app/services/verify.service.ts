import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, retry, catchError, delay } from "rxjs/operators";
import * as _ from "lodash";

import { ConfigService } from "./config.service";
import { UserService } from "./user.service";
import { MessageService } from "./message.service";

import { Response } from "../models/response";
import { AdminError } from "../models/error";

@Injectable({
  providedIn: "root",
})
export class VerifyService {
  constructor(
    private http: HttpClient,
    private user: UserService,
    private message: MessageService,
    private config: ConfigService
  ) {}


  govUserExists(username: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/gov-user/exists/" + username), {
        observe: "response",
      })
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

          return <boolean>response.result ? { notTakenName: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  userExists(username: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/user/exists/" + username), {
        observe: "response",
      })
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

          return <boolean>response.result ? { notTakenUsername: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  directoryNameExists(name: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/directory/exists/" + name), {
        observe: "response",
      })
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
          return response.result ? { notTakenName: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  tagNameExists(name: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/tag/exists/" + name), {
        observe: "response",
      })
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
          return response.result ? { notTakenName: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  tagNameDialogExists(name: string): Observable<boolean> {
    return this.http
      .get(this.config.getServer("/tag/exists/" + name), {
        observe: "response",
      })
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
          return response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  entityShortNameExists(name: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/entity/exists/shortName/" + name), {
        observe: "response",
      })
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

          return response.result ? { notTakenName: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  entityLongNameExists(name: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/entity/exists/longName/" + name), {
        observe: "response",
      })
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

          return response.result ? { notTakenName: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  websiteNameExists(name: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/gov-user/exists/" + name), {
        observe: "response",
      })
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
          console.log(response.result);
          return response.result ? { notTakenName: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  websiteUrlExists(url: string): Observable<any> {
    return this.http
      .get<any>(
        this.config.getServer("/website/exists/url/" + encodeURIComponent(url)),
        { observe: "response" }
      )
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

          return response.result ? { notTakenUrl: true } : null;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }
}
