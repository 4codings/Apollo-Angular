import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticateService } from '../service/authenticate.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticateService: AuthenticateService,
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
