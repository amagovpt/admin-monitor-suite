import { Component, OnInit, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { EvaluationService } from '../../services/evaluation.service';

import { Website } from '../../models/website.object';
import { MatTableDataSource } from '@angular/material/table';
import {pageType} from '../../pages/website/pageType';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})

export class WebsiteComponent implements OnInit, OnDestroy {
  evaluations: Array<any>;

  loading: boolean;
  error: boolean;
  errorNoActiveDomains: boolean;

  sub: Subscription;
  sub2: Subscription;


  tag: string;
  user: string;
  website: string;
  domains: Array<any>;
  activeDomain: string;
  pages: Array<any>;
  websiteObject: any;
  page: string;

  elementList:string[];
  roleList: string[];
  pageC: any[] = [];
  auxRole: string[];
  auxTag: string[];
  i: number;
  element:any;
  elements: string[];
  done: boolean = false;
  dataSource: any[];

  tags:string[] = ["Table","Form","iFrame","Heading", "Button", "Presentation","CheckBox"];
  uri:string[] = [];

  



  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private evaluation: EvaluationService,
    private cd: ChangeDetectorRef,
  ) {
 
    this.loading = true;
    this.error = false;
  }

  
  ngOnInit(): void {
    
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.tag = params.tag || null;
      this.user = params.user || 'admin';
      this.website = params.website;

      if (this.user === 'admin') {
       this.getListOfWebsiteDomains();
       this.getListOfElementsWebsitePages();
      
      } else {
        this.get.listOfUserWebsitePages(this.tag, this.user, this.website)
          .subscribe(pages => {
            if (pages !== null) {
              this.pages = pages;
            } else {
              this.error = true;
            }

            this.loading = false;
            this.cd.detectChanges();
          });
      }
    });
}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getListOfWebsiteDomains(): void {
    this.get.listOfWebsiteDomains(this.user, this.website)
      .subscribe(domains => {
        if (domains !== null) {
          this.domains = domains;
          if (_.size(domains) > 0 && _.size(_.find(this.domains, ['Active', 1 ])) === 0){
            this.errorNoActiveDomains = true;
          } else {
            this.activeDomain = _.find(this.domains, ['Active', 1 ]).Url;

            this.get.listOfDomainPages(this.user, encodeURIComponent(this.activeDomain))
              .subscribe(pages => {
                this.pages = _.clone(pages);

                pages = pages.filter(p => p.Score !== null);

                this.websiteObject = new Website();
                for (const page of pages) {
                  this.websiteObject.addPage(page.Score, page.Errors, page.Tot, page.A, page.AA, page.AAA, page.Evaluation_Date);
                }
                this.loading = false;
                this.cd.detectChanges();
              });
          }
        } else {
          this.error = true;
        }
        this.cd.detectChanges();
      });
  }

  refreshDomains(): void {
    this.loading = true;
    this.getListOfWebsiteDomains();
  }
 

  private getListOfElementsWebsitePages(): void {
    this.get.listOfElementsWebsitePages(this.website)
      .subscribe(evaluations => {
        if (evaluations !== null) {
          this.evaluations = evaluations;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.done = true;

        this.cd.detectChanges();
      });
  }

  downloadAllPagesCSV(): void {
    this.evaluation.downloadDomainCSV(this.activeDomain, true)
      .subscribe();
  }

  downloadObservatoryCSV(): void {
    this.evaluation.downloadDomainCSV(this.activeDomain, false)
      .subscribe();
  }

  downloadAllPagesEARL(): void {
    this.evaluation.downloadDomainEARL(this.activeDomain, true)
      .subscribe();
  }

  downloadObservatoryEARL(): void {
    this.evaluation.downloadDomainEARL(this.activeDomain, false)
      .subscribe();
  }
}
