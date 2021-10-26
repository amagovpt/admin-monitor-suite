import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { GetService } from "../../services/get.service";
import { EvaluationService } from "../../services/evaluation.service";
import { MessageService } from "../../services/message.service";
import { DeleteService } from "../../services/delete.service";

@Component({
  selector: "app-pages-errors",
  templateUrl: "./pages-errors.component.html",
  styleUrls: ["./pages-errors.component.css"],
})
export class PagesErrorsComponent implements OnInit {
  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pages: any;

  dataSource: any;
  selection: SelectionModel<any>;
  length: number;
  isLoadingResults: boolean;

  displayedColumns = ["Uri", "Error", "Creation_Date", "delete"];

  constructor(
    private readonly get: GetService,
    private readonly deleteService: DeleteService,
    private readonly evaluationService: EvaluationService,
    private readonly message: MessageService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.length = 0;
    this.isLoadingResults = true;
  }

  ngOnInit(): void {
    this.get.listOfPagesWithError().subscribe((pages) => {
      if (pages) {
        this.pages = pages;
        this.dataSource = new MatTableDataSource(pages);
        this.selection = new SelectionModel<any>(true, []);
        this.length = pages.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      this.isLoadingResults = false;
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openRemovePageFromListDialog(): void {
    this.deleteService
      .pagesInEvaluationList({
        pages: this.selection.selected.map(
          (selected) => selected.EvaluationListId
        ),
      })
      .subscribe((success) => {
        if (success) {
          window.location.reload();
        } else {
          this.message.show("PAGES_PAGE.DELETE.messages.error");
        }
      });
  }

  openDeletePageDialog(): void {
    this.deleteService
      .pages({
        pages: this.selection.selected.map((selected) => selected.PageId),
      })
      .subscribe((success) => {
        if (success) {
          window.location.reload();
        } else {
          this.message.show("PAGES_PAGE.DELETE.messages.error");
        }
      });
  }

  reEvaluatePages(): void {
    this.evaluationService
      .reEvaluatePages({
        pages: this.selection.selected.map((selected) => selected.Url),
      })
      .subscribe((success) => {
        if (success) {
          this.message.show("PAGES_PAGE.LIST.re_evaluate_pages_message");
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
