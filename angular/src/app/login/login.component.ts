import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticateService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    this.authenticateService.login(email, password,
      () => this.ngZone.run(() => this.router.navigate(["/"]))
    )
    return false;
  }
}
