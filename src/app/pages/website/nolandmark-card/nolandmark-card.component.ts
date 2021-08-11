import { Component, OnInit,Input, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy, AfterViewInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';


import { MatTableDataSource } from '@angular/material/table';

import { ThrowStmt } from '@angular/compiler';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
//import { EvaluationService } from '../../services/evaluation.service';
interface element{
  uri: string;
  roles: string[];
  tags: string[];
}
interface tablevalue{
  uri:string;
  header:number;
  aside: number;
  footer:number;
  main: number;
  nav: number;
  section:number;
}

@Component({
    selector: 'app-nolandmark-card',
    templateUrl: './nolandmark-card.component.html',
    styleUrls: ['./nolandmark-card.component.css']
  })
  export class NoLandMarkCardComponent implements OnInit, OnDestroy ,AfterViewInit {
    @Input("dataSourceO") dataSourceO: Array<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    auxdataSource : tablevalue[] =[];
    auxdataSource1: tablevalue[] = [];
    dataSource: any;
    displayedColumns: string[];
    tags: string[];
    obj : element[] = [];
    auxR: string;
    auxT: string;
    header: string;
    aside: string;
    footer: string;
    main: string;
    nav: string;
    section: string;
    auxn: number;
    auxf: string;
    auxg: string[];
    flags: number [] = [];
    constructor() {
      }
    ngOnInit():void{
      this.displayedColumns = ['Uri', 'Head', 'Aside','Footer', 'Main','Nav','Section'];
      for(let i = 0; i<=(this.dataSourceO.length-1); i++){
          this.obj.push({uri:"",roles:[],tags:[]})
      }
      this.header ="header";
      this.aside ="aside";
      this.footer="footer";
      this.main ="main";
      this.nav= "nav";
      this.section= "section";
   
    
  }

  ngAfterViewInit():void{

    //colocar os valores dentro do obj
    for(let i = 0; i<=(this.dataSourceO.length-1); i++){
      this.obj[i].uri = this.dataSourceO[i].Uri;
      this.auxR =this.dataSourceO[i].Element_Count.slice(1,-1); 
      this.obj[i].roles = this.auxR.split(",");
      this.auxT = this.dataSourceO[i].Tag_Count.slice(1,-1);
      this.obj[i].tags = this.auxT.split(",");
  }

  for(let g = 0; g<= (this.obj.length-1);g ++){
    this.flags.push(1);
    this.auxdataSource.push({uri:"",header:0,aside:0,footer:0,main:0,nav: 0,section:0});
  for (let j = 0; j<=(this.obj[g].tags.length-1); j++){
    if((this.obj[g].tags[j]).includes(this.header) === true || (this.obj[g].tags[j]).includes(this.aside) === true || (this.obj[g].tags[j]).includes(this.footer) === true || (this.obj[g].tags[j]).includes(this.main) === true || (this.obj[g].tags[j]).includes(this.nav) === true || (this.obj[g].tags[j]).includes(this.section) === true && this.flags[g]!==0){
      this.flags[g] = 0;
    }     
  }

  }

  for(let g = 0; g<= (this.obj.length-1);g ++){
    if (this.flags[g] ===1){
      this.auxdataSource[g].uri = this.obj[g].uri; 
    }
  }
  for(let h = 0 ; h<= ((this.flags).length-1) ;h++){
      if(this.flags[h]===1){
        this.auxdataSource1.push(this.auxdataSource[h]);    
      }
  }



  this.dataSource = new MatTableDataSource (this.auxdataSource1);
  if(this.dataSource !== null && this.dataSource !== undefined){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
    ngOnDestroy():void{
       
    }

  }