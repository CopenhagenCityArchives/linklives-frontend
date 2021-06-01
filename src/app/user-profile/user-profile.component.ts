import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile.component.html'
})

export class UserProfilePage {
  constructor(public auth: AuthService) {}

  get config() {
    return window["lls"];
  };

  logout(){
    this.auth.logout();
  }

  featherSpriteUrl = this.config.featherIconPath;
}