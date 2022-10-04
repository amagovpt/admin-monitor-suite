import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { MatChipList } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from "@angular/common";

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';
import { EditGovUserDialogComponent } from '../edit-gov-user-dialog/edit-gov-user-dialog.component';
import * as _ from "lodash";
import { CreateService } from '../../services/create.service';
import { Router } from '@angular/router';

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
  selector: 'app-add-gov-user-dialog',
  templateUrl: './add-gov-user-dialog.component.html',
  styleUrls: ['./add-gov-user-dialog.component.css']
})
export class AddGovUserDialogComponent implements OnInit {
  @ViewChild("emailsChipList", { static: true }) emailsChipList: MatChipList;
  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];
  hide: boolean;
  hide2: boolean;
  userForm: FormGroup;
  defaultGovUser = {
    name: "", ccNumber: ""
  };
  ;

  @ViewChild("userInput") userInput: ElementRef;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditGovUserDialogComponent>,
    private create: CreateService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private get: GetService,
  ) {
    this.hide = true;
    this.hide2 = true;

    this.matcher = new MyErrorStateMatcher();

    this.userForm = new FormGroup({
      name: new FormControl({ value: "" }),
      ccNumber: new FormControl({ value: "" }),

    });

    this.loadingInfo = true;
    this.loadingCreate = false;

  }

  ngOnInit(): void {
    const govUser = {
      name: "", ccNumber: "", register_date: "11/11/11",
      last_login: "11/11/11", userList: [{ Username: "teste" }, { Username: "teste1" }]
    };
    if (govUser !== null) {
      this.userForm.controls.name.setValue(govUser.name);
      this.userForm.controls.ccNumber.setValue(govUser.ccNumber);
      this.loadingInfo = false;
    }
  }
  setDefault(): void {
    this.userForm.controls.name.setValue(this.defaultGovUser.name);
    this.userForm.controls.ccNumber.setValue(this.defaultGovUser.ccNumber);
  }


  addUser(e): void {
    e.preventDefault();

    const name = this.userForm.value.name || undefined;
    const ccNumber = this.userForm.value.ccNumber || undefined;

    const formData = {
      name,
      ccNumber
    };

    this.loadingCreate = true;

    this.create.newGovUser(formData).subscribe((success) => {
      if (success !== null) {
        if (success) {
          this.message.show("USERS_PAGE.ADD.messages.success");

          if (this.location.path() !== "/console/govUsers") {
            this.router.navigateByUrl("/console/govUsers");
          } else {
            window.location.reload();
          }

          this.dialogRef.close();
        }
      }

      this.loadingCreate = false;
    });
  }


}
