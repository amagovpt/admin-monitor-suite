import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { DeleteService } from "../../services/delete.service";
import { EvaluationService } from "../../services/evaluation.service";

import { Website } from "../../models/website.object";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-domain",
  templateUrl: "./domain.component.html",
  styleUrls: ["./domain.component.css"],
})
export class DomainComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;

  sub: Subscription;

  user: string;
  domain: string;
  pages: Array<any>;

  websiteObject: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private deleteService: DeleteService,
    private evaluation: EvaluationService,
    private message: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.user = params.user || "admin";
      this.domain = params.domain;

      this.getListOfDomainPages();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getListOfDomainPages(): void {
    this.get
      .listOfDomainPages(this.user, encodeURIComponent(this.domain))
      .subscribe((pages) => {
        if (pages !== null) {
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
              page.Evaluation_Date,
              page.Element_Count,
              page.Tag_Count
            );
          }
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  deletePages(pages: number[]): void {
    this.deleteService.pages({ pages }).subscribe((success) => {
      if (success !== null) {
        this.loading = true;
        this.cd.detectChanges();
        this.getListOfDomainPages();
      }
    });
  }

  reEvaluatePages(pages: number[]): void {
    this.evaluation.reEvaluatePages({ pages }).subscribe((success) => {
      if (success) {
        this.message.show("PAGES_PAGE.LIST.re_evaluate_pages_message");
      }
    });
  }

  downloadAllPagesCSV(): void {
    this.evaluation.downloadDomainCSV(this.domain, true).subscribe();
  }

  downloadObservatoryCSV(): void {
    this.evaluation.downloadDomainCSV(this.domain, false).subscribe();
  }

  downloadAllPagesEARL(): void {
    this.evaluation.downloadDomainEARL(this.domain, true).subscribe();
  }

  downloadObservatoryEARL(): void {
    this.evaluation.downloadDomainEARL(this.domain, false).subscribe();
  }
}
