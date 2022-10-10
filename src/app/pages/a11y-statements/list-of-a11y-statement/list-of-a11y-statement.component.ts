import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { EditUserDialogComponent } from '../../../dialogs/edit-user-dialog/edit-user-dialog.component';
import { GetService } from '../../../services/get.service';
import * as _ from "lodash";


@Component({
  selector: 'app-list-of-a11y-statement',
  templateUrl: './list-of-a11y-statement.component.html',
  styleUrls: ['./list-of-a11y-statement.component.css']
})
export class ListOfA11yStatementComponent implements OnInit {

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "website",
    "statementDate",
    "state",
    "conformance",
    "seal",
    "automaticEvaluations",
    "manualEvaluations",
    "userEvaluations",
  ];

  dataSource: any;
  selection: any;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfA11yStatements();
  }

  private getListOfA11yStatements(): void {
    const a11tStatements = [{
        website:"Autenticação.Gov",
        statementDate: "11/11/2022",
        state:"completeStatement",
        seal: 'Ouro',
        conformance: 'plenamente conforme',
        automaticEvaluations: 1,
        manualEvaluations: 2,
        userEvaluations: 3,
    },{
        website: "Autenticação.Gov",
        statementDate: "11/11/2022",
        state: "completeStatement",
        seal: 'Ouro',
        conformance: 'plenamente conforme',
        automaticEvaluations: 2,
        manualEvaluations: 5,
        userEvaluations: 3,
      }];
    if (a11tStatements !== null) {
      this.dataSource = new MatTableDataSource(a11tStatements);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        const paginatorIntl = new MatPaginatorIntl();
        paginatorIntl.itemsPerPageLabel = this.translate.instant(
          "ITEMS_PER_PAGE_LABEL"
        );
        paginatorIntl.nextPageLabel = this.translate.instant("NEXT_PAGE_LABEL");
        paginatorIntl.previousPageLabel = this.translate.instant(
          "PREVIOUS_PAGE_LABEL"
        );
        paginatorIntl.firstPageLabel =
          this.translate.instant("FIRST_PAGE_LABEL");
        paginatorIntl.lastPageLabel = this.translate.instant("LAST_PAGE_LABEL");
        paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

        this.dataSource.paginator._intl = paginatorIntl;
      } else {
        this.error = true;
      }

      this.loading = false;
      this.cd.detectChanges();
  }

  private getRangeLabel(
    page: number,
    pageSize: number,
    length: number
  ): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant("RANGE_PAGE_LABEL_1", { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return this.translate.instant("RANGE_PAGE_LABEL_2", {
      startIndex: startIndex + 1,
      endIndex,
      length,
    });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

}
