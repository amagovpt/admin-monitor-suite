import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { map } from "rxjs/operators";
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
  selector: "app-add-website-dialog",
  templateUrl: "./add-website-dialog.component.html",
  styleUrls: ["./add-website-dialog.component.css"],
})
export class AddWebsiteDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingEntities: boolean;
  loadingUsers: boolean;
  loadingTags: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredEntities: Observable<string[]>;
  filteredUsers: Observable<string[]>;
  filteredTags: Observable<any[]>;

  entities: any;
  selectedEntities: any;
  monitorUsers: any;
  tags: any;
  selectedTags: any;

  websiteForm: FormGroup;

  @ViewChild("tagInput") tagInput: ElementRef;
  @ViewChild("entityInput") entityInput: ElementRef;

  constructor(
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddWebsiteDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.websiteForm = new FormGroup({
      name: new FormControl(
        "",
        [Validators.required],
        this.nameValidator.bind(this)
      ),
      startingUrl: new FormControl(
        "",
        [Validators.required, urlValidator, urlMissingProtocol],
        this.urlValidator.bind(this)
      ),
      declaration: new FormControl(),
      stamp: new FormControl(),
      declarationDate: new FormControl(),
      stampDate: new FormControl(),
      user: new FormControl("", [this.userValidator.bind(this)]),
      entities: new FormControl(),
      tags: new FormControl(),
    });

    this.loadingEntities = true;
    this.loadingUsers = true;
    this.loadingTags = true;
    this.loadingCreate = false;

    this.selectedTags = [];
    this.selectedEntities = [];
  }

  ngOnInit(): void {
    this.get.listOfMyMonitorUsers().subscribe((users) => {
      if (users !== null) {
        this.monitorUsers = users;
        this.filteredUsers = this.websiteForm.controls.user.valueChanges.pipe(
          map((val) => this.filterUser(val))
        );
      }
      this.loadingUsers = false;
    });

    this.get.listOfEntities(-1, 0, "", "", "").subscribe((entities) => {
      if (entities !== null) {
        this.entities = entities;
        this.filteredEntities =
          this.websiteForm.controls.entities.valueChanges.pipe(
            map((entity) =>
              entity ? this.filterEntities(entity) : this.entities.slice()
            )
          );
      }

      this.loadingEntities = false;
    });

    this.get.listOfOfficialTags().subscribe((tags) => {
      if (tags !== null) {
        this.tags = tags;
        this.filteredTags = this.websiteForm.controls.tags.valueChanges.pipe(
          map((tag: any | null) =>
            tag ? this.filterTags(tag) : this.tags.slice()
          )
        );
      }

      this.loadingTags = false;
    });
  }

  resetForm(): void {
    this.websiteForm.reset();
    this.selectedTags = [];
    this.selectedEntities = [];
  }

  createWebsite(e): void {
    e.preventDefault();

    const name = _.trim(this.websiteForm.value.name);
    const startingUrl = encodeURIComponent(
      _.trim(this.websiteForm.value.startingUrl)
    );
    const declaration =
      this.websiteForm.value.declaration === ""
        ? null
        : parseInt(this.websiteForm.value.declaration);
    const declarationDate = this.websiteForm.value.declarationDate
      ? new Date(this.websiteForm.value.declarationDate)
      : null;
    const stamp =
      this.websiteForm.value.stamp === ""
        ? null
        : parseInt(this.websiteForm.value.stamp);
    const stampDate = this.websiteForm.value.stampDate
      ? new Date(this.websiteForm.value.stampDate)
      : null;
    const entities = _.map(this.selectedEntities, "EntityId");
    const userId = this.websiteForm.value.user
      ? _.find(this.monitorUsers, ["Username", this.websiteForm.value.user])
          .UserId
      : null;
    const tags = _.map(this.selectedTags, "TagId");

    const formData = {
      name,
      startingUrl,
      declaration,
      declarationDate,
      stamp,
      stampDate,
      entities,
      userId,
      tags,
    };

    this.loadingCreate = true;

    this.create.newWebsite(formData).subscribe((success) => {
      if (success !== null) {
        if (success) {
          this.message.show("WEBSITES_PAGE.ADD.messages.success");

          if (this.location.path() !== "/console/websites") {
            this.router.navigateByUrl("/console/websites");
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

  filterTags(name: string) {
    return this.tags.filter((tag) => {
      let valid = true;
      const names = name.trim().toLowerCase().split(' ');

      for (const n of names ?? [name]) {
        if (!tag.Name.toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.tags,
      (t) => t['Name'].trim() === event.option.viewValue.trim()
    );
    if (!_.includes(this.selectedTags, this.tags[index])) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = "";
      this.websiteForm.controls.tags.setValue(null);
    }
  }

  removeEntity(entity: any): void {
    const index = _.findIndex(this.selectedEntities, entity);

    if (index >= 0) {
      this.selectedEntities.splice(index, 1);
    }
  }

  filterEntities(val: any): string[] {
    return this.entities.filter((entity) => {
      let valid = true;
      const names = val.trim().toLowerCase().split(' ');

      for (const n of names ?? [val]) {
        if (!(entity.Short_Name + ' ' + entity.Long_Name).toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedEntity(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.entities,
      (e) => e["Long_Name"].trim() === event.option.viewValue.trim()
    );
    if (!_.includes(this.selectedEntities, this.entities[index])) {
      this.selectedEntities.push(this.entities[index]);
      this.entityInput.nativeElement.value = "";
      this.websiteForm.controls.entities.setValue(null);
    }
  }

  filterUser(val: any): string[] {
    return this.monitorUsers.filter((user) =>
      _.includes(_.toLower(user.Username), _.toLower(val))
    );
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== "") {
      return this.verify.websiteNameExists(name);
    } else {
      return null;
    }
  }

  urlValidator(control: AbstractControl): Observable<any> {
    const url = _.trim(control.value);

    if (url !== "") {
      return this.verify.websiteUrlExists(url);
    } else {
      return null;
    }
  }

  entityValidator(control: AbstractControl): any {
    const val = _.trim(control.value);
    if (val !== "" && val !== null) {
      return _.includes(_.map(this.entities, "Long_Name"), val)
        ? null
        : { validEntity: true };
    } else {
      return null;
    }
  }

  userValidator(control: AbstractControl): any {
    const val = _.trim(control.value);
    if (val !== "" && val !== null) {
      return _.includes(_.map(this.monitorUsers, "Username"), val)
        ? null
        : { validUser: true };
    } else {
      return null;
    }
  }
}

function urlValidator(control: FormControl): ValidationErrors | null {
  try {
    const url = _.trim(control.value);

    if (url === "") {
      return null;
    }

    const invalid = url.endsWith(".") || url.endsWith("/");

    return invalid ? { invalidUrl: true } : null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function urlMissingProtocol(control: FormControl): ValidationErrors | null {
  try {
    const url = _.trim(control.value);

    if (url === "") {
      return null;
    }

    const invalid =
      !url.startsWith("http://") && !url.startsWith("https://");

    return invalid ? { urlMissingProtocol: true } : null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
