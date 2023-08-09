import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Location } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { CreateService } from "../../services/create.service";
import { GetService } from "../../services/get.service";
import { MessageService } from "../../services/message.service";
import { VerifyService } from "../../services/verify.service";

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
  selector: "app-add-tag-dialog",
  templateUrl: "./add-tag-dialog.component.html",
  styleUrls: ["./add-tag-dialog.component.css"],
})
export class AddTagDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingDirectories: boolean;
  loadingWebsites: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredDirectories: Observable<any[]>;
  filteredWebsites: Observable<any[]>;

  @ViewChild("directoryInput") directoryInput: ElementRef;
  @ViewChild("websiteInput") websiteInput: ElementRef;

  tagForm: FormGroup;
  directories: any;
  selectedDirectories: any;
  websites: any;
  selectedWebsites: any;

  constructor(
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddTagDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.tagForm = new FormGroup({
      name: new FormControl(
        "",
        [Validators.required],
        this.nameValidator.bind(this)
      ),
      directories: new FormControl(),
      websites: new FormControl(),
    });

    this.selectedDirectories = [];
    this.selectedWebsites = [];

    this.loadingDirectories = true;
    this.loadingWebsites = true;
    this.loadingCreate = false;
  }

  ngOnInit() {
    this.get.listOfOfficialWebsites().subscribe((websites) => {
      if (websites !== null) {
        this.websites = websites;
        this.filteredWebsites =
          this.tagForm.controls.websites.valueChanges.pipe(
            map((website: any | null) =>
              website ? this.filterWebsite(website) : this.websites.slice()
            )
          );
      }
      this.loadingWebsites = false;
    });

    this.get.listOfDirectories().subscribe((directories) => {
      if (directories !== null) {
        this.directories = directories;
        this.filteredDirectories =
          this.tagForm.controls.directories.valueChanges.pipe(
            map((directory: any | null) =>
              directory
                ? this.filterDirectory(directory)
                : this.directories.slice()
            )
          );
      }
      this.loadingDirectories = false;
    });
  }

  resetForm(): void {
    this.tagForm.reset();
    this.selectedDirectories = [];
    this.selectedWebsites = [];
  }

  createTag(e): void {
    e.preventDefault();

    const name = this.tagForm.value.name.trim();
    const directories =
      _.map(this.selectedDirectories, "directoryId");
    const websites = _.map(this.selectedWebsites, "websiteId");

    const formData = {
      name,
      directories,
      websites,
    };

    this.loadingCreate = true;

    this.create.newTag(formData).subscribe((success) => {
      if (success !== null) {
        if (success) {
          this.message.show("TAGS_PAGE.ADD.messages.success");

          if (this.location.path() !== "/console/tags") {
            this.router.navigateByUrl("/console/tags");
          } else {
            window.location.reload();
          }

          this.dialogRef.close();
        }
      }
      this.loadingCreate = false;
    });
  }

  removeDirectory(directory: any): void {
    const index = _.findIndex(this.selectedDirectories, directory);

    if (index >= 0) {
      this.selectedDirectories.splice(index, 1);
    }
  }

  filterDirectory(name: string) {
    return this.directories.filter((directory) => {
      let valid = true;
      const names = name.trim().toLowerCase().split(' ');

      for (const n of names ?? [name]) {
        if (!directory.name.toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedDirectory(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.directories,
      (d) => d["name"].trim() === event.option.viewValue.trim()
    );
    if (!_.includes(this.selectedDirectories, this.directories[index])) {
      this.selectedDirectories.push(this.directories[index]);
      this.directoryInput.nativeElement.value = "";
      this.tagForm.controls.directories.setValue(null);
    }
  }

  removeWebsite(website: any): void {
    const index = _.findIndex(this.selectedWebsites, website);

    if (index >= 0) {
      this.selectedWebsites.splice(index, 1);
    }
  }

  filterWebsite(val: string) {
    return this.websites.filter((website) => {
      let valid = true;
      const names = val.trim().toLowerCase().split(' ');

      for (const n of names ?? [val]) {
        if (!(website.name + ' ' + website.startingUrl).toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedWebsite(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.websites,
      (w) => w["startingUrl"] === event.option.viewValue
    );
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = "";
      this.tagForm.controls.websites.setValue(null);
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== "") {
      return this.verify.tagNameExists(name);
    } else {
      return of(null);
    }
  }
}
