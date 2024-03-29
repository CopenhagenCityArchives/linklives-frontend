import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RatingService } from '../data/rating.service';
import { UserManagementService } from '../user-management/service';


@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile.component.html'
})
export class UserProfilePage implements OnInit {
  constructor(
    public auth: AuthService,
    private ratingService: RatingService,
    private userManagement: UserManagementService,
  ) {}

  isEditingProfile: boolean = false;
  ratedLifecourses: any[] = [];
  openSearchHistory: boolean = false;
  newUsername: string = "";
  newEmail: string = "";
  user;
  profile;
  showEmailChangeWarning = false;
  showDeleteWarning = false;
  error: string = null;
  saving: boolean = false;

  get config() {
    return window["lls"];
  };

  get featherIconPath() {
    return this.config.featherIconPath;
  }

  editProfile() {
    this.newUsername = this.profile.userName;
    this.newEmail = this.profile.email;
    this.isEditingProfile = true;
  }

  async saveProfile() {
    this.saving = true;

    const changes: { userName?: string, email?: string } = {};
    if(this.profile.userName != this.newUsername) {
      changes.userName = this.newUsername;
    }
    if(this.profile.email != this.newEmail) {
      changes.email = this.newEmail;
    }

    if(Object.keys(changes).length < 1) {
      this.saving = false;
      this.isEditingProfile = false;
      return;
    }

    try {
      await this.userManagement.updateProfile(changes);
    }
    catch(error) {
      if(typeof error.error === "string") {
        console.error("Error while updating profile", error);
        this.error = error.error;
        this.saving = false;
        return;
      }
      if(error.message.match(/Login required/i)) {
        this.userManagement.handleLogin();
        return;
      }
      throw error;
    }

    this.profile.userName = this.newUsername;
    this.profile.email = this.newEmail;

    this.isEditingProfile = false;
    this.userManagement.handleLogin();
  }

  async deleteProfile() {
    this.saving = true;
    try {
      await this.userManagement.deleteProfile();
    }
    catch(e) {
      if(e.message.match(/Login required/i)) {
        this.userManagement.handleLogin();
        return;
      }
      throw e;
    }
    this.userManagement.handleLogout();
  }

  logout(){
    this.userManagement.handleLogout();
  }

  featherSpriteUrl = this.config.featherIconPath;
  
  async ngOnInit(): Promise<void> {
    this.ratingService.getRatedLifecourses().subscribe({
      error: (e) => {
        if(e.message.match(/Login required/i)) {
          this.userManagement.handleLogin();
          return;
        }
        throw e;
      },
      next: (ratedLifecourses) => {
        this.ratedLifecourses = ratedLifecourses;
      },
    });

    try {
      this.profile = await this.userManagement.getProfile();
    }
    catch(e) {
      if(e.message.match(/Login required/i)) {
        this.userManagement.handleLogin();
        return;
      }
      throw e;
    }
  }
}
