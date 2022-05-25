import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { CreateService } from "../../services/create.service";

import { ChooseObservatoryPagesDialogComponent } from "../choose-observatory-pages-dialog/choose-observatory-pages-dialog.component";

import { BackgroundEvaluationsInformationDialogComponent } from "../background-evaluations-information-dialog/background-evaluations-information-dialog.component";

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

export class UriValidation {
  static validUris(AC: AbstractControl) {
    const website = AC.get("website").value;
    let uris = AC.get("uris").value;
    if (_.trim(website) === "") {
      return null;
    }

    if (_.trim(uris) !== "") {
      uris = _.without(_.uniq(_.split(uris, "\n")), "");
      const size = _.size(uris);
      let hasError = false;
      for (let i = 0; i < size; i++) {
        if (!_.startsWith(uris[i], website)) {
          AC.get("uris").setErrors({ invalidUri: true });
          hasError = true;
        }
      }
      if (!hasError) {
        return null;
      }
    } else {
      return null;
    }
  }
}

export const atLeastOne =
  (validator: ValidatorFn, controls: string[]) =>
  (group: FormGroup): ValidationErrors | null => {
    const hasAtLeastOne =
      group &&
      group.controls &&
      controls.some((k) => !validator(group.controls[k]));
    return hasAtLeastOne ? null : { requiredAtLeastOne: true };
  };

@Component({
  selector: "app-add-page-dialog",
  templateUrl: "./add-page-dialog.component.html",
  styleUrls: ["./add-page-dialog.component.css"],
})
export class AddPageDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<string[]>;

  websites: any;

  pageForm: FormGroup;

  urisFromFile: string[];
  urisFromFileString: string;
  fileErrorMessage: string;

  fileLoading: boolean;

  @ViewChild("tagInput") tagInput: ElementRef;

  constructor(
    private get: GetService,
    private create: CreateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPageDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.pageForm = this.formBuilder.group(
      {
        website: new FormControl("", [
          Validators.required,
          this.websiteValidator.bind(this),
        ]),
        uris: new FormControl(),
        files: new FormControl(),
        observatorio: new FormControl(),
      },
      {
        validators: Validators.compose([
          UriValidation.validUris,
          atLeastOne(Validators.required, ["uris", "files"]),
        ]),
      }
    );
    this.loadingWebsites = true;
    this.loadingCreate = false;
    this.fileLoading = false;
    this.urisFromFile = [];
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
    this.urisFromFileString = "";
    this.fileErrorMessage = "";
  }

  resetForm(): void {
    this.fileErrorMessage = "";
    this.urisFromFile = [];
    this.pageForm.reset();
  }

  resetFile(): void {
    this.fileErrorMessage = "";
    this.urisFromFile = [];
    this.pageForm.controls.files.reset();
  }

  createPage(e): void {
    e.preventDefault();

    const websiteId = _.find(this.websites, [
      "StartingUrl",
      this.pageForm.value.website,
    ]).WebsiteId;

    this.pageForm.value.uris =
      this.pageForm.value.uris === null ? "" : this.pageForm.value.uris;
    const urisWithFileUris = [
      ...this.urisFromFile,
      ..._.split(this.pageForm.value.uris, "\n"),
    ];
    // this.urisFromFile.join('\n') + this.pageForm.value.uris;

    const uris = JSON.stringify(
      _.without(
        _.uniq(
          _.map(urisWithFileUris, (p) => {
           /* if (p[_.size(p) - 1] === "/") {
              p = p.substring(0, _.size(p) - 1);
            }*/

            return _.trim(p);
          })
        ),
        ""
      )
    );

    if (this.pageForm.value.observatorio) {
      const chooseDialog = this.dialog.open(
        ChooseObservatoryPagesDialogComponent,
        {
          width: "40vw",
          data: {
            uris: JSON.parse(uris),
          },
        }
      );

      chooseDialog.afterClosed().subscribe((result) => {
        if (!result.cancel) {
          this.openAddPagesInformationDialog(websiteId, uris, result.uris);
        }
      });
    } else {
      this.openAddPagesInformationDialog(websiteId, uris, JSON.stringify([]));
    }
  }

  private openAddPagesInformationDialog(
    websiteId: number,
    uris: string,
    observatory: string
  ): void {
    this.create
      .newPages({ websiteId, uris, observatory })
      .subscribe((result) => {
        if (result) {
          this.dialog.open(BackgroundEvaluationsInformationDialogComponent, {
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

  handleFileInput(files: FileList) {
    this.fileLoading = true;
    const fileToRead = files.item(0);
    this.urisFromFile = [];
    if (fileToRead === null) {
      this.fileErrorMessage = "";
      this.urisFromFile = [];
      this.pageForm.controls.files.reset();
      return;
    }

    switch (fileToRead.type) {
      case "text/plain":
        //this.urisFromFile = this.parseTXT(fileToRead);
        this.parseTXT(fileToRead);
        break;
      case "text/xml":
        //this.urisFromFile = this.parseXML(fileToRead);
        this.parseXML(fileToRead);
        break;
      default:
        this.urisFromFile = [];
        this.fileErrorMessage = "invalidType";
        break;
    }
  }

  parseTXT(file: File): string[] {
    const result = [];
    // open file and check for the urls
    const reader = new FileReader();
    reader.readAsText(file);
    // divide the url in the result array
    reader.onload = () => {
      const urlFile = reader.result.toString();
      const lines = _.without(
        _.map(urlFile.split("\n"), (l) => _.trim(l)),
        ""
      );

      this.urisFromFile = _.clone(lines);
      this.validateFileUris(this.pageForm.value.website, this.urisFromFile);
      this.fileLoading = false;
    };
    return result;
  }

  parseXML(file: File): string[] {
    const reader = new FileReader();
    const result = [];
    reader.readAsText(file);
    reader.onload = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(reader.result.toString(), "text/xml");

      const urls = doc.getElementsByTagName("loc");

      this.urisFromFile = new Array<string>();
      for (let i = 0; i < urls.length; i++) {
        const url = urls.item(i);
        this.urisFromFile.push(url.textContent.trim());
      }

      this.validateFileUris(this.pageForm.value.website, this.urisFromFile);
      this.fileLoading = false;
    };
    return result;
  }

  validateFileUris(website: string, uris: string[]): void {
    if (website === "") {
      this.fileErrorMessage = "invalidWebsite";
      return;
    }
    if (uris !== undefined || uris !== []) {
      for (let url of uris) {
        if (!_.startsWith(url, website)) {
          this.fileErrorMessage = "invalidWebsite";
          return;
        } else {
          this.fileErrorMessage = "";
        }
      }
    }
  }

  updateUrisFromFile() {
    if (this.urisFromFile !== undefined) {
      this.validateFileUris(this.pageForm.value.website, this.urisFromFile);
    }
  }
}
