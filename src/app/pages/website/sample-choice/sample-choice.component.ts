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
  TagList: string[];
  roleList: string[];
  auxtagList: string[];
  auxroleList: string[]
  auxR: string;
  auxT: string;
  auxlist: auxList [] = [];
  j: number = 0;
  k: number = 0;
  flagr: number = 0;
  flagt: number = 0;
//@ViewChild('input') input: ElementRef;
constructor(private activatedRoute: ActivatedRoute,private get: GetService,private cd: ChangeDetectorRef,){
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

;
this.j = 0;
this.k = 0;
}

for(let g = 0; g<= (this.auxlist.length-1); g++){
  if(this.roleList.length>0){
    for(let a= 0; a<=(this.auxlist[g].roles.length-1); a++){
    for(let b =0; b<=(this.roleList.length-1); b++){
    if(this.roleList[b].includes(this.auxlist[g].roles[a])!== true && this.flagr == 0){
      this.roleList.push(this.auxlist[g].roles[a]);
      this.flagr =1;
      console.log("I m here");
    }
    else{
      console.log("Nao estou adicionar coisas novas");
    }
    }
  }
}
  else if(this.roleList.length<=0){
      this.roleList = this.auxlist[g].roles;

  }

  if (this.TagList.length>0){
    for(let c=0; c <=(this.auxlist[g].tags.length-1); c++){
    for(let d =0; d<=this.TagList.length-1; d++){
      if(this.TagList[d].includes(this.auxlist[g].tags[c])!== true && this.flagt == 0){
        this.TagList.push(this.auxlist[g].tags[c]);
        this.flagt = 1;
        console.log("Estou aqui");
      }
  }
}
}
  else if(this.TagList.length<=0){
      this.TagList = this.auxlist[g].tags ;
  }
this.flagt = 0;
this.flagr = 0 ;
}
for(let f = 0; f<=; f++){

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





