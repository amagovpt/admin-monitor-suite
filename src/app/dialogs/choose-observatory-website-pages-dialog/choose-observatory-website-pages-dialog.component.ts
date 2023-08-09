import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';
import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-choose-observatory-website-pages-dialog',
  templateUrl: './choose-observatory-website-pages-dialog.component.html',
  styleUrls: ['./choose-observatory-website-pages-dialog.component.css']
})
export class ChooseObservatoryWebsitePagesDialogComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'uri',
    'select'
  ];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selection: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChooseObservatoryWebsitePagesDialogComponent>,
    private get: GetService,
    private update: UpdateService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;

    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.get.listOfWebsitePages(this.data.id)
      .subscribe(pages => {
        if (pages) {
          this.pages = pages;
          this.dataSource = new MatTableDataSource<any>(pages);
          this.dataSource.data.forEach(page => {
            if (page.Show_In[2] === '1') {
              this.selection.select(page);
            }
          });
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }

  updateObservatoryPages(e): void {
    e.preventDefault();
    const pagesId = this.pages.map((page) => {
      let selected = this.selection.isSelected(page.pageId);
      return { id: page.pageId, inObservatory: selected }
    });

    this.update.observatoryPages(pagesId)
      .subscribe(success => {
        if (success) {
          this.message.show('WEBSITES_PAGE.UPDATE.observatorio.success');
          this.dialogRef.close();
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
