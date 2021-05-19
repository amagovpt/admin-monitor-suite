import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetService } from '../../services/get.service';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {

  entities: Array<any>;

  loading: boolean;
  error: boolean;

  constructor(private readonly get: GetService,private cd: ChangeDetectorRef) {
    this.loading = false;
    this.error = false;
  }

  ngOnInit() {
    //this.getListOfEntities();
  }

  refreshEntities(): void {
    //this.loading = true;
    //this.getListOfEntities();
  }

  /*private getListOfEntities(): void {
    this.get.listOfEntities()
      .subscribe(entities => {
        if (entities !== null) {
          this.entities = entities;
        } else {
          this.error = true;
        }
        
        this.loading = false;
        this.cd.detectChanges();
      });
  }*/
}
