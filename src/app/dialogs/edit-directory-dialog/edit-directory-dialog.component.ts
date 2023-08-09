import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as _ from "lodash";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { DeleteService } from "../../services/delete.service";
import { GetService } from "../../services/get.service";
import { MessageService } from "../../services/message.service";
import { UpdateService } from "../../services/update.service";
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
  selector: "app-edit-directory-dialog",
  templateUrl: "./edit-directory-dialog.component.html",
  styleUrls: ["./edit-directory-dialog.component.css"],
})
export class EditDirectoryDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingTags: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredTags: Observable<any[]>;

  tags: any;
  selectedTags: any;

  directoryForm: FormGroup;

  copyDirectoryForm: FormGroup;

  defaultDirectory: any;

  @ViewChild("tagInput") tagInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDirectoryDialogComponent>,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.defaultDirectory = {};
    this.tags = [];

    this.matcher = new MyErrorStateMatcher();

    this.directoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
      observatory: new FormControl(),
      method: new FormControl(),
      tags: new FormControl(),
    });

    this.copyDirectoryForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });

    this.loadingInfo = true;
    this.loadingTags = true;
    this.loadingUpdate = false;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.get.directoryInfo(this.data.id).subscribe((directory) => {
      if (directory !== null) {
        this.defaultDirectory = _.cloneDeep(directory);

        this.directoryForm.controls.name.setValue(directory.name);
        this.directoryForm.controls.observatory.setValue(
          directory.showInObservatory
        );
        this.directoryForm.controls.method.setValue(
          directory.method.toString()
        );
        this.selectedTags = directory.tags;

        this.copyDirectoryForm.controls.name.setValue(directory.name);

        this.directoryForm.controls.name.setAsyncValidators(
          this.nameValidator.bind(this)
        );
        this.copyDirectoryForm.controls.name.setAsyncValidators(
          this.nameValidator.bind(this)
        );
      }

      this.loadingUpdate = false;
    });

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

  deleteDirectory(): void {
    this.deleteService
      .directory({ directoryId: this.data.id })
      .subscribe((success) => {
        if (success !== null) {
          this.message.show("DIRECTORIES_PAGE.DELETE.messages.success");
          this.dialogRef.close(true);
        }
      });
  }

  updateDirectory(e): void {
    e.preventDefault();

    const name = this.directoryForm.value.name.trim();
    const observatory = this.directoryForm.value.observatory ? 1 : 0;
    const method = parseInt(this.directoryForm.value.method);
    const defaultTags = _.map(this.defaultDirectory.tags, "tagId");
    const tags = _.map(this.selectedTags, "tagId");

    const formData = {
      directoryId: this.data.id,
      name,
      observatory,
      method,
      defaultTags,
      tags,
    };

    this.loadingUpdate = true;

    this.update.directory(formData).subscribe((success) => {
      if (success !== null) {
        this.message.show("DIRECTORIES_PAGE.UPDATE.messages.success");
        this.dialogRef.close(true);
      }
      this.loadingUpdate = false;
    });
  }

  setDefault(): void {
    this.directoryForm.controls.name.setValue(this.defaultDirectory.name);
    this.directoryForm.controls.observatory.setValue(
      this.defaultDirectory.showInObservatory
    );
    this.directoryForm.controls.method.setValue(
      this.defaultDirectory.method.toString()
    );
    this.selectedTags = _.clone(this.defaultDirectory.tags);
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  filterTag(name: string) {
    return this.tags.filter((tag) => {
      let valid = true;
      const names = name.trim().toLowerCase().split(' ');

      for (const n of names ?? [name]) {
        if (!tag.name.toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.tags,
      (t) => t["name"].trim() === event.option.viewValue.trim()
    );
    const index2 = _.findIndex(
      this.selectedTags,
      (t) => t["name"].trim() === event.option.viewValue.trim()
    );
    if (index2 < 0) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = "";
      this.directoryForm.controls.tags.setValue(null);
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = control.value.trim();

    if (
      name !== "" &&
      name !== this.defaultDirectory.name &&
      name.toLowerCase() !== this.defaultDirectory.name.toLowerCase()
    ) {
      return this.verify.directoryNameExists(name);
    } else {
      return of(null);
    }
  }
}
