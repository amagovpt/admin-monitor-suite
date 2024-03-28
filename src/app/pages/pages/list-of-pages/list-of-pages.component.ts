import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";
import { merge, of } from "rxjs";

import { EvaluationErrorDialogComponent } from "../../../dialogs/evaluation-error-dialog/evaluation-error-dialog.component";

import { UpdateService } from "../../../services/update.service";
import { OpenDataService } from "../../../services/open-data.service";
import { GetService } from "../../../services/get.service";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { DeleteService } from "../../../services/delete.service";
import { MessageService } from "../../../services/message.service";
import { EvaluationService } from "../../../services/evaluation.service";

@Component({
  selector: "app-list-of-pages",
  templateUrl: "./list-of-pages.component.html",
  styleUrls: ["./list-of-pages.component.css"],
})
export class ListOfPagesComponent implements OnInit, AfterViewInit {
  @Output("deletePages") deletePagesEmitter = new EventEmitter<Array<number>>();
  @Output("reEvaluatePages") reEvaluatePagesEmitter = new EventEmitter<
    Array<number>
  >();
  @Input("pages") pages: Array<any>;

  displayedColumns = [
    // 'PageId',
    "Uri",
    "Score",
    "Evaluation_Date",
    "Elements",
    //"Types_of_Elements",
    "A",
    "AA",
    "AAA",
    "State",
    "Show_In",
    "delete",
    //'see'
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  error: boolean;
  loadingResponse: boolean;
  pagesForm: FormGroup;
  fileErrorMessage: string;
  jsonFromFile: string;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  loading: boolean;
  length: number;
  isLoadingResults: boolean;
  filter: FormControl;

  constructor(
    private get: GetService,
    private dialog: MatDialog,
    private update: UpdateService,
    private odf: OpenDataService,
    private formBuilder: FormBuilder,
    private deleteService: DeleteService,
    private evaluationService: EvaluationService,
    private message: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.pagesForm = this.formBuilder.group({
      file: new FormControl(),
    });
    this.selection = new SelectionModel<any>(true, []);
    this.loading = false;
    this.length = 0;
    this.isLoadingResults = false;
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl();
  }

  ngOnInit(): void {
    if (!this.pages) {
      this.get.listOfPageCount("").subscribe((count) => {
        this.length = count;
      });
    } else {
      this.dataSource = new MatTableDataSource(this.pages);
      this.length = this.pages.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    if (!this.pages) {
      this.filter.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(150))
        .subscribe((value) => {
          this.get.listOfPageCount(value).subscribe((count) => {
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
            return this.get.listOfPages(
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
        .subscribe((pages) => {
          this.dataSource = new MatTableDataSource(pages);
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

  setPageInObservatory(checkbox: any, page: any): void {
    this.update
      .page({ pageId: page.PageId, checked: checkbox.checked })
      .subscribe((result) => {
        if (!result) {
          checkbox.source.checked = !checkbox.checked;
        }
      });
  }

  reEvaluatePages(): void {  
      this.evaluationService
        .reEvaluatePages({
          pages: _.map(this.selection.selected, "Uri"),
        })
        .subscribe((success) => {
          if (success) {
            this.message.show("PAGES_PAGE.LIST.re_evaluate_pages_message");
          }
        });
  }

  openDeletePageDialog(): void {
    /*const deleteDialog = this.dialog.open(DeletePageDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
    });

    deleteDialog.afterClosed().subscribe((result) => {
      if (result) {
        
      }
    });*/

    if (this.pages) {
      this.deletePagesEmitter.next(_.map(this.selection.selected, "PageId"));
    } else {
      this.deletePages(_.map(this.selection.selected, "PageId"));
    }
  }

  openErrorDialog(evaluationListId: number): void {
    this.dialog.open(EvaluationErrorDialogComponent, {
      width: "40vw",
      data: {
        evaluationListId,
      },
    });
  }

  sendFile() {
    const fileToRead = (<HTMLInputElement>document.getElementById("odfFile"))
      .files[0];

    if (fileToRead === null) {
      this.pagesForm.controls.file.reset();
      return;
    }

    switch (fileToRead.type) {
      case "application/json":
        this.parseJSON(fileToRead);
        break;
      default:
        this.jsonFromFile = "";
        this.fileErrorMessage = "invalidType";
        break;
    }

    this.loadingResponse = true;
    this.odf.sendOpenDataFile(this.jsonFromFile).subscribe((response) => {
      if (response) {
        // TODO O QUE FAZER COM BOOLEAN RECEBIDO
      } else {
        this.error = true;
      }
      this.loadingResponse = false;
    });
  }

  parseJSON(file: File): void {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      this.jsonFromFile = reader.result.toString();
    };
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

  deletePages(pages: any): void {
    this.deleteService.pages({ pages }).subscribe((success) => {
      if (success !== null) {
        this.get
          .listOfPages(
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.sort.active ?? "",
            this.sort.direction,
            this.filter.value ?? ""
          )
          .subscribe((data) => {
            this.dataSource = new MatTableDataSource(data);
            this.selection = new SelectionModel<any>(true, []);
            this.length = this.length - pages.length;
            this.cd.detectChanges();
          });

        this.message.show("PAGES_PAGE.DELETE.messages.success");
      }
    });
  }
}
