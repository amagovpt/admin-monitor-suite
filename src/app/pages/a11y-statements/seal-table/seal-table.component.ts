import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { GetService } from '../../../services/get.service';

@Component({
  selector: 'app-seal-table',
  templateUrl: './seal-table.component.html',
  styleUrls: ['./seal-table.component.css']
})
export class SealTableComponent implements OnInit {

  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "seal",
    "declarationNumber",
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
    this.get.numberfA11yStatementsBySeal().subscribe((list) => {
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
