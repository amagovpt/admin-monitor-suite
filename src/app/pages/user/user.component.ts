import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Subscription} from 'rxjs';
import * as _ from 'lodash';

import {GetService} from '../../services/get.service';
import {MessageService} from '../../services/message.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  user: string;
  userType: string;
  data: Array<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);

      this.get.userType(this.user)
        .subscribe(type => {
          if (type !== null) {
            this.userType = type;
            switch (this.userType) {
              case('monitor'):
                this.getListOfUserWebsites();
                break;
              case('studies'):
                this.getListOfUserTags();
                break;
              default:
                console.log('123');
                this.error = true;
            }
          } else {
            this.error = true;
          }

          this.loading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  refreshWebsites(): void {
    this.loading = true;
    this.getListOfUserWebsites();
  }

  private getListOfUserWebsites(): void {
    this.get.listOfUserWebsites(this.user)
      .subscribe(websites => {
        if (websites !== null) {
          this.data = websites;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }

  private getListOfUserTags(): void {
    this.get.listOfUserTags(this.user)
      .subscribe(tags => {
        if (tags !== null) {
          this.data = tags;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }

  private getUserType(): any {
    this.get.userType(this.user)
      .subscribe(type => {
        if (type !== null) {
          console.log(type);
          return type;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }
}
