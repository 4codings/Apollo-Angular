import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

declare var require: any
const Authenticate = require('graphql-tag/loader!./authenticate.service.graphql')
import { AuthenticateMutation } from '../gen/apollo-types'

const AUTH_TOKEN = "authToken"

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  constructor(
    private apollo: Apollo,
  ) { }

  setToken(token: string | null) {
    localStorage.setItem(AUTH_TOKEN, token)
  }

  getToken() {
    return localStorage.getItem(AUTH_TOKEN)
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
      setToken(data.authenticate.jwtToken)
      console.log('got data', data.authenticate.jwtToken);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
    return false;
  }

  logout() {
    setToken(null)
    this.apollo.getClient().resetStore();
  }
}
