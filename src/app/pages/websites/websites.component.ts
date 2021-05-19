import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { GetService } from '../../services/get.service';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.css']
})
export class WebsitesComponent implements OnInit {

  loading: boolean;
  error: boolean;

  websites: Array<any>;

  constructor(
    private get: GetService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = false;
    this.error = false;
  }

  ngOnInit(): void {
    //this.getListOfWebsites();
  }

  refreshWebsites(): void {
    //this.loading = true;
    //this.getListOfWebsites();
  }

  /*private getListOfWebsites(): void {
    this.get.listOfWebsites()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }*/
}
