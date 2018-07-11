import { Component, OnInit } from '@angular/core';

import { AuthenticateService } from '../service/authenticate.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticateService: AuthenticateService
  ) { }

  ngOnInit() {
  }

  login = authenticateService.login
}
