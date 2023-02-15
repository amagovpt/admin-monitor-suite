import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { saveAs } from "file-saver";
import { GetService } from '../../../services/get.service';


@Component({
  selector: 'app-error-log-list',
  templateUrl: './error-log-list.component.html',
  styleUrls: ['./error-log-list.component.css']
})
export class ErrorLogListComponent implements OnInit {
  logs: string;
  loading: boolean;
  error: boolean;

  constructor(private get: GetService, private cd: ChangeDetectorRef) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfErrorLogs().subscribe((logs) => {
      this.logs = logs;
      this.loading = false;
      this.cd.detectChanges();
    })
  }

  getFile(fileName: string) {
    this.get.getErrorLog(fileName).subscribe(async (file) => {
      saveAs(file, fileName);
    })
  }
}
