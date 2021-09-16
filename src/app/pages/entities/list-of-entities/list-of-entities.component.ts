import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";

import { GetService } from "../../../services/get.service";

import { EditEntityDialogComponent } from "../../../dialogs/edit-entity-dialog/edit-entity-dialog.component";
import { ChoosePagesToReEvaluateDialogComponent } from "./../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { SelectionModel } from "@angular/cdk/collections";
import { DeleteService } from "../../../services/delete.service";
import { FormControl } from "@angular/forms";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { merge } from "rxjs";
import { of } from "rxjs";
import { MessageService } from "../../../services/message.service";

@Component({
  selector: "app-list-of-entities",
  templateUrl: "./list-of-entities.component.html",
  styleUrls: ["./list-of-entities.component.css"],
})
export class ListOfEntitiesComponent implements OnInit, AfterViewInit {
  //@Input() entities: any;
  //@Output("refreshEntities") refreshEntities = new EventEmitter<boolean>();

  displayedColumns = [
    //'EntityId',
    "Short_Name",
    "Long_Name",
    "Creation_Date",
    "Websites",
    //'re-evaluate',
    "edit",
    "delete",
    //'see'
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  entities: Array<any>;
  loading: boolean;
  length: number;
  isLoadingResults: boolean;
  filter: FormControl;

  constructor(
    private dialog: MatDialog,
    private readonly deleteService: DeleteService,
    private message: MessageService,
    private get: GetService,
    private cd: ChangeDetectorRef
  ) {
    this.selection = new SelectionModel<any>(true, []);
    this.loading = false;
    this.length = 0;
    this.isLoadingResults = false;
    this.dataSource = new MatTableDataSource([]);
    this.filter = new FormControl();
  }

  ngOnInit(): void {
    /*this.dataSource = new MatTableDataSource(this.entities);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;*/
    this.get.listOfEntityCount("").subscribe((count) => {
      this.length = count;
    });
  }

  ngAfterViewInit(): void {
    this.filter.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe((value) => {
        this.get.listOfEntityCount(value).subscribe((count) => {
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
          return this.get.listOfEntities(
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
      .subscribe((entities) => {
        this.dataSource = new MatTableDataSource(entities);
        this.entities = entities;
        this.selection = new SelectionModel<any>(true, []);
        this.cd.detectChanges();
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateEntitiesWebsites(): void {
    const entitiesId = this.selection.selected.map((e) => e.EntityId);
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: "40vw",
      data: {
        info: entitiesId,
        dialog: "entity",
      },
    });
  }

  edit(id: number): void {
    const editDialog = this.dialog.open(EditEntityDialogComponent, {
      width: "60vw",
      disableClose: false,
      hasBackdrop: true,
      data: { id },
    });

    editDialog.afterClosed().subscribe((result) => {
      if (result) {
        //this.refreshEntities.next(true);
        this.get
          .listOfEntities(
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.sort.active ?? "",
            this.sort.direction,
            this.filter.value ?? ""
          )
          .subscribe((entities) => {
            this.dataSource = new MatTableDataSource(entities);
            this.entities = entities;
            this.selection = new SelectionModel<any>(true, []);
            this.cd.detectChanges();
          });
      }
    });
  }

  openDeleteEntitiesDialog(): void {
    const entitiesId = this.selection.selected.map((e) => e.EntityId);
    this.deleteService
      .entities({
        entitiesId: JSON.stringify(entitiesId),
      })
      .subscribe((result) => {
        if (result) {
          //this.refreshEntities.next(true);
          this.get
            .listOfEntities(
              this.paginator.pageSize,
              this.paginator.pageIndex,
              this.sort.active ?? "",
              this.sort.direction,
              this.filter.value ?? ""
            )
            .subscribe((entities) => {
              this.dataSource = new MatTableDataSource(entities);
              this.entities = entities;
              this.selection = new SelectionModel<any>(true, []);
              this.length = this.length - entities.length;
              this.cd.detectChanges();
            });

          this.message.show("ENTITIES_PAGE.DELETE.messages.success");
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
