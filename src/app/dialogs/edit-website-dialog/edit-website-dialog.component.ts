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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from "lodash";

import { GetService } from "../../services/get.service";
import { VerifyService } from "../../services/verify.service";
import { UpdateService } from "../../services/update.service";
import { DeleteService } from "../../services/delete.service";
import { MessageService } from "../../services/message.service";

import { DeleteWebsiteConfirmationDialogComponent } from "../../dialogs/delete-website-confirmation-dialog/delete-website-confirmation-dialog.component";

import { ChooseObservatoryWebsitePagesDialogComponent } from "../choose-observatory-website-pages-dialog/choose-observatory-website-pages-dialog.component";

import { DeleteWebsitePagesDialogComponent } from "./../delete-website-pages-dialog/delete-website-pages-dialog.component";

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
  selector: "app-edit-website-dialog",
  templateUrl: "./edit-website-dialog.component.html",
  styleUrls: ["./edit-website-dialog.component.css"],
})
export class EditWebsiteDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingEntities: boolean;
  loadingUsers: boolean;
  loadingTags: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredEntities: Observable<string[]>;
  filteredUsers: Observable<string[]>;
  filteredTags: Observable<any[]>;

  entities: any;
  monitorUsers: any;
  tags: any;
  selectedTags: any;
  selectedEntities: any;

  websiteForm: FormGroup;

  defaultWebsite: any;

  @ViewChild("tagInput") tagInput: ElementRef;
  @ViewChild("entityInput") entityInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditWebsiteDialogComponent>,
    private dialog: MatDialog,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.websiteForm = new FormGroup({
      name: new FormControl("", Validators.required),
      startingUrl: new FormControl({ value: "", disabled: false }),
      declaration: new FormControl(),
      stamp: new FormControl(),
      declarationDate: new FormControl(),
      stampDate: new FormControl(),
      user: new FormControl(),
      transfer: new FormControl({ value: "", disabled: true }),
      entities: new FormControl(),
      tags: new FormControl(),
    });

    this.loadingEntities = true;
    this.loadingUsers = true;
    this.loadingTags = true;
    this.loadingUpdate = false;

    this.selectedTags = [];
    this.selectedEntities = [];
  }

  ngOnInit(): void {
    this.get.websiteInfo(this.data.id).subscribe((website) => {
      if (website !== null) {
        this.defaultWebsite = _.cloneDeep(website);

        this.websiteForm.controls.name.setValue(website.Name);
        this.websiteForm.controls.startingUrl.setValue(website.StartingUrl);

        if (website.Pages === "0") {
          this.websiteForm.controls.startingUrl.enable();
        }
        this.websiteForm.controls.declaration.setValue(website.Declaration);
        this.websiteForm.controls.stamp.setValue(website.Stamp);
        this.websiteForm.controls.declarationDate.setValue(
          website.Declaration_Update_Date
            ? new Date(website.Declaration_Update_Date)
            : null
        );
        this.websiteForm.controls.stampDate.setValue(
          website.Stamp_Update_Date ? new Date(website.Stamp_Update_Date) : null
        );
        this.websiteForm.controls.stampDate.setValue(website.Stamp_Update_Date);
        this.websiteForm.controls.user.setValue(website.User);
        this.selectedEntities = website.entities;
        this.selectedTags = website.tags;

        this.websiteForm.controls.name.setAsyncValidators(
          this.nameValidator.bind(this)
        );
        this.websiteForm.controls.user.setValidators(
          this.userValidator.bind(this)
        );
      }
    });

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

  setDefault(): void {
    this.websiteForm.controls.name.setValue(this.defaultWebsite.Name);
    this.websiteForm.controls.startingUrl.setValue(this.defaultWebsite.StartingUrl);
    this.websiteForm.controls.declaration.setValue(
      this.defaultWebsite.Declaration
    );
    this.websiteForm.controls.stamp.setValue(this.defaultWebsite.Stamp);
    this.websiteForm.controls.declarationDate.setValue(
      this.defaultWebsite.Declaration_Update_Date
    );
    this.websiteForm.controls.stampDate.setValue(
      this.defaultWebsite.Stamp_Update_Date
    );
    this.websiteForm.controls.user.setValue(this.defaultWebsite.User);
    this.websiteForm.controls.transfer.disable();
    this.websiteForm.controls.transfer.setValue(false);
    this.selectedTags = _.clone(this.defaultWebsite.tags);
    this.selectedEntities = _.clone(this.defaultWebsite.entities);
  }

  transferPagesValidator(): void {
    if (
      this.websiteForm.value.user === this.defaultWebsite.User ||
      this.websiteForm.value.user === ""
    ) {
      this.websiteForm.controls.transfer.disable();
      this.websiteForm.controls.transfer.setValue(false);
    } else {
      this.websiteForm.controls.transfer.enable();
    }
  }

  removedUser(): void {
    this.websiteForm.controls.user.reset();
    this.websiteForm.controls.transfer.disable();
    this.websiteForm.controls.transfer.setValue(false);
  }

  deleteWebsite(): void {
    if (!this.defaultWebsite.User) {
      this.deleteService
        .website({ websiteId: this.data.id })
        .subscribe((success) => {
          if (success !== null) {
            this.message.show("WEBSITES_PAGE.DELETE.messages.success");
            this.dialogRef.close(true);
          }
        });
    } else {
      this.dialog.open(DeleteWebsiteConfirmationDialogComponent, {
        width: "60vw",
      });
    }
  }

  updateWebsite(e): void {
    e.preventDefault();

    const name = _.trim(this.websiteForm.value.name);
    const startingUrl = encodeURIComponent(
      _.trim(this.websiteForm.value.startingUrl)//this.defaultWebsite.StartingUrl
    );
    const declaration =
      this.websiteForm.value.declaration === ""
        ? null
        : parseInt(this.websiteForm.value.declaration);
    const declarationUpdateDate = this.websiteForm.value.declarationDate
      ? new Date(this.websiteForm.value.declarationDate)
      : null;
    const stamp =
      this.websiteForm.value.stamp === ""
        ? null
        : parseInt(this.websiteForm.value.stamp);
    const stampUpdateDate = this.websiteForm.value.stampDate
      ? new Date(this.websiteForm.value.stampDate)
      : null;
    const userId = this.websiteForm.value.user
      ? _.find(this.monitorUsers, ["Username", this.websiteForm.value.user])
          .UserId
      : null;

    const olderUserId = this.defaultWebsite.User
      ? _.find(this.monitorUsers, ["Username", this.defaultWebsite.User]).UserId
      : null;
    const transfer = this.websiteForm.value.transfer;

    const defaultEntities = 
      _.map(this.defaultWebsite.entities, "EntityId");
    const entities = _.map(this.selectedEntities, "EntityId");

    const defaultTags = 
      _.map(this.defaultWebsite.tags, "TagId");
    const tags =_.map(this.selectedTags, "TagId");

    const formData = {
      websiteId: this.data.id,
      name,
      startingUrl,
      declaration,
      declarationUpdateDate,
      stamp,
      stampUpdateDate,
      userId,
      olderUserId,
      transfer,
      defaultEntities,
      entities,
      defaultTags,
      tags,
    };

    this.loadingUpdate = true;

    this.update.website(formData).subscribe((success) => {
      if (success !== null) {
        this.message.show("WEBSITES_PAGE.UPDATE.messages.success");
        this.dialogRef.close(true);
      }

      this.loadingUpdate = false;
    });
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  deleteWebsitePages(): void {
    this.dialog.open(DeleteWebsitePagesDialogComponent, {
      width: "60vw",
      data: this.data,
    });
  }

  chooseObservatoryPages(): void {
    this.dialog.open(ChooseObservatoryWebsitePagesDialogComponent, {
      width: "60vw",
      data: this.data,
    });
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
      (t) => t["Name"].trim() === event.option.viewValue.trim()
    );
    const index2 = _.findIndex(
      this.selectedTags,
      (t) => t["Name"].trim() === event.option.viewValue.trim()
    );
    if (index2 === -1) {
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
    const entity = this.entities.filter(
      (e) => e.Long_Name.trim() === event.option.viewValue.trim()
    );

    const selectedEntity = this.selectedEntities.filter(
      (e) => e.Long_Name.trim() === event.option.viewValue.trim()
    );

    if (entity.length > 0 && selectedEntity.length === 0) {
      this.selectedEntities.push(entity[0]);
      this.entityInput.nativeElement.value = "";
      this.websiteForm.controls.entities.setValue(null);
    }
  }

  filterUser(val: string): string[] {
    return this.monitorUsers.filter((user) =>
      _.includes(user.Username.toLowerCase(), val.toLowerCase())
    );
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = control.value.trim();
    if (
      name !== "" &&
      name !== this.defaultWebsite.Name &&
      name.toLowerCase() !== this.defaultWebsite.Name.toLowerCase()
    ) {
      return this.verify.websiteNameExists(name);
    } else {
      return of(null);
    }
  }

  entityValidator(control: AbstractControl): any {
    const val = _.trim(control.value);

    if (val) {
      return _.includes(_.map(this.entities, "Long_Name"), val)
        ? null
        : { validEntity: true };
    } else {
      return null;
    }
  }

  userValidator(control: AbstractControl): any {
    const val = _.trim(control.value);
    if (val) {
      return _.includes(_.map(this.monitorUsers, "Username"), val)
        ? null
        : { validUser: true };
    } else {
      return null;
    }
  }
}
