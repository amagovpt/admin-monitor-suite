import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { GetService } from '../../../services/get.service';

@Component({
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.css']
})
export class ContactTableComponent implements OnInit {


  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @Input("list") list: any[];

  loading: boolean;
  error: boolean;

  displayedColumns = [
    "contactType",
    "contact",
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
