import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { GetService } from '../../../services/get.service';

@Component({
  selector: 'app-manual-evaluation-table',
  templateUrl: './manual-evaluation-table.component.html',
  styleUrls: ['./manual-evaluation-table.component.css']
})
export class ManualEvaluationTableComponent implements OnInit {


  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "title",
    "date",
    "sample",
    "heuristicsPassed",
    "heuristicsTotal",
    "url",
  ];

  dataSource: any;
  selection: any;
  
  @Input("list") list: any[];

  constructor(
    private get: GetService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
      console.log(this.list);
    if (this.list !== null) {
        this.dataSource = new MatTableDataSource(this.list);
        this.dataSource.sort = this.sort;
      } else {
        this.error = true;
      }

      this.loading = false;
      this.cd.detectChanges();

  }
}
