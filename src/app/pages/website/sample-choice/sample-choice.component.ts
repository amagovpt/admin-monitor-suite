import { Component, OnInit,Input, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Page } from '../../../models/page';
import { GetService } from '../../../services/get.service';
import { PageComponent } from '../../page/page.component';


interface auxList{
  uri:string;
  roles: string[];
  tags: string[]
}

@Component({
  selector: 'app-sample-choice',
  templateUrl: './sample-choice.component.html',
  styleUrls: ['./sample-choice.component.css']
})

export class SampleChoiceComponent implements OnInit,AfterViewInit {
  @Input("evaluations") evaluations: Array<any>;

  element:any;
  elements: string[];
  sortArray1: string[];
  sortArray2: string[];
  aux: string;
  aux2: string;
  tag: string;
  website: string;
  page: string;
  loading: boolean;
  error: boolean;
  sub: Subscription;
  TagListaux: string[]= [];
  roleListaux: string[]= [];
  TagList: string[];
  roleList: string[];
  auxtagList: string[];
  auxroleList: string[]
  auxR: string;
  auxT: string;
  auxlist: auxList [] = [];
  rolenumber: number[] = [];
  tagnumber: number[] = [];
  j: number = 0;
  k: number = 0;

constructor(private activatedRoute: ActivatedRoute,private get: GetService,private cd: ChangeDetectorRef){
  this.loading = true;
  this.error = false;
}
  
ngOnInit(): void {
this.element = {
    roles: {},
    tags: {},

      
  }; 


}
ngAfterViewInit(){
  if (this.evaluations != null && this.evaluations != undefined){
   //Getting List of roles/tags in website
    this.roleList = [];
    this.TagList = [];

    for(let i = 0; i<=(this.evaluations.length-1); i++){
      this.auxlist.push({uri:"",roles:[],tags:[]})
    }
for(let f =0; f<= (this.evaluations.length-1); f++){
    this.auxlist[f].uri = this.evaluations[f].Uri;
    this.auxR = this.evaluations[f].Element_Count.slice(1,-1);
    this.auxT = this.evaluations[f].Tag_Count.slice(1,-1);
    this.auxtagList = this.auxT.split(/[:,]/);
    this.auxroleList= this.auxR.split(/[:,]/);

    for(let i = 0; i<= (this.auxroleList.length-1); i++){
      if (i % 2 == 0) {
        this.auxlist[f].roles[this.j] = this.auxroleList[i];
        this.j++;
      }
    }

    for(let i = 0; i<= (this.auxtagList.length-1); i++){
      if (i % 2 == 0) {
        this.auxlist[f].tags[this.k] = this.auxtagList[i] ;
        this.k++;
      }
    }


this.j = 0;
this.k = 0;
}
//Creating the unique role/tag list
for(let g = 0; g<= (this.auxlist.length-1); g++){
    for(let a= 0; a<=(this.auxlist[g].roles.length-1); a++){
      this.roleListaux.push(this.auxlist[g].roles[a]);

    }
  

    for(let c=0; c <=(this.auxlist[g].tags.length-1); c++){
        this.TagListaux.push(this.auxlist[g].tags[c]);
      
}


}

 this.TagList =[...new Set(this.TagListaux)];
 this.roleList =[...new Set(this.roleListaux)];

//creating number array for counting of pages with certain role/tag
for(let b = 0; b<=(this.roleList.length-1); b++){
  this.rolenumber.push(0);
}
for(let d= 0; d<=(this.TagList.length-1); d++){
  this.tagnumber.push(0);
}
//counting pages with role/tag in list
for(let b = 0; b<=(this.roleList.length-1); b++){
  for(let g = 0; g<= (this.auxlist.length-1); g++){
    for(let a= 0; a<=(this.auxlist[g].roles.length-1); a++){
      if(this.auxlist[g].roles[a].includes(this.roleList[b]) == true){
        this.rolenumber[b]++;
      }
    }
  }

}
for(let d= 0; d<=(this.TagList.length-1); d++){
  for(let g = 0; g<= (this.auxlist.length-1); g++){
    for(let a= 0; a<=(this.auxlist[g].tags.length-1); a++){
      if(this.auxlist[g].tags[a].includes(this.TagList[d]) == true){
        this.tagnumber[d]++;
      }
    }
  }


}


for(let q = 0; q<=(this.roleList.length-1); q++){
  this.roleList[q] = this.roleList[q].slice(1,-1);

  this.roleList[q] = this.roleList[q] + ": " + this.rolenumber[q].toString();

}

for(let p = 0; p<=(this.TagList.length-1); p++){
  this.TagList[p] = this.TagList[p].slice(1,-1);

  this.TagList[p] = "<" + this.TagList[p] + ">";
  this.TagList[p] = this.TagList[p] + ": " + this.tagnumber[p].toString();

}

  

  this.sortArray1=this.roleList; 
 
  this.sortArray1.sort(function (a,b){
    if (a > b){
    return 1;

    }
    if(a < b){
      return -1;

    }
    if (a === b){
      return 0;
    
    }
  
})   
      this.element.roles = this.sortArray1 ; 
      

  //Sorting tags

  this.sortArray2= this.TagList;

  this.sortArray1.sort(function (a,b){
    if (a > b){
    return 1;

    }
    if(a < b){
      return -1;

    }
    if (a === b){
      return 0;
    
    }
  
})   
      this.element.tags = this.sortArray2 ; 
}
}
  

sampleSize = '';


sortedAlphabeticlyAsc(){

  this.sortArray2.sort(function (a,b){
    if (a > b){
    return 1;

    }
    if(a < b){
      return -1;

    }
    if (a === b){
      return 0;
    
    }
  
})   



      this.element.tags = this.sortArray2 ; 

}
sortedAlphabeticlyAsc2(){
  

  this.sortArray1.sort(function (a,b){
    if (a > b){
    return 1;

    }
    if(a < b){
      return -1;

    }
    if (a === b){
      return 0;
    
    }
  
})   
      this.element.elements = this.sortArray1 ; 
}
sortedbyNumberAsc(){
  

    this.sortArray2.sort(function (a,b){ 
      if(parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))){
      
          return -1;
        }
        if(parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))){
          return 0;
        }
        if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))){
          
          return 1;
        }

    })



  this.element.tags = this.sortArray2; 

  }
      
