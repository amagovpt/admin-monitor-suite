import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from "lodash";

import { CreateService } from "../../services/create.service";
import { GetService } from "../../services/get.service";
import { VerifyService } from "../../services/verify.service";
import { MessageService } from "../../services/message.service";

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
  selector: "app-add-directory-dialog",
  templateUrl: "./add-directory-dialog.component.html",
  styleUrls: ["./add-directory-dialog.component.css"],
})
export class AddDirectoryDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingTags: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredTags: Observable<any[]>;

  @ViewChild("tagInput") tagInput: ElementRef;

  directoryForm: FormGroup;
  tags: any;
  selectedTags: any;

  constructor(
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddDirectoryDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.directoryForm = new FormGroup({
      name: new FormControl(
        "",
        [Validators.required],
        this.nameValidator.bind(this)
      ),
      observatory: new FormControl(),
      tags: new FormControl(),
    });

    this.selectedTags = [];

    this.loadingTags = true;
    this.loadingCreate = false;
  }

  ngOnInit(): void {
    this.get.listOfOfficialTags().subscribe((tags) => {
      if (tags !== null) {
        this.tags = tags;
        this.filteredTags = this.directoryForm.controls.tags.valueChanges.pipe(
          map((tag: any | null) =>
            tag ? this.filterTag(tag) : this.tags.slice()
          )
        );
      }
      this.loadingTags = false;
    });
  }

  resetForm(): void {
    this.directoryForm.reset();
    this.selectedTags = [];
  }

  createDirectory(e): void {
    e.preventDefault();

    const name = this.directoryForm.value.name;
    const observatory = this.directoryForm.value.observatory ? 1 : 0;
    const tags = JSON.stringify(_.map(this.selectedTags, "TagId"));

    const formData = {
      name,
      observatory,
      tags,
    };

    this.loadingCreate = true;

    this.create.newDirectory(formData).subscribe((success) => {
      if (success !== null) {
        if (success) {
          this.message.show("DIRECTORIES_PAGE.ADD.messages.success");

          if (this.location.path() !== "/console/directories") {
            this.router.navigateByUrl("/console/directories");
          } else {
            window.location.reload();
          }

          this.dialogRef.close();
        }
      }
      this.loadingCreate = false;
    });
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  filterTag(name: string) {
    return this.tags.filter((tag) =>
      _.includes(tag.Name.toLowerCase(), name.toLowerCase())
    );
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.tags,
      (t) => t["Name"] === event.option.viewValue
    );
    if (!_.includes(this.selectedTags, this.tags[index])) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = "";
      this.directoryForm.controls.tags.setValue(null);
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== "") {
      return this.verify.directoryNameExists(name);
    } else {
      return of(null);
    }
  }
}
