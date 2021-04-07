import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';

import { EditEntityDialogComponent } from '../../../dialogs/edit-entity-dialog/edit-entity-dialog.component';
import { ChoosePagesToReEvaluateDialogComponent } from './../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteService } from '../../../services/delete.service';

@Component({
  selector: 'app-list-of-entities',
  templateUrl: './list-of-entities.component.html',
  styleUrls: ['./list-of-entities.component.css']
})
export class ListOfEntitiesComponent implements OnInit {

  @Input() entities: any;
  @Output("refreshEntities") refreshEntities = new EventEmitter<boolean>();

  displayedColumns = [
    //'EntityId',
    'Short_Name',
    'Long_Name',
    'Creation_Date',
    'Websites',
    're-evaluate',
    'edit',
    'delete'
    //'see'
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,  
    private translate: TranslateService,
    private readonly deleteService: DeleteService,
    private cd: ChangeDetectorRef
  ) {
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.entities);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
        return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateEntityWebsites(entityId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: '40vw',
      data: {
        info: entityId,
        dialog: 'entity'
      }
    });
  }

  edit(id: number): void {
    const editDialog = this.dialog.open(EditEntityDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: { id }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.refreshEntities.next(true);
        }
      });
  }

  openDeleteEntitiesDialog(): void {
    const entitiesId = this.selection.selected.map(e => e.EntityId);
    this.deleteService.entities({
      entitiesId: JSON.stringify(entitiesId)
    }).subscribe(result => {
      if (result) {
        this.refreshEntities.next(true);
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
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
