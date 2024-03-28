import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipList, MatChipInputEvent } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { DeleteService } from '../../services/delete.service';
import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';
import { UpdateService } from '../../services/update.service';

import * as _ from "lodash";
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
  selector: 'app-edit-gov-user-dialog',
  templateUrl: './edit-gov-user-dialog.component.html',
  styleUrls: ['./edit-gov-user-dialog.component.css']
})
export class EditGovUserDialogComponent implements OnInit {

  @ViewChild("emailsChipList", { static: true }) emailsChipList: MatChipList;
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

  filteredUsers: Observable<any[]>;
  defaultGovUser: any;
  users: any;
  selectedUsers: any;

  @ViewChild("userInput") userInput: ElementRef;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditGovUserDialogComponent>,
    private formBuilder: FormBuilder,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private message: MessageService
  ) {
    this.hide = true;
    this.hide2 = true;

    this.defaultGovUser = {};

    this.matcher = new MyErrorStateMatcher();

    this.userForm = new FormGroup({
      name: new FormControl({ value: "" }),
      ccNumber: new FormControl({ value: "" }),
      users: new FormControl(),

    });

    this.loadingInfo = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;
    this.users = [];
    this.selectedUsers = [];

  }

  ngOnInit(): void {
    this.get.govUser(this.data.id).subscribe((govUser) => {
      this.defaultGovUser = _.cloneDeep(govUser);
      this.selectedUsers = govUser.entities;
      this.get.listOfUsers().subscribe((otherUsers) => {
      this.users = otherUsers;
      this.filteredUsers = this.userForm.controls.users.valueChanges.pipe(
        map((user: any | null) => {
          console.log(user);
          console.log(user ? this.filterUser(user) : this.users.slice());
          return user ? this.filterUser(user) : this.users.slice()
        }
        )
      );});
      if (govUser !== null) {
        this.userForm.controls.name.setValue(govUser.name);
        this.userForm.controls.ccNumber.setValue(govUser.ccNumber);
        this.loadingInfo = false;
      }
    })
  }
  setDefault(): void {
    this.userForm.controls.name.setValue(this.defaultGovUser.name);
    this.userForm.controls.ccNumber.setValue(this.defaultGovUser.ccNumber);
    this.selectedUsers = _.clone(this.defaultGovUser.userList);
    console.log(this.selectedUsers);
  }



  updateUser(e): void {
    e.preventDefault();

    const name = this.userForm.value.name || undefined;
    const ccNumber = this.userForm.value.ccNumber || undefined;

    //send Update
    console.log("send update" + name + " " + ccNumber)

    const formData = {
      id: this.data.id,
      name,
      ccNumber,
      entities: this.selectedUsers,

    };

    this.update.govUser(formData).subscribe((success) => {
      if (success !== null) {
        this.userForm.controls.name.reset();
        this.userForm.controls.ccNumber.reset();
        this.message.show("USERS_PAGE.UPDATE.messages.success");
        this.dialogRef.close(true);
      }

      this.loadingUpdate = false;
    });
  }

  removeUser(user: any): void {
    const index = _.findIndex(this.selectedUsers, user);

    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }


  deleteGovUser(): void {
    this.deleteService
      .govUser({ id: this.data.id })
      .subscribe((success) => {
        if (success !== null) {
          this.message.show("USERS_PAGE.DELETE.messages.success");
          this.dialogRef.close(true);
        }
      });
  }

  filterUser(name: string) {
    return this.users.filter((user) => {
      let valid = true;
      const names = name.trim().toLowerCase().split(' ');

      for (const n of names ?? [name]) {
        if (!user.Username.toLowerCase().includes(n)) {
          valid = false;
        }
      }
      return valid;
    });
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(
      this.users,
      (t) => t["Username"].trim() === event.option.viewValue.trim()
    );
    const index2 = _.findIndex(
      this.selectedUsers,
      (t) => t["Username"].trim() === event.option.viewValue.trim()
    );
    if (index2 < 0) {
      this.selectedUsers.push(this.users[index]);
      this.userInput.nativeElement.value = "";
      this.userForm.controls.users.setValue(null);
    }
  }

}

