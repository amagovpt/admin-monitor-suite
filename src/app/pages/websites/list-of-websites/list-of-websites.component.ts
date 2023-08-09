import { Overlay } from "@angular/cdk/overlay";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";

import { DigitalStampService } from "./../../../services/digital-stamp.service";
import { MessageService } from "./../../../services/message.service";

import { SelectionModel } from "@angular/cdk/collections";
import { FormControl } from "@angular/forms";
import { merge, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { ChoosePagesToReEvaluateDialogComponent } from "../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component";
import { CrawlerDialogComponent } from "../../../dialogs/crawler-dialog/crawler-dialog.component";
import { EditWebsiteDialogComponent } from "../../../dialogs/edit-website-dialog/edit-website-dialog.component";
import { DeleteService } from "../../../services/delete.service";
import { GetService } from "../../../services/get.service";

@Component({
  selector: "app-list-of-websites",
  templateUrl: "./list-of-websites.component.html",
  styleUrls: ["./list-of-websites.component.css"],
})
export class ListOfWebsitesComponent implements OnInit, AfterViewInit {
  @Output("refreshWebsites") refreshWebsites = new EventEmitter<boolean>();
  @Input("directory") directory: string;
  @Input("websites") websites: any;

  displayedColumns = [
    "name",
    //"User",
    "startingUrl",
    "Pages",
    "creationDate",
    //"re-evaluate",
    "edit",
    //"crawler",
    "stamp",
    //"see",
    "delete",
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  loading: boolean;
  length: number;
  isLoadingResults: boolean;
  filter: FormControl;

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    private message: MessageService,
    private digitalStamp: DigitalStampService,
    private get: GetService,
    private readonly deleteService: DeleteService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.selection = new SelectionModel<any>(true, []);
    this.loading = false;
    this.length = 0;
    this.isLoadingResults = false;
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl();
  }

  ngOnInit(): void {
    if (this.websites) {
      this.dataSource = new MatTableDataSource(this.websites);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.length = this.websites.length;
      this.selection = new SelectionModel<any>(true, []);
      this.cd.detectChanges();
    } else {
      this.get.listOfWebsiteCount("").subscribe((count) => {
        this.length = count;
      });
    }
  }

  ngAfterViewInit(): void {
    if (!this.websites) {
      this.filter.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(150))
        .subscribe((value) => {
          this.get.listOfWebsiteCount(value).subscribe((count) => {
            this.length = count;
            this.paginator.firstPage();
          });
        });
      merge(this.sort.sortChange, this.paginator.page, this.filter.valueChanges)
        .pipe(
          distinctUntilChanged(),
          debounceTime(150),
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            this.cd.detectChanges();
            return this.get.listOfWebsites(
              this.paginator.pageSize,
              this.paginator.pageIndex,
              this.sort.active ?? "",
              this.sort.direction,
              this.filter.value ?? ""
            );
          }),
          map((data) => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            return data;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return of([]);
          })
        )
        .subscribe((websites) => {
          this.dataSource = new MatTableDataSource(websites);
          this.selection = new SelectionModel<any>(true, []);
          this.cd.detectChanges();
        });
    }
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateWebsitesPages(): void {
    const websitesId = this.selection.selected.map((w) => w.websiteId);
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: websitesId,
        dialog: "website",
      },
    });
  }

  edit(id: number, userType: string): void {
    const editDialog = this.dialog.open(EditWebsiteDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: { id, userType },
    });

    editDialog.afterClosed().subscribe((result) => {
      if (result) {
        if (this.websites) {
          this.refreshWebsites.next(true);
        } else {
          this.get
            .listOfWebsites(
              this.paginator.pageSize,
              this.paginator.pageIndex,
              this.sort.active ?? "",
              this.sort.direction,
              this.filter.value ?? ""
            )
            .subscribe((websites) => {
              this.dataSource = new MatTableDataSource(websites);
              this.selection = new SelectionModel<any>(true, []);
              this.cd.detectChanges();
            });
        }
      }
    });
  }

  openCrawlerDialog(): void {
    const websites = new Array<{ url: string; websiteId: number }>();
    this.selection.selected.map((w) => {
      websites.push({
        url: w.startingUrl,
        websiteId: w.websiteId,
      });
    });

    this.dialog.open(CrawlerDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
      data: websites,
    });
  }

  generateDigitalStamps(): void {
    this.digitalStamp.generateForAll().subscribe((errors) => {
      if (_.size(errors) === 0) {
        this.message.show("DIGITAL_STAMP.messages.generate_all_success");
      }
    });
  }

  generateWebsitesDigitalStamp(): void {
    const websitesId = this.selection.selected.map((w) => w.websiteId);

    this.digitalStamp
      .generateForWebsites({ websitesId: websitesId })
      .subscribe((success) => {
        if (success) {
          this.message.show("DIGITAL_STAMP.messages.generate_website_success");
        }
      });
  }

  getDigitalStampUrl(websiteId: number): string {
    return this.digitalStamp.getDigitalStampUrl(websiteId);
  }

  deleteWebsitesPages(): void {
    const websitesId = this.selection.selected.map((w) => w.websiteId);
    this.deleteService
      .websitesPages({
        websitesId: websitesId,
      })
      .subscribe((result) => {
        if (result) {
          if (this.websites) {
            this.refreshWebsites.next(true);
          } else {
            this.get
              .listOfWebsites(
                this.paginator.pageSize,
                this.paginator.pageIndex,
                this.sort.active ?? "",
                this.sort.direction,
                this.filter.value ?? ""
              )
              .subscribe((websites) => {
                this.dataSource = new MatTableDataSource(websites);
                this.selection = new SelectionModel<any>(true, []);
                this.length = this.length - websites.length;
                this.cd.detectChanges();
              });

            this.message.show("WEBSITES_PAGE.DELETE.messages.pages_success");
          }
        }
      });
  }

  deleteWebsites(): void {
    const websitesId = this.selection.selected.map((w) => w.websiteId);
    this.deleteService
      .websites({
        websitesId: websitesId,
      })
      .subscribe((result) => {
        if (result) {
          if (this.websites) {
            this.refreshWebsites.next(true);
          } else {
            this.get
              .listOfWebsites(
                this.paginator.pageSize,
                this.paginator.pageIndex,
                this.sort.active ?? "",
                this.sort.direction,
                this.filter.value ?? ""
              )
              .subscribe((websites) => {
                this.dataSource = new MatTableDataSource(websites);
                this.selection = new SelectionModel<any>(true, []);
                this.length = this.length - websites.length;
                this.cd.detectChanges();
              });

            this.message.show("WEBSITES_PAGE.DELETE.messages.websites_success");
          }
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach((row) =>
        this.selection.select(row)
      );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1
      }`;
  }
}
