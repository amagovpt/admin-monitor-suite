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
import { map } from "rxjs/operators";
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
  selector: "app-edit-tag-dialog",
  templateUrl: "./edit-tag-dialog.component.html",
  styleUrls: ["./edit-tag-dialog.component.css"],
})
export class EditTagDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingDirectories: boolean;
  loadingWebsites: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredDirectories: Observable<any[]>;
  filteredWebsites: Observable<any[]>;

  directories: any;
  selectedDirectories: any;

  websites: any;
  selectedWebsites: any;

  tagForm: FormGroup;

  copyTagForm: FormGroup;

  defaultTag: any;

  @ViewChild("directoryInput") directoryInput: ElementRef;
  @ViewChild("websiteInput") websiteInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTagDialogComponent>,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.defaultTag = {};
    this.websites = [];

    this.matcher = new MyErrorStateMatcher();

    this.tagForm = new FormGroup({
      name: new FormControl("", Validators.required),
      directories: new FormControl(),
      websites: new FormControl(),
    });

    this.copyTagForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });

    this.loadingInfo = true;
    this.loadingDirectories = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;

    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    this.get.tagInfo(this.data.id).subscribe((tag) => {
      if (tag !== null) {
        this.defaultTag = _.cloneDeep(tag);

        this.tagForm.controls.name.setValue(tag.Name);
        this.selectedDirectories = tag.directories;
        this.selectedWebsites = tag.websites;

        this.copyTagForm.controls.name.setValue(tag.Name);

        this.tagForm.controls.name.setAsyncValidators(
          this.nameValidator.bind(this)
        );
        this.copyTagForm.controls.name.setAsyncValidators(
          this.nameValidator.bind(this)
        );
      }

      this.loadingUpdate = false;
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
  }

  setDefault(): void {
    this.tagForm.controls.name.setValue(this.defaultTag.Name);
    this.selectedDirectories = _.clone(this.defaultTag.directories);
    this.selectedWebsites = _.clone(this.defaultTag.websites);
  }

  deleteTag(): void {
    this.deleteService.tag({ tagId: this.data.id }).subscribe((success) => {
      if (success !== null) {
        this.message.show("TAGS_PAGE.DELETE.messages.success");
        this.dialogRef.close(true);
      }
    });
  }

  updateTag(e): void {
    e.preventDefault();

    const name = this.tagForm.value.name.trim();

    const defaultDirectories = JSON.stringify(
      _.map(this.defaultTag.directories, "DirectoryId")
    );
    const directories = JSON.stringify(
      _.map(this.selectedDirectories, "DirectoryId")
    );

    const defaultWebsites = JSON.stringify(
      _.map(this.defaultTag.websites, "WebsiteId")
    );
    const websites = JSON.stringify(_.map(this.selectedWebsites, "WebsiteId"));

    const formData = {
      tagId: this.data.id,
      name,
      defaultDirectories,
      directories,
      defaultWebsites,
      websites,
    };

    this.loadingUpdate = true;

    this.update.tag(formData).subscribe((success) => {
      if (success !== null) {
        this.message.show("TAGS_PAGE.UPDATE.messages.success");
        this.dialogRef.close(true);
      }
      this.loadingUpdate = false;
    });
  }

  removeDirectory(directory: any): void {
    const index = _.findIndex(this.selectedDirectories, directory);

    if (index >= 0) {
      this.selectedDirectories.splice(index, 1);
    }
  }

  filterDirectory(name: string) {
    return this.directories.filter((directory) =>{
      let valid = true;
      const names = name.trim().toLowerCase().split(' ');

      for (const n of names ?? [name]) {
        if (!directory.Name.toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedDirectory(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.directories,
      (d) => d["Name"].trim() === event.option.viewValue.trim()
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
        if (!(website.Name + ' ' + website.Url).toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedWebsite(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.websites,
      (w) => w["Url"] === event.option.viewValue
    );
    const index2 = _.findIndex(
      this.selectedWebsites,
      (w) => w["Url"] === event.option.viewValue
    );
    if (index2 < 0) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = "";
      this.tagForm.controls.websites.setValue(null);
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = control.value.trim();

    if (
      name !== "" &&
      name !== this.defaultTag.Name &&
      name.toLowerCase() !== this.defaultTag.Name.toLowerCase()
    ) {
      return this.verify.tagNameExists(name);
    } else {
      return of(null);
    }
  }
}
