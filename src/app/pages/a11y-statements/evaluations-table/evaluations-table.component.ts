import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { GetService } from '../../../services/get.service';
import * as _ from "lodash";


@Component({
  selector: 'app-evaluations-table',
  templateUrl: './evaluations-table.component.html',
  styleUrls: ['./evaluations-table.component.css']
})
export class EvaluationsTableComponent implements OnInit {


  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "type",
    "numberOfEvaluations",
  ];

  dataSource: any;
  selection: any;

  constructor(
    private get: GetService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.numberOfEvaluationByType().subscribe((list) => {
      console.log(list);
      if (list !== null) {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.sort = this.sort;
      } else {
        this.error = true;
      }

      this.loading = false;
      this.cd.detectChanges();
    })

  }

}
