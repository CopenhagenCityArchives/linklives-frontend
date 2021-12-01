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
  ratedLifecourses: any;
  openSearchHistory: boolean = false;
  newNickname: string = "";
  newEmail: string = "";
  user;
  saving: boolean = false;

  get config() {
    return window["lls"];
  };

  editProfile() {
    this.newNickname = this.user.nickname;
    this.newEmail = this.user.email;
    this.isEditingProfile = true;
  }

  async saveProfile() {
    this.saving = true;

    await this.userManagement.updateProfile(this.user, {
      nickname: this.newNickname,
      email: this.newEmail,
    });

    this.user.nickname = this.newNickname;
    this.user.email = this.newEmail;

    this.saving = false;
    this.isEditingProfile = false;
  }

  logout(){
    this.authUtil.handleLogout();
  }

  featherSpriteUrl = this.config.featherIconPath;
  
  ngOnInit(): void {
    this.elasticsearch.getRatedLifecourses().subscribe((ratedLifecourses) => {
      this.ratedLifecourses = ratedLifecourses;
    });

    this.auth.user$.subscribe((user) => this.user = user);
  }
}
