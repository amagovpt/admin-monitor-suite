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
  img: number;
  svg: number;
}


@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.css']
  })
  export class ImageCardComponent implements OnInit, OnDestroy ,AfterViewInit {
    @Input("dataSourceO") dataSourceO: Array<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    auxdataSource : tablevalue[] =[];
    dataSource: any;
    displayedColumns: string[];
    tags: string[];
    obj : element[] = [];
    auxR: string;
    auxT: string;
    img: string;
    svg: string;
    auxn: number;
    auxf: string;
    auxg: string[];
    flags: number [] = [];
    constructor() {
      }
    ngOnInit():void{
      this.displayedColumns = ['Uri', 'Img', 'SVG'];
      for(let i = 0; i<=(this.dataSourceO.length-1); i++){
          this.obj.push({uri:"",roles:[],tags:[]})
      }
      this.img ="img";
      this.svg ="svg";
      
   
    
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
    this.auxdataSource.push({uri:"",img:0,svg:0});
    this.flags.push(1);
  for (let j = 0; j<=(this.obj[g].tags.length-1); j++){
      if((this.obj[g].tags[j]).includes(this.img) === true && (this.obj[g].tags[j]).includes(this.svg) === false){ 
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].tags[j];
        this.auxg = this.auxf.split(":");
        this.auxdataSource[g].img = parseInt(this.auxg[1]);
     
      }
      if((this.obj[g].tags[j]).includes(this.svg) === true && (this.obj[g].tags[j]).includes(this.img) === false){ 
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].tags[j];
        this.auxg = this.auxf.split(":");
        this.auxdataSource[g].svg = parseInt(this.auxg[1]);
     
      }
      else if((this.obj[g].tags[j]).includes(this.svg) === false && (this.obj[g].tags[j]).includes(this.img) === false && this.flags[g]!==1){
        this.flags[g] = 0;
      }  
       
  }


  }
(this.flags);
  for(let h = 0 ; h<= ((this.flags).length-1) ;h++){
      if(this.flags[h]===0){
       
        this.auxdataSource.splice(h,1);
        this.auxdataSource.splice(h,h);
      }
  }
  this.dataSource = new MatTableDataSource (this.auxdataSource);
  if(this.dataSource !== null && this.dataSource !== undefined){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
   
    ngOnDestroy():void{
       
    }

  }