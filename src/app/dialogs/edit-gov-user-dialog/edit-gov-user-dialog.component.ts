import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipList, MatChipInputEvent } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { DeleteService } from '../../services/delete.service';
import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';
import { UpdateService } from '../../services/update.service';
import { MyErrorStateMatcher, PasswordValidation } from '../add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import * as _ from "lodash";


@Component({
  selector: 'app-edit-gov-user-dialog',
  templateUrl: './edit-gov-user-dialog.component.html',
  styleUrls: ['./edit-gov-user-dialog.component.css']
})
export class EditGovUserDialogComponent implements OnInit {


  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingWebsites: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];
  hide: boolean;
  hide2: boolean;
  userForm: FormGroup;

  defaultUser: any;

  @ViewChild("websiteInput") websiteInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private formBuilder: FormBuilder,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private message: MessageService
  ) {
    this.hide = true;
    this.hide2 = true;

    this.defaultUser = {};

    this.matcher = new MyErrorStateMatcher();

    this.userForm = new FormGroup({
      name: new FormControl({ value: ""}),
      ccNumber: new FormControl({ value: "" }),
    });

    this.loadingInfo = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;
  }

  ngOnInit(): void {
    const user = {
      name: "teste123teste", ccNumber: "123456789", register_date: "11/11/11",
      last_login: "11/11/11",
    };
    this.defaultUser = user;
    if (user !== null) {
      this.userForm.controls.name.setValue(user.name);
      this.userForm.controls.ccNumber.setValue(user.ccNumber);
      this.loadingInfo = false;
    }
  }
  setDefault(): void {
    this.userForm.controls.name.setValue(this.defaultUser.name);
    this.userForm.controls.ccNumber.setValue(this.defaultUser.ccNumber);
  }


  updateUser(e): void {
    e.preventDefault();

    const name = this.userForm.value.name || undefined;
    const ccNumber = this.userForm.value.ccNumber || undefined;

    //send Update
    console.log("send update" + name + " "+ccNumber)

    this.loadingUpdate = false;
  }
}

