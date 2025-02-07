import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
  constructor(public authservcie: AuthService) {}
}
