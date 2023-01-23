import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { GetService } from '../../../services/get.service';

@Component({
  selector: 'app-automatic-evaluation-table',
  templateUrl: './automatic-evaluation-table.component.html',
  styleUrls: ['./automatic-evaluation-table.component.css']
})
export class AutomaticEvaluationTableComponent implements OnInit {


  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "title",
    "date",
    "sample",
    "tool",
    "summary",
    "url",
  ];

  dataSource: any;
  selection: any;
  @Input("list") list: any[];


  constructor(
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
