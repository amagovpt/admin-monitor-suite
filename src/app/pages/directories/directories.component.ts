import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetService } from '../../services/get.service';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html',
  styleUrls: ['./directories.component.css']
})
export class DirectoriesComponent implements OnInit {

  error: boolean;
  loading: boolean;

  directories: any;

  constructor(private get: GetService, private cd: ChangeDetectorRef) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfDirectories();
  }

  refreshDirectories(): void {
    this.loading = true;
    this.getListOfDirectories();
  }

  private getListOfDirectories(): void {
    this.get.listOfDirectories().subscribe((directories) => {
      if (directories !== null) {
        this.directories = directories;
      } else {
        this.error = true;
      }

      this.loading = false;
      this.cd.detectChanges();
    });
  }
}
