import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ActivatedRoute
} from '@angular/router';
import {
  GetService
} from '../../../services/get.service';

import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import {
  ImportWebsiteDialogComponent
} from '../../../dialogs/import-website-dialog/import-website-dialog.component';

@Component({
  selector: 'app-list-of-websites-user',
  templateUrl: './list-of-websites-user.component.html',
  styleUrls: ['./list-of-websites-user.component.css']
})
export class ListOfWebsitesUserComponent implements OnInit {
  displayedColumns = [
    'name',
    //'Entity',
    'creationDate',
    'Import',
  ];

  // data source of websites
  websites: Array<any>;
  dataSource: any;
  selection: any;

  loading: boolean;

  user: string;
  type: string;
  tag: string;
  userType: string;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
      this.tag = _.trim(params.tag);

      this.get.userType(this.user)
        .subscribe(type => {
          if (type !== null) {
            this.type = type;
            if (type === 'studies' || type === 'nimda') {
              this.getListOfStudiesWebsites();
            } else {
              this.getListOfWebsites();
            }
            this.loading = false;
          }
        });
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  private getListOfStudiesWebsites(): void {
    this.get.listOfStudiesTagWebsites(this.user, this.tag)
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
          this.dataSource = new MatTableDataSource(this.websites);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          const paginatorIntl = new MatPaginatorIntl();
          paginatorIntl.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
          paginatorIntl.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
          paginatorIntl.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
          paginatorIntl.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
          paginatorIntl.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
          paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

          this.dataSource.paginator._intl = paginatorIntl;
        }
        this.loading = false;
      });
  }

  private getListOfWebsites(): void {
    this.get.listOfUserWebsites(this.user)
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
          this.dataSource = new MatTableDataSource(websites);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          const paginatorIntl = new MatPaginatorIntl();
          paginatorIntl.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
          paginatorIntl.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
          paginatorIntl.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
          paginatorIntl.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
          paginatorIntl.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
          paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

          this.dataSource.paginator._intl = paginatorIntl;
        }
        this.loading = false;
      });
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

  openImportWebsiteDialog(websiteName, websiteId, webName, url: string, hasUrl: boolean): void {
    const importWebsiteDialog = this.dialog.open(ImportWebsiteDialogComponent, {
      width: '40vw',
      data: {
        website: websiteName,
        websiteId: websiteId,
        hasUrl: hasUrl,
        webName: webName,
        url: url
      }
    });
    importWebsiteDialog.afterClosed().subscribe(result => {
      if (result) {
        const website = _.filter(this.websites, ['websiteId', websiteId]);
        website[0].imported = true;
        this.cd.detectChanges();
        //window.location.reload();
      }
    });
  }
}
