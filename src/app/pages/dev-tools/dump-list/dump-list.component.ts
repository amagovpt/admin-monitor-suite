import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetService } from '../../../services/get.service';
import { saveAs } from "file-saver";
import { DeleteService } from '../../../services/delete.service';
import { CreateService } from '../../../services/create.service';


@Component({
  selector: 'app-dump-list',
  templateUrl: './dump-list.component.html',
  styleUrls: ['./dump-list.component.css']
})
export class DumpListComponent implements OnInit {

  files: string;
  loading: boolean;
  error: boolean;

  constructor(private get: GetService,  private cd: ChangeDetectorRef, private del:DeleteService, private create:CreateService) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.updateList();
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

  deleteFile(file: any) {
    this.del.dump(file.fileName).subscribe(async (file) => {    
      this.updateList();
  })}

  createDump() {
    this.create.dump().subscribe(async (result) => {
      this.updateList();
    })
  }
  updateList() {
    this.get.listOfDumpFiles().subscribe((files) => {
      this.files = files;
      this.loading = false;
      this.cd.detectChanges();
    })
}

}
