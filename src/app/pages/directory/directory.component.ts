import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { EvaluationService } from "../../services/evaluation.service";

@Component({
  selector: "app-directory",
  templateUrl: "./directory.component.html",
  styleUrls: ["./directory.component.css"],
})
export class DirectoryComponent implements OnInit, OnDestroy {
  loadingTags: boolean;
  errorTags: boolean;
  loadingWebsites: boolean;
  errorWebsites: boolean;

  sub: Subscription;

  directory: string;
  tags: Array<any>;
  websites: Array<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private evaluation: EvaluationService,
    private cd: ChangeDetectorRef
  ) {
    this.loadingTags = true;
    this.errorTags = false;
    this.loadingWebsites = true;
    this.errorWebsites = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.directory = params.directory;

      this.getListOfDirectoryTags();
      this.getListOfDirectoryWebsites();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  refreshTags(): void {
    this.loadingTags = true;
    this.getListOfDirectoryTags();
  }

  refreshWebsites(): void {
    this.loadingWebsites = true;
    this.getListOfDirectoryWebsites();
  }

  private getListOfDirectoryTags(): void {
    this.get.listOfDirectoryTags(this.directory).subscribe((tags) => {
      if (tags !== null) {
        this.tags = tags;
      } else {
        this.errorTags = true;
      }

      this.loadingTags = false;
      this.cd.detectChanges();
    });
  }

  private getListOfDirectoryWebsites(): void {
    this.get.listOfDirectoryWebsites(this.directory).subscribe((websites) => {
      if (websites !== null) {
        this.websites = websites;
      } else {
        this.errorWebsites = true;
      }

      this.loadingWebsites = false;
      this.cd.detectChanges();
    });
  }

  downloadAllPagesCSV(): void {
    this.evaluation.downloadDirectoryCSV(
      this.websites.map((w) => w.StartingUrl),
      true,
      this.directory
    );
  }

  downloadObservatoryCSV(): void {
    this.evaluation.downloadDirectoryCSV(
      this.websites.map((w) => w.StartingUrl),
      false,
      this.directory
    );
  }
}
