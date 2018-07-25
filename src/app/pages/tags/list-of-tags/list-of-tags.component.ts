import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

import { ServerService } from '../../../services/server.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-list-of-tags',
  templateUrl: './list-of-tags.component.html',
  styleUrls: ['./list-of-tags.component.css']
})
export class ListOfTagsComponent implements OnInit {

  loading: boolean;

  displayedColumns = ['TagId', 'Name', 'Show_in_Observatorio', 'Creation_Date', 'Entities', 'Websites', 'Domains', 'Pages', 'edit'];

  // data source of domains
  dataSource: any;
  selection: any;

  // table filter
  @ViewChild('input') input: ElementRef;

  // column sorter
  @ViewChild(MatSort) sort: MatSort;

  // table paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private server: ServerService, private message: MessageService) {
    this.loading = true;

    this.server.userPost('/tags/allInfo', {})
      .subscribe((data) => {
        console.log(data);
        switch (data['success']) {
          case 1:
            this.dataSource = new MatTableDataSource(data['result']);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            break;
        }
      }, (error) => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loading = false;
      });
  }

  ngOnInit(): void {
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }
}