sortedbyNumberAsc2(){
  
 

    this.sortArray1.sort(function (a,b){ 
      if(parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))){
      
          return -1;
        }
        if(parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))){
          return 0;
        }
        if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))){
          
          return 1;
        }

    })



  this.element.elements = this.sortArray1; 
}
sortedAlphabeticlyDsc(){
   
 


  this.sortArray2.sort(function (a,b){
    if (a > b){
    return -1;

    }
    if(a < b){
      return 1;

    }
    if (a === b){
      return 0;
    
    }
  
})   



      this.element.tags = this.sortArray2 ; 

}
sortedAlphabeticlyDsc2(){
    
  
 


  this.sortArray1.sort(function (a,b){
    if (a > b){
    return -1;

    }
    if(a < b){
      return 1;

    }
    if (a === b){
      return 0;
    
    }
  
})   

      this.element.elements = this.sortArray1 ; 
}
sortedbyNumberDsc(){


    this.sortArray2.sort(function (a,b){ 
      if(parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))){
      
          return 1;
        }
        if(parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))){
          return 0;
        }
        if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))){
          
          return -1;
        }

    })



  this.element.tags = this.sortArray2; 
}
sortedbyNumberDsc2(){
  
  

    this.sortArray1.sort(function (a,b){ 
      if(parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))){
      
          return 1;
        }
        if(parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))){
          return 0;
        }
        if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))){
          
          return -1;
        }

    })



  this.element.elements = this.sortArray1; 
}
}





