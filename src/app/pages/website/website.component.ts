import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import { saveAs } from "file-saver";

import { GetService } from "../../services/get.service";
import { EvaluationService } from "../../services/evaluation.service";

import { Website } from "../../models/website.object";
import { DeleteService } from "../../services/delete.service";
import { MessageService } from "../../services/message.service";


@Component({
  selector: "app-website",
  templateUrl: "./website.component.html",
  styleUrls: ["./website.component.css"],
})
export class WebsiteComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;

  sub: Subscription;

  tag: string;
  user: string;
  website: string;
  pages: Array<any>;

  websiteObject: any;
  startingUrl: string;
  
  // New properties for pagination support
  pagesForStatistics: Array<any>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private evaluation: EvaluationService,
    private deleteService: DeleteService,
    private message: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.tag = params.tag || null;
      this.user = params.user || "admin";
      this.website = params.website;
      if (this.user === "admin") {
        this.getListOfWebsitePages();
      } else {
        this.get
          .listOfUserWebsitePages(this.tag, this.user, this.website)
          .subscribe((pages) => {
            if (pages !== null) {
              this.pages = pages;
            } else {
              this.error = true;
            }
            console.log(params);
            console.log(this.pages);
            this.loading = false;
            this.cd.detectChanges();
          });
      }

    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getListOfWebsitePages(): void {
    // Load all pages for statistics calculation only
    this.get
      .listOfWebsitePagesByName(this.user, this.website)
      .subscribe((pages) => {
        this.pagesForStatistics = _.clone(pages);
//FIXME
        if (pages.length > 0){
          let uri = pages[0].Uri;
          uri = uri.substring(0, uri.length - 1);
          this.startingUrl = uri
          this.correctUrl(uri);
        }
  //FIXME
        const pagesForStats = pages.filter((p) => p.Score !== null);

        this.websiteObject = new Website();
        for (const page of pagesForStats) {
          this.websiteObject.addPage(
            page.Score,
            page.Errors,
            page.Tot,
            page.A,
            page.AA,
            page.AAA,
            page.Evaluation_Date
          );
        }
        
        // Clear the pages array to trigger pagination mode in list-of-pages component
        this.pages = null;
        
        this.loading = false;
        this.cd.detectChanges();
      });
  }

  refreshPages(): void {
    this.loading = true;
    this.cd.detectChanges();
    this.getListOfWebsitePages();
  }

  deletePages(pages: any): void {
    this.deleteService.pages({ pages }).subscribe((success) => {
      if (success !== null) {
        this.message.show("PAGES_PAGE.DELETE.messages.success");

        this.refreshPages();
      }
    });
  }
//FIXME
  async correctUrl(url:string): Promise<void> {
    const result = await this.evaluation.getWebsiteStats(url, true);    
    if(result.length === 0){
      this.startingUrl = url + '/';
    }
  }
//FIXME
  downloadAllPagesCSV(): void {
    this.evaluation.downloadWebsiteCSV(this.startingUrl, true);
  }

  downloadObservatoryCSV(): void {
    this.evaluation.downloadWebsiteCSV(this.startingUrl, false);
  }

  downloadAllPagesEARL(): void {
    this.evaluation.downloadWebsiteEARL(this.startingUrl, true);
  }

  downloadObservatoryEARL(): void {
    this.evaluation.downloadWebsiteEARL(this.startingUrl, false);
  }
}
