import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { VerifyService } from "../../services/verify.service";
import { UpdateService } from "../../services/update.service";
import { DeleteService } from "../../services/delete.service";
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

        this.directoryForm.controls.name.setValue(directory.Name);
        this.directoryForm.controls.observatory.setValue(
          directory.Show_in_Observatory
        );
        this.directoryForm.controls.method.setValue(directory.Method.toString());
        this.selectedTags = directory.tags;

        this.copyDirectoryForm.controls.name.setValue(directory.Name);

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

    const name = this.directoryForm.value.name;
    const observatory = this.directoryForm.value.observatory ? 1 : 0;
    const method = parseInt(this.directoryForm.value.method);
    const defaultTags = JSON.stringify(
      _.map(this.defaultDirectory.tags, "TagId")
    );
    const tags = JSON.stringify(_.map(this.selectedTags, "TagId"));

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
    this.directoryForm.controls.name.setValue(this.defaultDirectory.Name);
    this.directoryForm.controls.observatory.setValue(
      this.defaultDirectory.Show_in_Observatory
    );
    this.directoryForm.controls.method.setValue(this.defaultDirectory.Method.toString());
    this.selectedTags = _.clone(this.defaultDirectory.tags);
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
    const index2 = _.findIndex(
      this.selectedTags,
      (t) => t["Name"] === event.option.viewValue
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
      name !== this.defaultDirectory.Name &&
      name.toLowerCase() !== this.defaultDirectory.Name.toLowerCase()
    ) {
      return this.verify.directoryNameExists(name);
    } else {
      return of(null);
    }
  }
}
