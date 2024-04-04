import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  environment : string;

  constructor(public user: UserService, public config: ConfigService) {
   }

  ngOnInit() {
    this.environment = this.config.getEnvironment();
    this.config.currentEnvironment.subscribe((env) => {
      this.environment = env;
    });
  }

  logout() {
    this.user.logout().subscribe();
  }
}
