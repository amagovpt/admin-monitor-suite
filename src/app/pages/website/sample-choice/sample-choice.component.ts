import { A11yModule } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { G, I } from '@angular/cdk/keycodes';
import { ThrowStmt } from '@angular/compiler';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, OnInit,Input, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { hasSubscribers } from 'diagnostic_channel';
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

interface sampleT{
  tag: string[];
  uri: string;
  tags: string[];
}

interface sampleR{
  role: string[];
  uri: string;
  roles:string[];
}

interface tagcount{
  tag: string;
  number: number;
}
interface rolecount{
  role: string;
  number: number;
}

@Component({
  selector: 'app-sample-choice',
  templateUrl: './sample-choice.component.html',
  styleUrls: ['./sample-choice.component.css']
})

export class SampleChoiceComponent implements OnInit,AfterViewInit {
  @Input("evaluations") evaluations: Array<any>;
  @ViewChildren ('checkBox') checkBox:QueryList<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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
  auxlist2: auxList [] = [];
  rolenumber: number[] = [];
  tagnumber: number[] = [];
  j: number = 0;
  k: number = 0;
  h3show: boolean = false;
  h3show2: boolean = false;
  h3show3: boolean = false;
  h3show4: boolean = false;
  choice_roles: any[] = [];
  choice_tags: any[] = [];
  tagarray :any[] =[];
  rolearray: any[] = [];
  sampleTagArray: sampleT[] = [];
  sampleRoleArray: sampleR[] = [] ;
  sampleTagArrayaux: sampleT[] = [];
  sampleRoleArrayaux: sampleR[] = [] ;
  tagAux: sampleT[] =[];
  roleAux: sampleR[] = [];
  finalSampleT: sampleT[] = [];
  finalSampleR: sampleR[] = [];
  tagListTS:tagcount[] =[];
  roleListTS: rolecount[] = [];
  FinalSampleRT : auxList[] = [];
  AuxFinalSampleRT : auxList[] = [];
  displayedColumns: string[];
  columns: string[] = [];
  dataSource: any;
  sortedArray: any;
  auxtags: string = '';
  value: boolean = false;
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
  this.roleListTS.push({role:this.roleList[q],number:this.rolenumber[q]})
  this.roleList[q] = this.roleList[q] + ": " + this.rolenumber[q].toString();

}

