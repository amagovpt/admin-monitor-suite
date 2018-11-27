import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';
@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(
    private userService: UserService,
    private message: MessageService,
    private config: ConfigService
  ) { }

  user(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/users/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('USERS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  tag(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/tags/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('TAGS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  entity(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/entities/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('ENTITIES_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  website(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/websites/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('WEBSITES_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  domain(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/domains/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('DOMAINS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  page(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/pages/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('PAGES_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  evaluation(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/evaluations/delete'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('EVALUATIONS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }
}