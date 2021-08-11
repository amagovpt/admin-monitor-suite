import { Component, OnInit,Input, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy, ViewChild, AfterViewInit} from '@angular/core';
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
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
}
@Component({
    selector: 'app-noheading-card',
    templateUrl: './noheading-card.component.html',
    styleUrls: ['./noheading-card.component.css']
  })
  export class NoHeadingComponent implements OnInit, OnDestroy ,AfterViewInit {
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
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    auxn: number;
    auxf: string;
    auxg: string[];
    flags: number [] = [];
    constructor() {
      }
    ngOnInit():void{
      this.displayedColumns = ['Uri', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      for(let i = 0; i<=(this.dataSourceO.length-1); i++){
          this.obj.push({uri:"",roles:[],tags:[]})
      }
      this.h1 ="h1";
      this.h2 ="h2";
      this.h3="h3";
      this.h4 ="h4";
      this.h5= "h5";
      this.h6= "h6";
   
    
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
    this.flags.push(0);
    this.auxdataSource.push({uri:"",h1:0,h2:0,h3:0,h4:0,h5: 0,h6:0});
  for (let j = 0; j<=(this.obj[g].tags.length-1); j++){
      if((this.obj[g].tags[j]).includes(this.h1) === false && (this.obj[g].tags[j]).includes(this.h2) === false && (this.obj[g].tags[j]).includes(this.h3) === false && (this.obj[g].tags[j]).includes(this.h4) === false &&(this.obj[g].tags[j]).includes(this.h5) === false && (this.obj[g].tags[j]).includes(this.h6) === false ){
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].tags[j];
        this.auxg = this.auxf.split(":");
        this.auxdataSource[g].h1 = 0;
        this.auxdataSource[g].h2 = 0;
        this.auxdataSource[g].h3 = 0;
        this.auxdataSource[g].h4 = 0;
        this.auxdataSource[g].h5 = 0;
        this.auxdataSource[g].h6 = 0;
      }
      else if((this.obj[g].tags[j]).includes(this.h1) === true || (this.obj[g].tags[j]).includes(this.h2) === true || (this.obj[g].tags[j]).includes(this.h3) === true || (this.obj[g].tags[j]).includes(this.h4) === true || (this.obj[g].tags[j]).includes(this.h5) === true || (this.obj[g].tags[j]).includes(this.h6) === true && this.flags[g]!==0){
        this.flags[g] = 1;
      }   
  }


  }

for(let h = 0 ; h<= ((this.flags).length-1) ;h++){
  if(this.flags[h]===0){
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