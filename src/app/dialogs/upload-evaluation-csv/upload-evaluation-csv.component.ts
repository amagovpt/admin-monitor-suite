import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { CreateService } from "../../services/create.service";

import { SuccessfulUploadEvaluationDialogComponent } from "../successful-upload-evaluation-dialog/successful-upload-evaluation-dialog.component";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-upload-evaluation-csv',
  templateUrl: './upload-evaluation-csv.component.html',
  styleUrls: ['./upload-evaluation-csv.component.css']
})
export class UploadEvaluationCSVComponent implements OnInit {

matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingPages: boolean;
  loadingUploadFile: boolean;
  loadingUpload: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<string[]>;
  filteredPages: Observable<string[]>;

  websites: any;
  pages: any;

  pageForm: FormGroup;

  dataFromFile: string[];
  fileErrorMessage: string;

  fileLoading: boolean;

  @ViewChild("tagInput") tagInput: ElementRef;

  constructor(
    private get: GetService,
    private create: CreateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<UploadEvaluationCSVComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.pageForm = this.formBuilder.group(
      {
        website: new FormControl("", [
          Validators.required,
          this.websiteValidator.bind(this),
        ]),
        uri: new FormControl("", [
          Validators.required,
          this.pageValidator.bind(this),
        ]),
        files: new FormControl([
          Validators.required
        ]),
      }
    );
    this.loadingWebsites = true;
    this.loadingPages = true;
    this.loadingUploadFile = true;
    this.loadingUpload = false;
    this.fileLoading = false;
    this.dataFromFile = [];
  }

  ngOnInit(): void {
    this.get.listOfOfficialWebsites().subscribe((websites) => {
      if (websites !== null) {
        this.websites = websites;
        this.filteredWebsites =
          this.pageForm.controls.website.valueChanges.pipe(
            map((val) => this.filterWebsite(val))
          );
      }

      this.loadingWebsites = false;
    });
    this.fileErrorMessage = "";
  }

  resetForm(): void {
    this.fileErrorMessage = "";
    this.dataFromFile = [];
    this.loadingPages = true;
    this.loadingUploadFile = true;
    this.pageForm.reset();
  }

  resetFile(): void {
    this.fileErrorMessage = "";
    this.dataFromFile = [];
    this.pageForm.controls.files.reset();
  }

  loadPages(): void {
    const websiteId = _.find(this.websites, [
      "StartingUrl",
      this.pageForm.value.website,
    ]).WebsiteId;

    this.get.listOfWebsitePages(websiteId).subscribe((pages) => {
      if (pages !== null) {
        this.pages = pages;
        this.filteredPages =
          this.pageForm.controls.uri.valueChanges.pipe(
            map((val) => this.filterPage(val))
          );
      }

      this.loadingPages = false;
    });
  }

  selectPage(): void {
    this.loadingUploadFile = false;
  }

  uploadEvaluation(e): void {
    e.preventDefault();

    const pageId = _.find(this.pages, [
      "Uri",
      this.pageForm.value.uri,
    ]).PageId;

    const len = this.dataFromFile.length;
    const data = this.dataFromFile.slice(1, len);

    this.openUploadEvaluationInformationDialog(pageId, data);
  }

  private openUploadEvaluationInformationDialog(pageId: number, data: string[]): void {
    this.create
      .newEvaluation({ pageId, data })
      .subscribe((result) => {
        if (result) {
          this.dialog.open(SuccessfulUploadEvaluationDialogComponent, {
            width: "40vw",
          });
          this.dialogRef.close();
        } else {
          alert("Error");
        }
      });
  }

  filterWebsite(val: any): string[] {
    return this.websites.filter((website) =>
      _.includes(_.toLower(website.StartingUrl), _.toLower(val))
    );
  }

  filterPage(val: any): string[] {
    return this.pages.filter((page) =>
      _.includes(_.toLower(page.Uri), _.toLower(val))
    );
  }

  websiteValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== "" && val !== null) {
      return _.includes(_.map(this.websites, "StartingUrl"), val)
        ? null
        : { validWebsite: true };
    } else {
      return null;
    }
  }

  pageValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== "" && val !== null) {
      return _.includes(_.map(this.pages, "Uri"), val)
        ? null
        : { validPage: true };
    } else {
      return null;
    }
  }

  handleFileInput(files: FileList) {
    this.fileLoading = true;
    this.fileErrorMessage = "";
    this.dataFromFile = [];
    const fileToRead = files.item(0);
    if (fileToRead === null) {
      this.pageForm.controls.files.reset();
      this.fileLoading = false;
      return;
    }

    switch (fileToRead.type) {
      case "text/csv":
        this.parseCSV(fileToRead);
        break;
      default:
        this.fileErrorMessage = "invalidType";
        break;
    }
  }

  parseCSV(file: File): string[] {
    const result = [];
    // open file and check for the urls
    const reader = new FileReader();
    reader.readAsText(file);
    // divide the url in the result array
    reader.onload = () => {
      const csvfile = reader.result.toString();
      const lines = _.without(
        _.map(csvfile.split("\n"), (l) => _.trim(l)),
        ""
      );

      this.dataFromFile = _.clone(lines);
      this.validateEvaluationFile(this.pageForm.value.uri, this.dataFromFile);
      this.fileLoading = false;
    };
    return result;
  }

  private validateEvaluationFile(uri: string, data: string[]): void {
    if (uri === "") {
      this.fileErrorMessage = "invalidUri";
      return;
    } 
    
    if (data === null || data.length < 4) {
      this.fileErrorMessage = "invalidFile";
      return;
    }

    if (!this.validateEvaluationFileHeaders(data[0].split(";"))) {
      this.fileErrorMessage = "invalidFile";
      return;
    }

    if (!this.validateEvaluationFileUris(uri, _.map(data.slice(1, data.length - 2), (l) => _.trim(l.split(";")[0])))) {
      this.fileErrorMessage = "invalidUri";
      return;
    }

    if (!this.validateEvaluationFileFooters(data[data.length - 2].split(";"))) {
      this.fileErrorMessage = "invalidFile";
      return;
    }
  }

  private validateEvaluationFileHeaders(headers: string[]): boolean {
    if (headers === null || headers.length !== 10) {
      return false;
    }

    headers.map((val, idx) => {
      const header = val.trim();
      switch (idx) {
        case 0:
          if (header !== "URI") {
            return false;
          }
          break;
        case 1:
          if (header !== "Data") {
            return false;
          }
          break;
        case 2:
          if (header !== "ID") {
            return false;
          }
          break;
        case 3:
          if (header !== "Tipo de erro") {
            return false;
          }
          break;
        case 4:
          if (header !== "Nivel de Conformidade") {
            return false;
          }
          break;
        case 5:
          if (header !== "Critério") {
            return false;
          }
          break;
        case 6:
          if (header !== "Descrição") {
            return false;
          }
          break;
        case 7:
          if (header !== "Número de ocorrências") {
            return false;
          }
          break;
        case 8:
          if (header !== "Valor") {
            return false;
          }
          break;
        case 9:
          if (header !== "Pontuação") {
            return false;
          }
          break;
        default:
          return false;
        }
    });

    return true;
  }

  private validateEvaluationFileUris(uri: string, uris: string[]): boolean {
    uris.map(val => {
      if (val !== uri) {
        return false;
      }
    });

    return true;
  }

  private validateEvaluationFileFooters(footers: string[]): boolean {
    if (footers === null || footers.length !== 7) {
      return false;
    }

    footers.map((val, idx) => {
      const footer = val.trim();
      switch (idx) {
        case 0:
          if (footer !== "Total page evaluations") {
            return false;
          }
          break;
        case 1:
          if (footer !== "Pagecode") {
            return false;
          }
          break;
        case 2:
          if (footer !== "Tot") {
            return false;
          }
          break;
        case 3:
          if (footer !== "Nodes") {
            return false;
          }
          break;
        case 4:
          if (footer !== "Errors") {
            return false;
          }
          break;
        case 5:
          if (footer !== "Tags") {
            return false;
          }
          break;
        case 6:
          if (footer !== "Roles") {
            return false;
          }
          break;
        default:
          return false;
        }
    });

    return true;
  }
}
