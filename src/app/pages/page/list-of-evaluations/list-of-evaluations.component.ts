import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { DeleteEvaluationDialogComponent } from '../../../dialogs/delete-evaluation-dialog/delete-evaluation-dialog.component';


@Component({
  selector: 'app-list-of-evaluations',
  templateUrl: './list-of-evaluations.component.html',
  styleUrls: ['./list-of-evaluations.component.css']
})
export class ListOfEvaluationsComponent implements OnInit {

  @Output('deleteEvaluation') deleteEvaluation = new EventEmitter<number>();
  @Input('evaluations') evaluations: Array<any>;

  displayedColumns = [
    //'evaluationId',
    'score',
    'A',
    'AA',
    'AAA',
    'evaluationDate',
    //'delete',
    'see'
  ];
  element: any;
  elements: string[];
  tags: string[];
  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(private dialog: MatDialog, private translate: TranslateService) { }





  ngOnInit(): void {
    //init related to element part of evaluations
    this.element = {
      elements: {},
      tags: {},
      ctags: "",
      croles: "",
    };



    this.dataSource = new MatTableDataSource(this.evaluations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    //init related to element part of evaluations
    this.element.elements = this.evaluations[0].elementCount.slice(1, -1);
    this.element.croles = this.evaluations[0].elementCount;
    this.element.tags = this.evaluations[0].tagCount.slice(1, -1);
    this.element.ctags = this.evaluations[0].tagCount;
    this.element.elements = this.element.elements.replace(/"/g, ' ')
    this.element.tags = this.element.tags.replace(/":/g, '>: ')
    this.element.tags = this.element.tags.replace(/"/g, '<')
    this.element.elements = this.element.elements.split(",");
    this.element.tags = this.element.tags.split(",");





    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
    paginatorIntl.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
    paginatorIntl.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
    paginatorIntl.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
    paginatorIntl.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
    paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

    this.dataSource.paginator._intl = paginatorIntl;

  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  openDeleteEvaluationDialog(evaluationId: number): void {
    const deleteDialog = this.dialog.open(DeleteEvaluationDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });

    deleteDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.deleteEvaluation.next(evaluationId);
        }
      });
  }
  sortedAlphabeticlyAsc() {

    let sortArray: string[];
    let aux: string;
    let aux2: string;
    aux = this.element.ctags.slice(1, -1);
    aux = aux.replace(/":/g, '>:');
    aux = aux.replace(/"/g, '<');
    sortArray = aux.split(",");



    sortArray.sort(function (a, b) {
      if (a > b) {
        return 1;

      }
      if (a < b) {
        return -1;

      }
      if (a === b) {
        return 0;

      }

    })



    this.element.tags = sortArray;

  }
  sortedAlphabeticlyAsc2() {

    let sortArray: string[];
    let aux: string;
    let aux2: string;
    aux = this.element.croles.slice(1, -1);
    aux = aux.replace(/"/g, ' ');
    sortArray = aux.split(",");



    sortArray.sort(function (a, b) {
      if (a > b) {
        return 1;

      }
      if (a < b) {
        return -1;

      }
      if (a === b) {
        return 0;

      }

    })
    this.element.elements = sortArray;
  }
  sortedbyNumberAsc() {

    let sortArray: string[];
    let aux: string;
    aux = this.element.ctags.slice(1, -1);
    aux = aux.replace(/":/g, '>: ');
    aux = aux.replace(/"/g, '<');
    sortArray = aux.split(",");

    sortArray.sort(function (a, b) {
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return -1;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))) {
        return 0;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return 1;
      }

    })



    this.element.tags = sortArray;

  }







  sortedbyNumberAsc2() {

    let sortArray: string[];
    let aux: string;
    aux = this.element.croles.slice(1, -1);
    aux = aux.replace(/"/g, ' ');
    sortArray = aux.split(",");

    sortArray.sort(function (a, b) {
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return -1;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))) {
        return 0;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return 1;
      }

    })



    this.element.elements = sortArray;
  }
  sortedAlphabeticlyDsc() {

    let sortArray: string[];
    let aux: string;
    let aux2: string;
    aux = this.element.ctags.slice(1, -1);
    aux = aux.replace(/":/g, '>: ');
    aux = aux.replace(/"/g, '<');
    sortArray = aux.split(",");



    sortArray.sort(function (a, b) {
      if (a > b) {
        return -1;

      }
      if (a < b) {
        return 1;

      }
      if (a === b) {
        return 0;

      }

    })



    this.element.tags = sortArray;

  }
  sortedAlphabeticlyDsc2() {

    let sortArray: string[];
    let aux: string;
    let aux2: string;
    aux = this.element.croles.slice(1, -1);
    aux = aux.replace(/"/g, ' ');
    sortArray = aux.split(",");



    sortArray.sort(function (a, b) {
      if (a > b) {
        return -1;

      }
      if (a < b) {
        return 1;

      }
      if (a === b) {
        return 0;

      }

    })

    this.element.elements = sortArray;
  }
  sortedbyNumberDsc() {

    let sortArray: string[];
    let aux: string;
    aux = this.element.ctags.slice(1, -1);
    aux = aux.replace(/":/g, '>: ');
    aux = aux.replace(/"/g, '<');
    sortArray = aux.split(",");

    sortArray.sort(function (a, b) {
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return 1;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))) {
        return 0;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return -1;
      }

    })



    this.element.tags = sortArray;
  }
  sortedbyNumberDsc2() {

    let sortArray: string[];
    let aux: string;
    aux = this.element.croles.slice(1, -1);
    aux = aux.replace(/"/g, ' ');
    sortArray = aux.split(",");

    sortArray.sort(function (a, b) {
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) <= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return 1;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) === parseInt(b.substring(b.indexOf(":")).slice(1))) {
        return 0;
      }
      if (parseInt(a.substring(a.indexOf(':')).slice(1)) >= parseInt(b.substring(b.indexOf(":")).slice(1))) {

        return -1;
      }

    })



    this.element.elements = sortArray;
  }

}