for(let p = 0; p<=(this.TagList.length-1); p++){
  this.TagList[p] = this.TagList[p].slice(1,-1);
  this.tagListTS.push({tag:this.TagList[p],number:this.tagnumber[p]});
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

SampleChoice(size,tags:string[],roles:string[]){
this.value = false;
this.tagarray =[];
this.rolearray= [];
this.sampleTagArray = [];
this.sampleRoleArray = [] ;
this.sampleTagArrayaux = [];
this.sampleRoleArrayaux = [] ;
this.tagAux =[];
this.roleAux= [];
this.finalSampleT = [];
this.finalSampleR = [];
this.AuxFinalSampleRT = [];
this.FinalSampleRT = [];
this.columns = [];
this.h3show = false;
this.h3show2 = false;
this.h3show3 = false;
this.h3show4 = false;

  let compareValues = function (a:any,b:any,key:string){
    if (a[key] > b[key] ){
    return -1;
  
    }
    if(a[key]  < b[key] ){
      return 1;
  
    }
    if (a[key]  === b[key] ){
      return 0;
    }
  
  }

  size = parseInt(size);

  let sortstring = function (a:string,b: string){
    if (a < b){
    return -1;
  
    }
    if(a > b){
      return 1;
  
    }
    if (a === b){
      return 0;
    
    }
  
  }   
    tags = tags.sort(sortstring);
    roles = roles.sort(sortstring)
  
  if(size < 0){
    this.h3show3 = true;
    this.sampleSize = '';
  }
  
  else if ((tags.length === 0 || tags === undefined || tags === null) && (roles.length === 0 || roles === undefined|| roles === null) ){
    this.h3show = true;
    this.sampleSize = '';   
  } 
  else if(size === 0){
    this.h3show2 = true;
    this.sampleSize = '';
  }

  else if(roles.length === 0 || roles === undefined|| roles === null ){

    let size2 = size*(tags.length);

     //Pesquisa de tags escolhidas por utilizador e adicionar a array Interface
    for(let g = 0; g<= (this.evaluations.length-1); g++){
      this.auxlist2.push({uri:"",tags:[],roles:[]})
      this.sampleTagArrayaux.push({tag:[],tags:[],uri:""})

      this.auxlist2[g].uri = this.evaluations[g].Uri;
      this.auxlist2[g].tags = (JSON.parse(this.evaluations[g].Tag_Count));
      
      
        for (let i = 0; i<= (tags.length -1); i++){
          if(this.auxlist2[g].tags[tags[i]] != undefined){
            this.sampleTagArrayaux[g].tag.push(tags[i]);
            this.sampleTagArrayaux[g].uri = this.auxlist2[g].uri;
            this.sampleTagArrayaux[g].tags = this.auxlist2[g].tags; 
          }

      }
  
  }
  

function hasUri(array:sampleT): boolean{
  return array.uri != ''
}


// filter 1
this.sampleTagArray = this.sampleTagArrayaux.filter(hasUri)
//filter depois sort e depois escolha

function tagsort(item) {

  for(let key = 0; key<= (tags.length -1); key++) {
    if (item.tag === undefined || !item.tag.includes(tags[key])){
      return false;
    }
    else{
      return true;
    }

  }

}


for(let g= 0; g<= (tags.length-1);g++){
  //filter
 this.tagAux = this.sampleTagArray.filter( (x) => { return x.tag.includes(tags[g]) });
//sort
this.sortedArray = this.tagAux.sort(function (a,b){
  

  if (a.tags[tags[g]] > b.tags[tags[g]]){
  return -1;

  }
  if(a.tags[tags[g]] < b.tags[tags[g]]){
    return 1;

  }
  if (a.tags[tags[g]] === b.tags[tags[g]]){
    return 0;
  
  }});

  let tagnumber2 = this.tagListTS.filter(tagsort)
  if(size <= (tagnumber2[0].number)){
    for(let h =0; h<= size-1; h++){
  this.finalSampleT.push(this.sortedArray[h]);
    }
  }
  else if(size > (tagnumber2[0].number)){
    for(let h =0; h<= ((tagnumber2[0].number)); h++){
  this.finalSampleT.push(this.sortedArray[h]);
    }
  }


}

this.finalSampleT = this.finalSampleT.filter(function( element ) {
  return element !== undefined;
})


this.finalSampleT = this.finalSampleT.filter(
  (thing, i, arr) => arr.findIndex(t => t.uri === thing.uri) === i
)



this.dataSource = new MatTableDataSource(this.finalSampleT);

let columns = []
columns.push('Uri');
for(let f= 0; f<= tags.length-1;f++){
  columns.push(tags[f]);
  }
  this.displayedColumns = columns;

if(this.dataSource !== null && this.dataSource !== undefined){
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}

  }

  else if(tags.length === 0 || tags === undefined|| tags === null  ){
    


    let size2 = size*(roles.length);

     //Pesquisa de tags escolhidas por utilizador e adicionar a array Interface
    for(let g = 0; g<= (this.evaluations.length-1); g++){
      this.auxlist2.push({uri:"",tags:[],roles:[]})
      this.sampleRoleArrayaux.push({role:[],roles:[],uri:""})

      this.auxlist2[g].uri = this.evaluations[g].Uri;
      this.auxlist2[g].roles = (JSON.parse(this.evaluations[g].Element_Count));
      
      
        for (let i = 0; i<= (roles.length -1); i++){
          if(this.auxlist2[g].roles[roles[i]] != undefined){
            this.sampleRoleArrayaux[g].role.push(roles[i]);
            this.sampleRoleArrayaux[g].uri = this.auxlist2[g].uri;
            this.sampleRoleArrayaux[g].roles = this.auxlist2[g].roles; 
          }

      }
  
  }
  

function hasUri(array:sampleR): boolean{
  return array.uri != ''
}


// filter 1
this.sampleRoleArray = this.sampleRoleArrayaux.filter(hasUri)
//filter depois sort e depois escolha

function rolesort(item) {

  for(let key = 0; key<= (roles.length -1); key++) {
    if (item.role === undefined || !item.role.includes(roles[key])){
      return false;
    }
    else{
      return true;
    }

  }

}


for(let g= 0; g<= (roles.length-1);g++){
  //filter
 this.roleAux = this.sampleRoleArray.filter( (x) => { return x.role.includes(roles[g]) });
//sort
this.sortedArray = this.roleAux.sort(function (a,b){
  

  if (a.roles[roles[g]] > b.roles[roles[g]]){
  return -1;

  }
  if(a.roles[roles[g]] < b.roles[roles[g]]){
    return 1;

  }
  if (a.roles[roles[g]] === b.roles[roles[g]]){
    return 0;
  
  }});

  let rolenumber2 = this.roleListTS.filter(rolesort)
  if(size <= (rolenumber2[0].number)){
    for(let h =0; h<= size-1; h++){
  this.finalSampleR.push(this.sortedArray[h]);
    }
  }
  else if(size > (rolenumber2[0].number)){
    for(let h =0; h<= ((rolenumber2[0].number)); h++){
  this.finalSampleR.push(this.sortedArray[h]);
    }
  }


}

this.finalSampleR = this.finalSampleR.filter(function( element ) {
  return element !== undefined;
})


this.finalSampleR = this.finalSampleR.filter(
  (thing, i, arr) => arr.findIndex(t => t.uri === thing.uri) === i
)


this.dataSource = new MatTableDataSource(this.finalSampleR);

let columns=[];
columns.push('Uri');
for(let f= 0; f<= roles.length-1;f++){
  columns.push(roles[f]);
  }
  this.displayedColumns = columns;


if(this.dataSource !== null && this.dataSource !== undefined){
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}

    }
 
   else if(roles.length != 0 && roles != undefined && roles != null && tags.length != 0 && tags != undefined && tags != null  ){
    //roles e tags

      let size2 = size*(tags.length);
       //Pesquisa de tags escolhidas por utilizador e adicionar a array Interface
      for(let g = 0; g<= (this.evaluations.length-1); g++){
        this.auxlist2.push({uri:"",tags:[],roles:[]})
        this.sampleTagArrayaux.push({tag:[],tags:[],uri:""})
  
        this.auxlist2[g].uri = this.evaluations[g].Uri;
        this.auxlist2[g].tags = (JSON.parse(this.evaluations[g].Tag_Count));
        
        
          for (let i = 0; i<= (tags.length -1); i++){
            if(this.auxlist2[g].tags[tags[i]] != undefined){
              this.sampleTagArrayaux[g].tag.push(tags[i]);
              this.sampleTagArrayaux[g].uri = this.auxlist2[g].uri;
              this.sampleTagArrayaux[g].tags = this.auxlist2[g].tags; 
            }
  
        }
    
    }
    
  
  function hasUri(array:sampleT): boolean{
    return array.uri != ''
  }
  
  
  // filter 1
  this.sampleTagArray = this.sampleTagArrayaux.filter(hasUri)
  //filter depois sort e depois escolha
  
  function tagsort(item) {
  
    for(let key = 0; key<= (tags.length -1); key++) {
      if (item.tag === undefined || !item.tag.includes(tags[key])){
        return false;
      }
      else{
        return true;
      }
  
    }
  
  }
  
  
  for(let g= 0; g<= (tags.length-1);g++){
    //filter
   this.tagAux = this.sampleTagArray.filter( (x) => { return x.tag.includes(tags[g]) });
  //sort
  this.sortedArray = this.tagAux.sort(function (a,b){
    
  
    if (a.tags[tags[g]] > b.tags[tags[g]]){
    return -1;
  
    }
    if(a.tags[tags[g]] < b.tags[tags[g]]){
      return 1;
  
    }
    if (a.tags[tags[g]] === b.tags[tags[g]]){
      return 0;
    
    }});
  
    let tagnumber2 = this.tagListTS.filter(tagsort)
    if(size <= (tagnumber2[0].number)){
      for(let h =0; h<= size-1; h++){
    this.finalSampleT.push(this.sortedArray[h]);
      }
    }
    else if(size > (tagnumber2[0].number)){
      for(let h =0; h<= ((tagnumber2[0].number)); h++){
    this.finalSampleT.push(this.sortedArray[h]);
      }
    }
  
  
  }
  
  this.finalSampleT = this.finalSampleT.filter(function( element ) {
    return element !== undefined;
  })
  
  
  this.finalSampleT = this.finalSampleT.filter(
    (thing, i, arr) => arr.findIndex(t => t.uri === thing.uri) === i
  )
  
 
  
 
  this.columns.push('Uri');
  for(let f= 0; f<= tags.length-1;f++){
    this.columns.push(tags[f]);
    }
    this.displayedColumns = this.columns;
  
   
  
    for(let g = 0; g<= (this.finalSampleT.length-1) ;g++){
      this.AuxFinalSampleRT =  this.auxlist2.filter((x) => { return x.uri.includes(this.finalSampleT[g].uri) })
 
      this.FinalSampleRT.push(this.AuxFinalSampleRT[0]);
}
   //roles
  
      size2 = size*(roles.length);
  
 
       //Pesquisa de tags escolhidas por utilizador e adicionar a array Interface
      for(let g = 0; g<= (this.evaluations.length-1); g++){
        this.auxlist2.push({uri:"",tags:[],roles:[]})
        this.sampleRoleArrayaux.push({role:[],roles:[],uri:""})
  
        this.auxlist2[g].uri = this.evaluations[g].Uri;
        this.auxlist2[g].roles = (JSON.parse(this.evaluations[g].Element_Count));
        
        
          for (let i = 0; i<= (roles.length -1); i++){
            if(this.auxlist2[g].roles[roles[i]] != undefined){
              this.sampleRoleArrayaux[g].role.push(roles[i]);
              this.sampleRoleArrayaux[g].uri = this.auxlist2[g].uri;
              this.sampleRoleArrayaux[g].roles = this.auxlist2[g].roles; 
            }
  
        }
    
    }
    
  
  function hasUri2(array:sampleR): boolean{
    return array.uri != ''
  }
  
  
  // filter 1
  this.sampleRoleArray = this.sampleRoleArrayaux.filter(hasUri2)
  //filter depois sort e depois escolha
  
  function rolesort(item) {
  
    for(let key = 0; key<= (roles.length -1); key++) {
      if (item.role === undefined || !item.role.includes(roles[key])){
        return false;
      }
      else{
        return true;
      }
  
    }
  
  }
  
  
  for(let g= 0; g<= (roles.length-1);g++){
    //filter
   this.roleAux = this.sampleRoleArray.filter( (x) => { return x.role.includes(roles[g]) });
  //sort
  this.sortedArray = this.roleAux.sort(function (a,b){
    
  
    if (a.roles[roles[g]] > b.roles[roles[g]]){
    return -1;
  
    }
    if(a.roles[roles[g]] < b.roles[roles[g]]){
      return 1;
  
    }
    if (a.roles[roles[g]] === b.roles[roles[g]]){
      return 0;
    
    }});
  
    let rolenumber2 = this.roleListTS.filter(rolesort)
    if(size <= (rolenumber2[0].number)){
      for(let h =0; h<= size-1; h++){
    this.finalSampleR.push(this.sortedArray[h]);
      }
    }
    else if(size > (rolenumber2[0].number)){
      for(let h =0; h<= ((rolenumber2[0].number)); h++){
    this.finalSampleR.push(this.sortedArray[h]);
      }
    }
  
  
  }
  
  this.finalSampleR = this.finalSampleR.filter(function( element ) {
    return element !== undefined;
  })
  
  
  this.finalSampleR = this.finalSampleR.filter(
    (thing, i, arr) => arr.findIndex(t => t.uri === thing.uri) === i
  )
  for(let f= 0; f<= roles.length-1;f++){
    this.columns.push(roles[f]);
    }
    this.displayedColumns = this.columns;
  
    for(let g = 0; g<= (this.finalSampleR.length-1) ;g++){
      this.AuxFinalSampleRT =  this.auxlist2.filter((x) => { return x.uri.includes(this.finalSampleR[g].uri) })
      this.FinalSampleRT.push(this.AuxFinalSampleRT[0]);
  }

  this.FinalSampleRT = this.FinalSampleRT.filter(function( element ) {
    return element !== undefined;
  })
  
  
  this.FinalSampleRT = this.FinalSampleRT.filter(
    (thing, i, arr) => arr.findIndex(t => t.uri === thing.uri) === i
  )


  this.dataSource = new MatTableDataSource(this.FinalSampleRT);


  if(this.dataSource !== null && this.dataSource !== undefined){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
 //ends here
   

   }



} 
addtoroleList(event, value: string){
  if(event.checked === true){
    let a1 = ":"
    let ia1 = value.indexOf(a1);
    let str = value.substring(0,ia1);
    this.choice_roles.push(str)

  }
  else if(event.checked === false){
      let a1 = ":"
      let ia1 = value.indexOf(a1);
      let str = value.substring(0,ia1);
      let g = this.choice_roles.indexOf(str);
      if(g > -1){
        this.choice_roles.splice(g, 1);
 
      }


  }



}

addtoTagList(event, value: string){
  if(event.checked === true){
    let a1="<" 
    let a2 = ">"
    let ia1 = value.indexOf(a1);
    let ia2 = value.indexOf(a2);
    let str = value.substring(ia1+1,ia2)
    this.choice_tags.push(str)

  }
  else if(event.checked === false){
    let a1="<" 
    let a2 = ">"
    let ia1 = value.indexOf(a1);
    let ia2 = value.indexOf(a2);

    let str = value.substring(ia1+1,ia2)
    let h = this.choice_tags.indexOf(str)
    if(h > -1){
      this.choice_tags.splice(h, 1);
    }
  }

}

}











