import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetService } from '../../../services/get.service';
import { saveAs } from "file-saver";


@Component({
  selector: 'app-action-log-list',
  templateUrl: './action-log-list.component.html',
  styleUrls: ['./action-log-list.component.css']
})
export class ActionLogListComponent implements OnInit {

  logs: string;
  loading: boolean;
  error: boolean;

  constructor(private get: GetService, private cd: ChangeDetectorRef) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfActionLogs().subscribe((logs) => {
      this.logs = logs;
      this.loading = false;
      this.cd.detectChanges();
    })}

  getFile(fileName: string) {
    this.get.getActionLog(fileName).subscribe(async (file) => {
      saveAs(file, fileName);
    })
  }

}
