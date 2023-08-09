import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";

import { ErrorDistributionDialogComponent } from "../../../dialogs/error-distribution-dialog/error-distribution-dialog.component";
import { ScoreDistributionDialogComponent } from "../../../dialogs/score-distribution-dialog/score-distribution-dialog.component";

import { CorrectionDistributionDialogComponent } from "app/dialogs/correction-distribution-dialog/correction-distribution-dialog.component";
import { Website } from "app/models/website.object";

@Component({
  selector: "app-website-statistics",
  templateUrl: "./website-statistics.component.html",
  styleUrls: ["./website-statistics.component.css"],
})
export class WebsiteStatisticsComponent implements OnInit {
  @Input("pages") pages: any[];
  @Input("data") websiteObject: Website;

  loading: boolean;
  error: boolean;

  score: number;

  total_pages: number;
  newest_page: any;
  oldest_page: any;

  thresholdConfig: any;

  pagesWithErrors: number;
  pagesWithErrorsPercentage: string;
  pagesWithoutErrors: number;
  pagesWithoutErrorsPercentage: string;
  pagesWithoutErrorsA: number;
  pagesWithoutErrorsAPercentage: string;
  pagesWithoutErrorsAA: number;
  pagesWithoutErrorsAAPercentage: string;
  pagesWithoutErrorsAAA: number;
  pagesWithoutErrorsAAAPercentage: string;

  constructor(private readonly dialog: MatDialog) {
    this.thresholdConfig = {
      "0": {
        color: "red",
      },
      "2.5": {
        color: "orange",
      },
      "5": {
        color: "yellow",
      },
      "7.5": {
        color: "green",
      },
    };

    this.pages = new Array<any>();
    this.score = 0;
    this.pagesWithErrors = 0;
    this.pagesWithoutErrorsA = 0;
    this.pagesWithoutErrorsAA = 0;
    this.pagesWithoutErrorsAAA = 0;
    this.total_pages = 0;
  }

  ngOnInit(): void {
    this.total_pages = this.pages.length;
    this.pages = this.pages
      .filter((p) => p.score !== null)
      .map((p) => {
        p.score = Number(p.score);
        return p;
      });
    const size = _.size(this.pages);
    this.newest_page = this.pages[0].evaluationDate;
    this.oldest_page = this.pages[0].evaluationDate;

    for (let i = 0; i < size; i++) {
      if (this.pages[i].A === 0) {
        if (this.pages[i].AA === 0) {
          if (this.pages[i].AAA === 0) {
            this.pagesWithoutErrorsAAA++;
          } else {
            this.pagesWithoutErrorsAA++;
          }
        } else {
          this.pagesWithoutErrorsA++;
        }
      } else {
        this.pagesWithErrors++;
      }

      if (this.pages[i].evaluationDate > this.newest_page) {
        this.newest_page = this.pages[i].evaluationDate;
      } else if (this.pages[i].evaluationDate < this.oldest_page) {
        this.oldest_page = this.pages[i].evaluationDate;
      }

      this.score += this.pages[i].score;
    }

    this.score /= size;

    this.pagesWithoutErrors = size - this.pagesWithErrors;

    this.pagesWithErrorsPercentage =
      ((this.pagesWithErrors / size) * 100).toFixed(1) + "%";
    this.pagesWithoutErrorsPercentage =
      ((this.pagesWithoutErrors / size) * 100).toFixed(1) + "%";
    this.pagesWithoutErrorsAPercentage =
      ((this.pagesWithoutErrorsA / size) * 100).toFixed(1) + "%";
    this.pagesWithoutErrorsAAPercentage =
      ((this.pagesWithoutErrorsAA / size) * 100).toFixed(1) + "%";
    this.pagesWithoutErrorsAAAPercentage =
      ((this.pagesWithoutErrorsAAA / size) * 100).toFixed(1) + "%";
  }

  openScoreDistributionDialog(): void {
    this.dialog.open(ScoreDistributionDialogComponent, {
      data: {
        number: this.pages.length,
        pages: this.pages,
      },
      width: "60vw",
    });
  }

  openErrorDistributionDialog(): void {
    this.dialog.open(ErrorDistributionDialogComponent, {
      data: {
        number: this.pages.length,
        website: this.websiteObject,
        inTagsPage: false,
      },
      width: "80vw",
    });
  }

  openCorrectionDistributionDialog(): void {
    this.dialog.open(CorrectionDistributionDialogComponent, {
      data: {
        number: this.pages.length,
        website: this.websiteObject,
        inTagsPage: false,
      },
      width: "80vw",
    });
  }
}
