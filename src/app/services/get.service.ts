import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, retry, catchError } from "rxjs/operators";
import * as _ from "lodash";

import { ConfigService } from "./config.service";
import { UserService } from "./user.service";
import { MessageService } from "./message.service";

import { Response } from "../models/response";
import { AdminError } from "../models/error";
import { User } from "../models/user";
import { Tag } from "../models/tag";
import { Entity } from "../models/entity";
import { Website } from "../models/website";
import { Page } from "../models/page";
import { GovUser } from "../models/govUser";

@Injectable({
  providedIn: "root",
})
export class GetService {
  constructor(
    private user: UserService,
    private http: HttpClient,
    private message: MessageService,
    private config: ConfigService
  ) {}
  
  getA11yStatementById(id:number): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/accessibility-statement/"+id), {
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

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfA11yStatements(): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/accessibility-statement/"), {
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

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }


  govUser(userId: number): Observable<GovUser> {
    return this.http
      .get<any>(this.config.getServer("/gov-user/" + userId), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }
  govUsers(): Observable<GovUser[]> {
    return this.http
      .get<any>(this.config.getServer("/gov-user/all"), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          const response = <Response>res.body;
          console.log(res);
          if (res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <GovUser[]>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }
  numberOfStudyMonitorUsers(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/user/studyMonitor/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfMyMonitorUsers(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/user/myMonitor/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfStudyMonitorTags(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/tag/studyMonitor/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfObservatoryDirectories(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/directory/observatory/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfObservatoryTags(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/tag/observatory/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfObservatoryEntities(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/entity/observatory/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfStudyMonitorWebsites(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/website/studyMonitor/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfObservatoryPages(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/page/observatory/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfMyMonitorWebsites(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/website/myMonitor/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfObservatoryWebsites(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/website/observatory/total"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfAdminPagesBeingEvaluated(): Observable<number> {
    return this.http
      .get<any>(
        this.config.getServer("/page/evaluationList/admin/evaluating"),
        {
          observe: "response",
        }
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfAdminPagesWaitingForEvaluation(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/page/evaluationList/admin/waiting"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfAdminPagesWithError(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/page/evaluationList/admin/error"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfUserPagesBeingEvaluated(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/page/evaluationList/user/evaluating"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfUserPagesWaitingForEvaluation(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/page/evaluationList/user/waiting"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  numberOfUserPagesWithError(): Observable<number> {
    return this.http
      .get<any>(this.config.getServer("/page/evaluationList/user/error"), {
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfUsers(): Observable<Array<User>> {
    return this.http
      .get<any>(this.config.getServer("/user/all"), { observe: "response" })
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

          return <Array<User>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfDirectories(): Observable<Array<any>> {
    return this.http
      .get<any>(this.config.getServer("/directory/all"), {
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfTags(): Observable<Array<Tag>> {
    return this.http
      .get<any>(this.config.getServer("/tag/all"), { observe: "response" })
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

          return <Array<Tag>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfOfficialTags(): Observable<Array<Tag>> {
    return this.http
      .get<any>(this.config.getServer("/tag/allOfficial"), {
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

          return <Array<Tag>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfEntityCount(search: string): Observable<number> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/entity/all/count/search=${encodeURIComponent(search)}`
        ),
        {
          observe: "response",
        }
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfEntities(
    size: number,
    page: number,
    sort: string,
    direction: string,
    search: string
  ): Observable<Array<Entity>> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/entity/all/${size}/${page}/sort=${sort}/direction=${direction}/search=${encodeURIComponent(
            search
          )}`
        ),
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

          return <Array<Entity>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfWebsiteCount(search: string): Observable<number> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/website/all/count/search=${encodeURIComponent(search)}`
        ),
        {
          observe: "response",
        }
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfWebsites(
    size: number,
    page: number,
    sort: string,
    direction: string,
    search: string
  ): Observable<Array<Website>> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/website/all/${size}/${page}/sort=${sort}/direction=${direction}/search=${encodeURIComponent(
            search
          )}`
        ),
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfOfficialWebsites(): Observable<Array<Website>> {
    return this.http
      .get<any>(this.config.getServer("/website/official"), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfEntityWebsites(entity: string): Observable<Array<Website>> {
    return this.http
      .get<any>(this.config.getServer("/entity/websites/" + entity), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfEntityWebsitePages(entity: string): Observable<Array<any>> {
    return this.http
      .get<any>(this.config.getServer("/entity/websites/pages/" + entity), {
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfStudiesTagWebsites(
    user: string,
    tag: string
  ): Observable<Array<Website>> {
    return this.http
      .get<any>(
        this.config.getServer(`/tag/${tag}/user/${user}/websites/study`),
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfUserWebsites(user: string): Observable<Array<Website>> {
    return this.http
      .get<any>(this.config.getServer("/user/websites/" + user), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfUserTags(user: string): Observable<Array<Website>> {
    return this.http
      .get(this.config.getServer("/user/tags/" + user), { observe: "response" })
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfDirectoryTags(directory: string): Observable<Array<Tag>> {
    return this.http
      .get(this.config.getServer(`/directory/${directory}/tags`), {
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

          return <Array<Tag>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfDirectoryWebsites(directory: string): Observable<Array<Website>> {
    return this.http
      .get(this.config.getServer(`/directory/${directory}/websites`), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfDirectoryWebsitesPages(directory: string): Observable<Array<any>> {
    return this.http
      .get(this.config.getServer(`/directory/${directory}/websites/pages`), {
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfTagWebsites(user: string, tag: string): Observable<Array<Website>> {
    return this.http
      .get(this.config.getServer(`/tag/${tag}/user/${user}/websites`), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfTagWebsitePages(tag: string): Observable<Array<any>> {
    return this.http
      .get(this.config.getServer(`/tag/${tag}/websites/pages`), {
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfUserWebsitePages(
    tag: string,
    user: string,
    website: string
  ): Observable<Array<Page>> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/tag/${tag}/website/${website}/user/${user}/pages`
        ),
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

          return <Array<Page>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfWebsitePages(websiteId: number): Observable<Array<Page>> {
    return this.http
      .get<any>(this.config.getServer("/website/pages/" + websiteId), {
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

          return <Array<Page>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfWebsitePagesByName(
    user: string,
    website: string
  ): Observable<Array<any>> {
    return this.http
      .get<any>(
        this.config.getServer(`/website/${website}/user/${user}/pages`),
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfPageCount(search: string): Observable<number> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/page/all/count/search=${encodeURIComponent(search)}`
        ),
        {
          observe: "response",
        }
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

          return <number>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfPages(
    size: number,
    page: number,
    sort: string,
    direction: string,
    search: string
  ): Observable<Array<Page>> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/page/all/${size}/${page}/sort=${sort}/direction=${direction}/search=${encodeURIComponent(
            search
          )}`
        ),
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

          return <Array<Page>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfPageEvaluations(page: string, type: string): Observable<Array<any>> {
    return this.http
      .get<any>(
        this.config.getServer(
          `/evaluation/${type}/page/${encodeURIComponent(page)}`
        ),
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfPagesWithError(): Observable<Array<any>> {
    return this.http
      .get<any>(this.config.getServer(`/page/evaluationList/error`), {
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfCrawls(): Observable<Array<any>> {
    return this.http
      .get<any>(this.config.getServer("/crawler/all"), { observe: "response" })
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfUrisFromCrawlWebsiteId(crawlWebsiteId: number): Observable<Array<any>> {
    return this.http
      .get<any>(
        this.config.getServer("/crawler/getByCrawlWebsiteID/" + crawlWebsiteId),
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

          return <Array<any>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  websitesWithoutUser(): Observable<Array<Website>> {
    return this.http
      .get<any>(this.config.getServer("/website/withoutUser"), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  websitesWithoutEntity(): Observable<Array<Website>> {
    return this.http
      .get<any>(this.config.getServer("/website/withoutEntity"), {
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

          return <Array<Website>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  listOfMyMonitorUsers(): Observable<Array<User>> {
    return this.http
      .get<any>(this.config.getServer("/user/myMonitor"), {
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

          return <Array<User>>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  userType(username: string): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/user/type/" + username), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  userInfo(userId: number): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/user/info/" + userId), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  directoryInfo(directoryId: number): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/directory/info/" + directoryId), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  tagInfo(tagId: number): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/tag/info/" + tagId), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  entityInfo(entityId: number): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/entity/info/" + entityId), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  websiteInfo(websiteId: number): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/website/info/" + websiteId), {
        observe: "response",
      })
      .pipe(
        retry(3),
        map((res) => {
          if (!res.body || res.status === 404) {
            throw new AdminError(404, "Service not found", "SERIOUS");
          }

          const response = <Response>res.body;

          if (response.success !== 1) {
            throw new AdminError(response.success, response.message);
          }

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  getCrawlerConfig(): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/crawler/config"), {
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

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  getCSVData(): Observable<any> {
    return this.http
      .get<any>(this.config.getServer("/website/csv"), {
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

          return <any>response.result;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }
}
