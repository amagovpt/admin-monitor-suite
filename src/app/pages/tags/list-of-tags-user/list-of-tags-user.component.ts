import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {GetService} from '../../../services/get.service';
import {MessageService} from '../../../services/message.service';
import {EditTagDialogComponent} from '../../../dialogs/edit-tag-dialog/edit-tag-dialog.component';

@Component({
  selector: 'app-list-of-tags-user',
  templateUrl: './list-of-tags-user.component.html',
  styleUrls: ['./list-of-tags-user.component.css']
})
export class ListOfTagsUserComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'Name',
    'Show_in_Observatorio',
    'User',
    'Creation_Date',
    'Websites',
    'Import'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private message: MessageService
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
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
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
