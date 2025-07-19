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
import { merge } from "rxjs";

import { EvaluationErrorDialogComponent } from "../../../dialogs/evaluation-error-dialog/evaluation-error-dialog.component";

import { UpdateService } from "../../../services/update.service";
import { OpenDataService } from "../../../services/open-data.service";
import { GetService } from "../../../services/get.service";
import {
  debounceTime,
  distinctUntilChanged,
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
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  loading: boolean;
  length: number;
  isLoadingResults: boolean;
  filter: FormControl;
  
  // Large dataset handling
  isLargeDataset: boolean = false;
  requiresSearch: boolean = false;
  minSearchLength: number = 3;
  paginationSubscriptionSetup: boolean = false;

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
        this.configureForDatasetSize(count);
      });
    } else {
      this.dataSource = new MatTableDataSource(this.pages);
      this.length = this.pages.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private configureForDatasetSize(count: number): void {
    this.isLargeDataset = count > 5000;
    this.requiresSearch = count > 10000;
    
    // Optimize page size for large datasets
    if (count > 10000) {
      this.paginator.pageSize = 10;
    } else if (count > 5000) {
      this.paginator.pageSize = 25;
    } else {
      this.paginator.pageSize = 50;
    }
    
    if (this.isLargeDataset) {
      this.message.show("PAGES_PAGE.LIST.large_dataset_message");
    }
    
    if (this.requiresSearch) {
      this.message.show("PAGES_PAGE.LIST.search_required_message");
      // Don't load data initially for very large datasets
      this.dataSource = new MatTableDataSource([]);
    } else {
      // Trigger initial load for smaller datasets
      this.triggerInitialLoad();
    }
  }

  private triggerInitialLoad(): void {
    this.isLoadingResults = true;
    this.cd.detectChanges();
    this.get.listOfPages(
      this.paginator.pageSize,
      this.paginator.pageIndex,
      this.sort.active ?? "",
      this.sort.direction,
      ""
    ).subscribe((pages) => {
      this.isLoadingResults = false;
      this.dataSource = new MatTableDataSource(pages || []);
      this.selection = new SelectionModel<any>(true, []);
      this.cd.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    if (!this.pages) {
      // Combined subscription for both count and data loading
      this.filter.valueChanges
        .pipe(
          distinctUntilChanged(), 
          debounceTime(300)
        )
        .subscribe((value) => {
          // Update count first
          if (this.requiresSearch && (!value || value.length < this.minSearchLength)) {
            this.dataSource = new MatTableDataSource([]);
            this.length = 0;
            return;
          }
          
          this.get.listOfPageCount(value).subscribe((count) => {
            this.length = count;
            this.paginator.firstPage();
            
            // Then load data if criteria met
            this.loadPagesData(value);
            
            // Setup pagination/sort subscriptions AFTER table is rendered
            this.setupPaginationSubscriptions();
          });
        });

    }
  }

  private setupPaginationSubscriptions(): void {
    if (this.paginationSubscriptionSetup) {
      return; // Already set up
    }

    // Wait for next tick to ensure table is rendered
    setTimeout(() => {
      if (this.sort && this.paginator) {
        merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            distinctUntilChanged(),
            debounceTime(150)
          )
          .subscribe(() => {
            this.loadPagesData(this.filter.value ?? "");
          });
        
        this.paginationSubscriptionSetup = true;
      }
    }, 100);
  }

  private loadPagesData(searchValue: string): void {
    // Check if search is required for large datasets
    if (this.requiresSearch && searchValue.length < this.minSearchLength) {
      this.dataSource = new MatTableDataSource([]);
      return;
    }
    
    this.isLoadingResults = true;
    this.cd.detectChanges();
    
    // Safe access to sort properties with fallbacks
    const sortField = this.sort?.active || "";
    const sortDirection = this.sort?.direction || "";
    const pageSize = this.paginator?.pageSize || 10;
    const pageIndex = this.paginator?.pageIndex || 0;
    
    this.get.listOfPages(
      pageSize,
      pageIndex,
      sortField,
      sortDirection,
      searchValue
    ).subscribe({
      next: (pages) => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(pages || []);
        this.selection = new SelectionModel<any>(true, []);
        
        // Important: DON'T connect paginator/sort to dataSource for server-side pagination
        // We handle pagination manually through API calls
        
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading pages:', error);
        this.isLoadingResults = false;
        this.message.show("PAGES_PAGE.LIST.error_loading_message");
        this.dataSource = new MatTableDataSource([]);
        this.cd.detectChanges();
      }
    });
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
