import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { EvaluationService } from "../../services/evaluation.service";

import { Website } from "../../models/website.object";
import { DeleteService } from "../../services/delete.service";
import { MessageService } from "../../services/message.service";
import { AccessibilityStatement } from "../../models/accessibilityStatement";
import { AccessibilityStatementService } from "../../services/accessibility-statement.service";

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
  a11Statement: AccessibilityStatement;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private evaluation: EvaluationService,
    private a11y: AccessibilityStatementService,
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
      this.getA11yStatement();
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
    this.get
      .listOfWebsitePagesByName(this.user, this.website)
      .subscribe((pages) => {
        this.pages = _.clone(pages);

        pages = pages.filter((p) => p.Score !== null);

        this.websiteObject = new Website();
        for (const page of pages) {
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
        this.loading = false;
        this.cd.detectChanges();
      });
  }


  private getA11yStatement(): void {
    this.a11y.getByWebsiteName( this.website)
      .subscribe((a11Statement) => {
        this.a11Statement = a11Statement;
        console.log(a11Statement)
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

  downloadAllPagesCSV(): void {
    this.evaluation.downloadWebsiteCSV(this.website, true).subscribe();
  }

  downloadObservatoryCSV(): void {
    this.evaluation.downloadWebsiteCSV(this.website, false).subscribe();
  }

  downloadAllPagesEARL(): void {
    this.evaluation.downloadWebsiteEARL(this.website, true).subscribe();
  }

  downloadObservatoryEARL(): void {
    this.evaluation.downloadWebsiteEARL(this.website, false).subscribe();
  }
}
