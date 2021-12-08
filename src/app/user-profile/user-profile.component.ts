import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthUtil } from '../auth/util';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { UserManagementService } from '../user-management/service';


@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile.component.html'
})
export class UserProfilePage implements OnInit {
  constructor(
    public auth: AuthService,
    private authUtil: AuthUtil,
    private elasticsearch: ElasticsearchService,
    private userManagement: UserManagementService,
  ) {}

  isEditingProfile: boolean = false;
  ratedLifecourses: any[] = [];
  openSearchHistory: boolean = false;
  newUsername: string = "";
  newEmail: string = "";
  user;
  profile;
  showWarning = false;
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
      await this.userManagement.updateProfile(this.user, changes);
    }
    catch(error) {
      if(typeof error.error === "string") {
        console.error("Error while updating profile", error);
        this.error = error.error;
        this.saving = false;
        return;
      }
      throw error;
    }

    this.profile.userName = this.newUsername;
    this.profile.email = this.newEmail;

    this.isEditingProfile = false;
    this.authUtil.handleLogin();
  }

  async deleteProfile() {
    this.saving = true;
    await this.userManagement.deleteProfile();
    this.authUtil.handleLogout();
  }

  logout(){
    this.authUtil.handleLogout();
  }

  featherSpriteUrl = this.config.featherIconPath;
  
  ngOnInit(): void {
    this.elasticsearch.getRatedLifecourses().subscribe({
      error: (e) => {
        if(e.message.match(/Login required/i)) {
          this.authUtil.handleLogin();
          return;
        }
        throw e;
      },
      next: (ratedLifecourses) => {
        this.ratedLifecourses = ratedLifecourses;
      },
    });

    this.auth.user$.subscribe({
      next: async (user) => {
        this.user = user;
        this.profile = await this.userManagement.getProfile(this.user);
      },
    });
  }
}
