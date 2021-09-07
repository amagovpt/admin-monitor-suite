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
  header:number;
  aside: number;
  footer:number;
  main: number;
  nav: number;
  section:number;
  total:number;
}


@Component({
    selector: 'app-uniquelandmark-card',
    templateUrl: './uniquelandmark-card.component.html',
    styleUrls: ['./uniquelandmark-card.component.css']
  })
  export class UniqueLandMarkCardComponent implements OnInit, OnDestroy ,AfterViewInit {
    @Input("dataSourceO") dataSourceO: Array<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    auxdataSource : tablevalue[] =[];
    auxdataSource1 : tablevalue[] =[];
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
      this.displayedColumns = ['Uri', 'Header', 'Aside','Footer', 'Main','Nav','Section','Total'];
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
    this.flags.push(0);
    this.auxdataSource.push({uri:"",header:0,aside:0,footer:0,main:0,nav: 0,section:0,total:0});
  for (let j = 0; j<=(this.obj[g].tags.length-1); j++){
      if((this.obj[g].tags[j]).includes(this.header) === true){
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].tags[j];
        this.auxg = this.auxf.split(":");
      if(parseInt(this.auxg[1]) > 1) {
        this.auxdataSource[g].header = parseInt(this.auxg[1]);
        this.flags[g] = 1;
        break;

        
      }
      }
      
      if((this.obj[g].tags[j]).includes(this.footer) === true){
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].tags[j];
        this.auxg = this.auxf.split(":");
        if(parseInt(this.auxg[1]) > 1) {
          this.auxdataSource[g].footer = parseInt(this.auxg[1]);
          this.flags[g] = 1;
          break;
        }
      }
      if((this.obj[g].tags[j]).includes(this.main) === true  ){
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].tags[j];
        this.auxg = this.auxf.split(":");
        if(parseInt(this.auxg[1]) > 1) {
          this.auxdataSource[g].main = parseInt(this.auxg[1]);
          this.flags[g] = 1;
          break;
        }
      }
  }


  }
  for(let h = 0 ; h<= ((this.flags).length-1) ;h++){
        if(this.flags[h]===1){
        for (let j = 0; j<=(this.obj[h].tags.length-1); j++){
          if((this.obj[h].tags[j]).includes(this.header) === true ){
            this.auxn = j;
            this.auxdataSource[h].uri = this.obj[h].uri; 
            this.auxf = this.obj[h].tags[j];
            this.auxg = this.auxf.split(":");
            this.auxdataSource[h].header = parseInt(this.auxg[1]);
          }
          else if((this.obj[h].tags[j]).includes(this.aside) === true ){
            this.auxn = j;
            this.auxdataSource[h].uri = this.obj[h].uri; 
            this.auxf = this.obj[h].tags[j];
            this.auxg = this.auxf.split(":");
            this.auxdataSource[h].aside = parseInt(this.auxg[1]);
         
          }
          else if((this.obj[h].tags[j]).includes(this.footer) === true  ){
            this.auxn = j;
            this.auxdataSource[h].uri = this.obj[h].uri; 
            this.auxf = this.obj[h].tags[j];
            this.auxg = this.auxf.split(":");
            this.auxdataSource[h].footer = parseInt(this.auxg[1]);
          }
          else if((this.obj[h].tags[j]).includes(this.main) === true  ){
            this.auxn = j;
            this.auxdataSource[h].uri = this.obj[h].uri; 
            this.auxf = this.obj[h].tags[j];
            this.auxg = this.auxf.split(":");
            this.auxdataSource[h].main = parseInt(this.auxg[1]);
          }
          else if((this.obj[h].tags[j]).includes(this.nav) === true ){
            this.auxn = j;
            this.auxdataSource[h].uri = this.obj[h].uri; 
            this.auxf = this.obj[h].tags[j];
            this.auxg = this.auxf.split(":");
            this.auxdataSource[h].nav = parseInt(this.auxg[1]);
          }
          else if((this.obj[h].tags[j]).includes(this.section) === true){
            this.auxn = j;
            this.auxdataSource[h].uri = this.obj[h].uri; 
            this.auxf = this.obj[h].tags[j];
            this.auxg = this.auxf.split(":");
            this.auxdataSource[h].section = parseInt(this.auxg[1]);
          }
        }
      }
  }
 
  for(let h = 0 ; h<= ((this.flags).length-1) ;h++){
    
    if(this.flags[h]===1){
      this.auxdataSource1.push(this.auxdataSource[h]);    
    }
}
for(let p = 0;p<=(this.auxdataSource1.length -1);p++){
  this.auxdataSource1[p].total = this.auxdataSource1[p].header + this.auxdataSource1[p].aside + this.auxdataSource1[p].footer + this.auxdataSource1[p].main + this.auxdataSource1[p].nav + this.auxdataSource1[p].section;

}
let compareTotal = function (a:tablevalue,b: tablevalue){
  if (a.total > b.total){
  return -1;

  }
  if(a.total < b.total){
    return 1;

  }
  if (a.total === b.total){
    return 0;
  
  }

}   
  let sortedArray = this.auxdataSource1.sort(compareTotal);


  this.dataSource = new MatTableDataSource (sortedArray);
  if(this.dataSource !== null && this.dataSource !== undefined){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
    ngOnDestroy():void{
       
    }

  }