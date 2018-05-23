import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const confirmPassword = AC.get('confirmPassword').value;
    
    if (!_.isEqual(password, confirmPassword)) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  hide: boolean;
  userForm: FormGroup;
  websites: any;

  constructor(private formBuilder: FormBuilder, private server: ServerService, 
    private message: MessageService) {
    
    this.hide = true;

    this.userForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      app: new FormControl('', [
        Validators.required
      ]),
      websites: new FormControl({value: '', disabled: true})
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnInit(): void {
    this.server.userPost('/websites/withoutUser', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.websites = data.result;
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {

      });
  }

  changeApp(): void {
    if (_.isEqual(this.userForm.value.app, 'monitor'))
      this.userForm.controls.websites.enable();
    else {
      this.userForm.controls.websites.reset();
      this.userForm.controls.websites.disable();
    }
  }

  createUser(e): void {
  	e.preventDefault();
    
    const email = this.userForm.value.email;
    const password = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;
    const app = this.userForm.value.app;
    const websites = this.userForm.value.websites;

    const formData = {
      email,
      password,
      confirmPassword,
      app,
      websites
    };

    this.server.userPost('/users/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }
}