import { Component, OnInit } from '@angular/core';
import { GetService } from '../../services/get.service';

@Component({
  selector: 'app-dev-tools',
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.css']
})
export class DevToolsComponent implements OnInit {

  constructor(
    private get: GetService,
  ) {

  }
  ngOnInit(): void {
    this.get.observatoryData().subscribe((observatory) => {
      console.log(observatory);
    })
  }

}
