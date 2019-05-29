import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import {
  MatDialog
} from '@angular/material';
import * as _ from 'lodash';

import {
  GetService
} from '../../../services/get.service';
import {
  MessageService
} from '../../../services/message.service';

import {
  EditTagDialogComponent
} from '../../../dialogs/edit-tag-dialog/edit-tag-dialog.component';
import { ReEvaluateTagWebsitesProgressDialogComponent } from '../../../dialogs/re-evaluate-tag-websites-progress-dialog/re-evaluate-tag-websites-progress-dialog.component';


@Component({
  selector: 'app-list-of-tags',
  templateUrl: './list-of-tags.component.html',
  styleUrls: ['./list-of-tags.component.css']
})
export class ListOfTagsComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'Name',
    'Show_in_Observatorio',
    //'User',
    'Creation_Date',
    'Websites',
    //'re-evaluate',
    'edit',
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfTags();
  }

  private getListOfTags(): void {
    this.get.listOfTags()
      .subscribe(tags => {
        if (tags !== null) {
          this.dataSource = new MatTableDataSource(tags);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateTagWebsites(tagId: number): void {
    this.dialog.open(ReEvaluateTagWebsitesProgressDialogComponent, {
      width: '40vw',
      disableClose: true,
      data: tagId
    });
  }

  edit(id: number, userId: number): void {
    const editDialog = this.dialog.open(EditTagDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: {
        id,
        userId
      }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.loading = true;
          this.getListOfTags();
        }
      });
  }
}
