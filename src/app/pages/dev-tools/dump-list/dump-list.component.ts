import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetService } from '../../../services/get.service';
import { saveAs } from "file-saver";
import { DeleteService } from '../../../services/delete.service';


@Component({
  selector: 'app-dump-list',
  templateUrl: './dump-list.component.html',
  styleUrls: ['./dump-list.component.css']
})
export class DumpListComponent implements OnInit {

  files: string;
  loading: boolean;
  error: boolean;

  constructor(private get: GetService,  private cd: ChangeDetectorRef, private del:DeleteService) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfDumpFiles().subscribe((files) => {
      this.files = files;
      this.loading = false;
      this.cd.detectChanges();
    })
  }

  getFile(fileName: string) {
    this.get.getDumpFile(fileName).subscribe(async (file) => {
      let blob = new Blob([file], {
        type: "type: 'application/octet-stream"
      });
      let text = '{' + await blob.text() + '}';
      blob = new Blob([text], {
        type: "type: 'application/octet-stream"
      });
      saveAs(blob, fileName);
    })
  }

  deleteFile(fileName: string) {
    this.del.dump(fileName).subscribe(async (file) => {    
  })}

}
