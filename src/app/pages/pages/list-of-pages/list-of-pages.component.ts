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
  @Input("websiteContext") websiteContext: { user: string; website: string };

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
  
  // Large dataset handling
  isLargeDataset: boolean = false;
  requiresSearch: boolean = false;
  minSearchLength: number = 3;
  paginationSubscriptionSetup: boolean = false;
  
  // Sort state management (since ViewChild isn't reliable)
  currentSortField: string = "";
  currentSortDirection: string = "";

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
    // Handle the case where pages are provided directly (old behavior)
    if (this.pages) {
      this.dataSource = new MatTableDataSource(this.pages);
      this.length = this.pages.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // For pagination mode, setup is moved to ngAfterViewInit where @Input websiteContext is available
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
    this.loadPagesData("");
  }

  ngAfterViewInit(): void {
    if (!this.pages) {
      // Set up initial count (now that @Input websiteContext is available)
      if (this.websiteContext) {
        this.get.listOfWebsitePagesCount(this.websiteContext.user, this.websiteContext.website, "").subscribe({
          next: (count) => {
            this.length = count;
            this.configureForDatasetSize(count);
          },
          error: (error) => {
            console.error('Error getting website pages count:', error);
            this.length = 0;
          }
        });
      } else {
        this.get.listOfPageCount("").subscribe((count) => {
          this.length = count;
          this.configureForDatasetSize(count);
        });
      }

      // Set up filter subscription for count updates
      this.filter.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(150))
        .subscribe((value) => {
          if (this.websiteContext) {
            this.get.listOfWebsitePagesCount(this.websiteContext.user, this.websiteContext.website, value).subscribe((count) => {
              this.length = count;
              this.paginator.firstPage();
            });
          } else {
            this.get.listOfPageCount(value).subscribe((count) => {
              this.length = count;
              this.paginator.firstPage();
            });
          }
        });
    }
  }

  private setupPaginationSubscriptions(): void {
    if (this.paginationSubscriptionSetup) {
      return; // Already set up
    }

    // Wait for next tick to ensure table is rendered, then keep trying until ViewChild is available
    const trySetup = (retryCount = 0) => {
      // Set up paginator subscription immediately if available (it's always rendered)
      if (this.paginator && !this.paginationSubscriptionSetup) {
        this.paginator.page.pipe(
          distinctUntilChanged(),
          debounceTime(150)
        ).subscribe(() => {
          this.loadPagesData(this.filter.value ?? "");
        });
        
        this.paginationSubscriptionSetup = true;
        return; // Exit early, pagination is set up
      }
    };

    // Start trying after initial delay
    setTimeout(() => trySetup(), 100);
  }

  private loadPagesData(searchValue: string): void {
    // Check if search is required for large datasets
    if (this.requiresSearch && searchValue.length < this.minSearchLength) {
      this.dataSource = new MatTableDataSource([]);
      return;
    }
    
    this.isLoadingResults = true;
    this.cd.detectChanges();
    
    // Use stored sort state instead of ViewChild (which may not be available)
    const sortField = this.currentSortField;
    const sortDirection = this.currentSortDirection;
    const pageSize = this.paginator?.pageSize || 10;
    const pageIndex = this.paginator?.pageIndex || 0;
    
    
    const apiCall = this.websiteContext 
      ? this.get.listOfWebsitePagesPaginated(
          this.websiteContext.user,
          this.websiteContext.website,
          pageSize,
          pageIndex,
          sortField,
          sortDirection,
          searchValue
        )
      : this.get.listOfPages(
          pageSize,
          pageIndex,
          sortField,
          sortDirection,
          searchValue
        );
    
    apiCall.subscribe({
      next: (pages) => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(pages || []);
        this.selection = new SelectionModel<any>(true, []);
        
        // Important: DON'T connect paginator/sort to dataSource for server-side pagination
        // We handle pagination manually through API calls
        
        this.cd.detectChanges();
        
        // Setup pagination/sort subscriptions AFTER initial data loads successfully
        this.setupPaginationSubscriptions();
      },
      error: (error) => {
        console.error('Error loading pages data:', error);
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

  onSortChange(sortState: any): void {
    // Store the current sort state
    this.currentSortField = sortState.active || "";
    this.currentSortDirection = sortState.direction || "";
    // Reset pagination to first page when sorting
    this.paginator.pageIndex = 0;
    this.loadPagesData(this.filter.value ?? "");
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
