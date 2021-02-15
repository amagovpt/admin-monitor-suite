import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";

import { GetService } from "../../../services/get.service";

import { EditDirectoryDialogComponent } from "../../../dialogs/edit-directory-dialog/edit-directory-dialog.component";
import { ChoosePagesToReEvaluateDialogComponent } from "./../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-list-of-directories",
  templateUrl: "./list-of-directories.component.html",
  styleUrls: ["./list-of-directories.component.css"],
})
export class ListOfDirectoriesComponent implements OnInit {
  loading: boolean;
  error: boolean;

  displayedColumns = [
    "Name",
    "Show_in_Observatory",
    "Creation_Date",
    "Tags",
    "re-evaluate",
    "edit",
  ];

  dataSource: any;
  selection: any;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfDirectories();
  }

  reEvaluateDirectoryWebsites(directoryId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: directoryId,
        dialog: "directory",
      },
    });
  }

  private getListOfDirectories(): void {
    this.get.listOfDirectories().subscribe((directories) => {
      if (directories !== null) {
        this.dataSource = new MatTableDataSource(directories);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        const paginatorIntl = new MatPaginatorIntl();
        paginatorIntl.itemsPerPageLabel = this.translate.instant(
          "ITEMS_PER_PAGE_LABEL"
        );
        paginatorIntl.nextPageLabel = this.translate.instant("NEXT_PAGE_LABEL");
        paginatorIntl.previousPageLabel = this.translate.instant(
          "PREVIOUS_PAGE_LABEL"
        );
        paginatorIntl.firstPageLabel = this.translate.instant(
          "FIRST_PAGE_LABEL"
        );
        paginatorIntl.lastPageLabel = this.translate.instant("LAST_PAGE_LABEL");
        paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

        this.dataSource.paginator._intl = paginatorIntl;
      } else {
        this.error = true;
      }

      this.loading = false;
      this.cd.detectChanges();
    });
  }

  private getRangeLabel(
    page: number,
    pageSize: number,
    length: number
  ): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant("RANGE_PAGE_LABEL_1", { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return this.translate.instant("RANGE_PAGE_LABEL_2", {
      startIndex: startIndex + 1,
      endIndex,
      length,
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  edit(id: number, userId: number): void {
    const editDialog = this.dialog.open(EditDirectoryDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
      data: {
        id,
      },
    });

    editDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.getListOfDirectories();
      }
    });
  }
}
