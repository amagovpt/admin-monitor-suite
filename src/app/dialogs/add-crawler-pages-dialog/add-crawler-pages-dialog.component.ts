import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import { CreateService } from "../../services/create.service";
import { GetService } from "../../services/get.service";

import { BackgroundEvaluationsInformationDialogComponent } from "../background-evaluations-information-dialog/background-evaluations-information-dialog.component";

@Component({
  selector: "app-add-crawler-pages-dialog",
  templateUrl: "./add-crawler-pages-dialog.component.html",
  styleUrls: ["./add-crawler-pages-dialog.component.css"],
})
export class AddCrawlerPagesDialogComponent implements OnInit {
  displayedColumns = ["uri", "import", "observatorio"];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selectionImport: any;
  selectionObserv: any;

  crawlWebsiteId: number;
  websiteUri: string;
  websiteId: number;
  error = false;
  loading = false;
  submitted: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddCrawlerPagesDialogComponent>,
    private dialog: MatDialog,
    private get: GetService,
    private create: CreateService
  ) {
    this.crawlWebsiteId = this.data.crawlWebsiteId;
    this.getUrisFromCrawlId();
    this.websiteUri = this.data.websiteUri;
    this.websiteId = this.data.websiteId;
    this.selectionImport = new SelectionModel<any>(true, []);
    this.selectionObserv = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.submitted = false;
  }

  private getUrisFromCrawlId() {
    this.get
      .listOfUrisFromCrawlWebsiteId(this.crawlWebsiteId)
      .subscribe((uris) => {
        if (uris !== null) {
          const cleanUris = JSON.stringify(
            _.map(uris, (p) => {
              let uriToClean = p["uri"];
              /*if (uriToClean[_.size(uriToClean) - 1] === "/") {
                uriToClean = uriToClean.substring(0, _.size(uriToClean) - 1);
              }*/

              return _.trim(uriToClean);
            })
          );
          this.dataSource = new MatTableDataSource(
            _.map(JSON.parse(cleanUris), (u) => ({
              uri: decodeURIComponent(u),
            }))
          );
        } else {
          this.error = true;
        }
      });
  }

  choosePages(e): void {
    e.preventDefault();
    this.submitted = true;
    this.addPages(
      JSON.stringify(_.map(this.selectionImport.selected, "uri")),
      JSON.stringify(_.map(this.selectionObserv.selected, "uri"))
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedImport() {
    const numSelected = this.selectionImport.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedObserv() {
    const numSelected = this.selectionObserv.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleImport() {
    this.isAllSelectedImport()
      ? this.dataSource.data.forEach((row) => {
        if (!this.selectionObserv.isSelected(row)) {
          this.selectionImport.deselect(row);
        }
      })
      : this.dataSource.data.forEach((row) => this.selectionImport.select(row));
  }

  masterToggleObserv() {
    this.isAllSelectedObserv()
      ? this.selectionObserv.clear()
      : this.dataSource.data.forEach((row) => this.selectionObserv.select(row));
    this.masterToggleImport();
  }

  toggleBoth(row: any) {
    this.selectionImport.select(row);
    this.selectionObserv.toggle(row);
  }

  private addPages(uris: any, observatorio: any): void {
    const websiteId = this.websiteId;

    const formData = {
      websiteId,
      uris,
      observatory: observatorio,
    };

    this.dialogRef.close();

    this.create.newPages(formData).subscribe((success) => {
      if (success !== null) {
        if (success) {
          this.dialogRef.close();
          this.dialog.open(BackgroundEvaluationsInformationDialogComponent, {
            width: "40vw",
          });
        }
      }
    });
  }
}
