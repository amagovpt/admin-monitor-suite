import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";

import { GetService } from "../../../services/get.service";

import { EditDirectoryDialogComponent } from "../../../dialogs/edit-directory-dialog/edit-directory-dialog.component";
import { ChoosePagesToReEvaluateDialogComponent } from "./../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { SelectionModel } from "@angular/cdk/collections";
import { DeleteService } from "../../../services/delete.service";

@Component({
  selector: "app-list-of-directories",
  templateUrl: "./list-of-directories.component.html",
  styleUrls: ["./list-of-directories.component.css"],
})
export class ListOfDirectoriesComponent implements OnInit {
  @Output("refreshDirectories") refreshDirectories =
    new EventEmitter<boolean>();
  @Input() directories: any;

  displayedColumns = [
    "Name",
    "Show_in_Observatory",
    "Creation_Date",
    "Tags",
    //"re-evaluate",
    "edit",
    "delete",
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private translate: TranslateService,
    private readonly deleteService: DeleteService,
    private cd: ChangeDetectorRef
  ) {
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.directories);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  reEvaluateDirectoriesWebsites(): void {
    const directoriesId = this.selection.selected.map((d) => d.DirectoryId);
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: directoriesId,
        dialog: "directory",
      },
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
        this.refreshDirectories.next(true);
      }
    });
  }

  openDeleteDirectoriesDialog(): void {
    const directoriesId = this.selection.selected.map((d) => d.DirectoryId);
    this.deleteService
      .directories({
        directoriesId: JSON.stringify(directoriesId),
      })
      .subscribe((result) => {
        if (result) {
          this.refreshDirectories.next(true);
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
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }
}
