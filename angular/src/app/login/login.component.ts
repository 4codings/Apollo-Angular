import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

declare var require: any
const Authenticate = require('graphql-tag/loader!./login.component.graphql')
import { AuthenticateMutation } from '../gen/apollo-types'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private apollo: Apollo,
  ) { }

  ngOnInit() {
  }

  login(email: String, password: String) {
    const input: AuthenticateMutationVariables = {
      email: email
      password: password
    }

    this.apollo.mutate({
      mutation: Authenticate,
      variables: input
    }).subscribe(({ data }) => {
      const { token } = data;
      console.log('got data', token);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
    return false;
  }
}
