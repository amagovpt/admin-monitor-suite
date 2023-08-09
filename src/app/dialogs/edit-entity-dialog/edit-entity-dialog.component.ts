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

import { CreateService } from "../../services/create.service";
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
  selector: "app-edit-entity-dialog",
  templateUrl: "./edit-entity-dialog.component.html",
  styleUrls: ["./edit-entity-dialog.component.css"],
})
export class EditEntityDialogComponent implements OnInit {
  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingWebsites: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  entityForm: FormGroup;

  defaultEntity: any;

  @ViewChild("websiteInput") websiteInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEntityDialogComponent>,
    private create: CreateService,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.defaultEntity = {};
    this.websites = [];

    this.matcher = new MyErrorStateMatcher();

    this.entityForm = new FormGroup({
      shortName: new FormControl("", Validators.required),
      longName: new FormControl("", Validators.required),
      websites: new FormControl(),
    });

    this.loadingInfo = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;

    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    this.get.entityInfo(this.data.id).subscribe((entity) => {
      if (entity !== null) {
        this.defaultEntity = _.cloneDeep(entity);

        this.entityForm.controls.shortName.setValue(entity.shortName);
        this.entityForm.controls.longName.setValue(entity.longName);
        this.selectedWebsites = entity.websites;
        this.websites = this.websites.concat(entity.websites);

        this.entityForm.controls.shortName.setAsyncValidators(
          this.shortNameValidator.bind(this)
        );
        this.entityForm.controls.longName.setAsyncValidators(
          this.longNameValidator.bind(this)
        );
      }

      this.loadingInfo = false;
    });

    this.get.listOfOfficialWebsites().subscribe((websites) => {
      if (websites !== null) {
        this.websites = this.websites.concat(websites);
        this.filteredWebsites =
          this.entityForm.controls.websites.valueChanges.pipe(
            map((website: any | null) =>
              website ? this.filterWebsite(website) : this.websites.slice()
            )
          );
      }

      this.loadingWebsites = false;
    });
  }

  setDefault(): void {
    this.entityForm.controls.shortName.setValue(this.defaultEntity.shortName);
    this.entityForm.controls.longName.setValue(this.defaultEntity.longName);
    this.selectedWebsites = _.clone(this.defaultEntity.websites);
  }

  deleteEntity(): void {
    this.deleteService
      .entity({ entityId: this.data.id })
      .subscribe((success) => {
        if (success !== null) {
          this.message.show("ENTITIES_PAGE.DELETE.messages.success");
          this.dialogRef.close(true);
        }
      });
  }

  updateEntity(e): void {
    e.preventDefault();

    const shortName = this.entityForm.value.shortName.trim();
    const longName = this.entityForm.value.longName.trim();

    const defaultWebsites = _.map(this.defaultEntity.websites, "websiteId");
    const websites = _.map(this.selectedWebsites, "websiteId");

    const formData = {
      entityId: this.data.id,
      shortName,
      longName,
      defaultWebsites,
      websites,
    };

    this.loadingUpdate = true;

    this.update.entity(formData).subscribe((success) => {
      if (success !== null) {
        this.message.show("ENTITIES_PAGE.UPDATE.messages.success");
        this.dialogRef.close(true);
      }

      this.loadingUpdate = false;
    });
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
      (w) => w["startingUrl"].trim() === event.option.viewValue.trim()
    );
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = "";
      this.entityForm.controls.websites.setValue(null);
    }
  }

  shortNameValidator(control: AbstractControl): Observable<any> {
    const name = control.value.trim();

    if (
      name !== "" &&
      name !== this.defaultEntity.shortName &&
      name.toLowerCase() !== this.defaultEntity.shortName.toLowerCase()
    ) {
      return this.verify.entityShortNameExists(name);
    } else {
      return of(null);
    }
  }

  longNameValidator(control: AbstractControl): Observable<any> {
    const name = control.value.trim();

    if (
      name !== "" &&
      name !== this.defaultEntity.longName &&
      name.toLowerCase() !== this.defaultEntity.longName.toLowerCase()
    ) {
      return this.verify.entityLongNameExists(name);
    } else {
      return of(null);
    }
  }
}
