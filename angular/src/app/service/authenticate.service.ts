import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

declare var require: any
const Authenticate = require('graphql-tag/loader!./authenticate.service.graphql')
import { AuthenticateMutation, AuthenticateMutationVariables } from '../gen/apollo-types'

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  constructor(
    private apollo: Apollo,
  ) { }

  setToken(token: string) {
    localStorage.setItem(this.AUTH_TOKEN, token)
  }

  getToken(): string {
    return localStorage.getItem(this.AUTH_TOKEN)
  }

  clearToken() {
    localStorage.removeItem(this.AUTH_TOKEN)
  }

  AUTH_TOKEN = "authToken"

  login(email: string, password: string, callback: () => void) {
    const input: AuthenticateMutationVariables = {
      email: email,
      password: password
    }

    this.apollo.mutate({
      mutation: Authenticate,
      variables: input
    }).subscribe(({ data }) => {
      this.setToken(data.authenticate.jwtToken)
      callback()
      console.log('got data', data.authenticate.jwtToken);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  logout() {
    this.clearToken()
    this.apollo.getClient().resetStore();
  }
}
