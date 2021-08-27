import { Component, OnInit,Input, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy, AfterViewInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ElementFinder } from 'protractor';


interface element{
  uri: string;
  roles: string[];
  tags: string[];
}
interface tablevalue{
  uri:string;
  checkbox: number;
}

@Component({
    selector: 'app-checkbox-card',
    templateUrl: './checkbox-card.component.html',
    styleUrls: ['./checkbox-card.component.css']
  })
  export class CheckBoxCardComponent implements OnInit, OnDestroy,AfterViewInit {
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
    checkbox: string;
    auxn: number;
    auxf: string;
    auxg: string[]
    constructor() {
      }
    ngOnInit():void{
      this.displayedColumns = ['Uri', 'CheckBox'];
      for(let i = 0; i<=(this.dataSourceO.length-1); i++){
          this.obj.push({uri:"",roles:[],tags:[]})
      }
      this.checkbox = "checkbox";    
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
  for (let j = 0; j<=(this.obj[g].roles.length-1); j++){
      if((this.obj[g].roles[j]).includes(this.checkbox) === true && (this.auxdataSource.length-1) === g){
        this.auxdataSource.push({uri:"",checkbox:0});
        this.auxn = j;
        this.auxdataSource[g].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].roles[j];
        this.auxg = this.auxf.split(":");
        this.auxdataSource[g].checkbox = parseInt(this.auxg[1]);
      }
      else if((this.obj[g].roles[j]).includes(this.checkbox) === true && (this.auxdataSource.length-1) < g){
        this.auxdataSource.push({uri:"",checkbox:0});
        let f =(this.auxdataSource.length-1);
        this.auxn = j;
        this.auxdataSource[f].uri = this.obj[g].uri; 
        this.auxf = this.obj[g].roles[j];
        this.auxg = this.auxf.split(":");
        this.auxdataSource[f].checkbox = parseInt(this.auxg[1]);
      }
  }


  }
  let compareTotal = function (a:tablevalue,b: tablevalue){
    if (a.checkbox > b.checkbox){
    return -1;

    }
    if(a.checkbox < b.checkbox){
      return 1;

    }
    if (a.checkbox === b.checkbox){
      return 0;
    
    }
  
}   
    let sortedArray = this.auxdataSource.sort(compareTotal);


  this.dataSource = new MatTableDataSource (sortedArray);
  if(this.dataSource !== null && this.dataSource !== undefined){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
           

    ngOnDestroy():void{
       
    }

  }