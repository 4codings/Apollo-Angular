import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

declare var require: any
const AuthenticateMutation = require('graphql-tag/loader!./authenticate.graphql')
const CurrentPersonQuery = require('graphql-tag/loader!./current.person.graphql')
import { Authenticate, AuthenticateVariables } from './apollo-types/Authenticate'
import { CurrentPerson, CurrentPerson_currentPerson } from './apollo-types/CurrentPerson'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apollo: Apollo,
  ) { }

  private setToken(token: string) {
    localStorage.setItem(this.AUTH_TOKEN, token)
  }

  getToken(): string {
    // Left for putting into header
    return localStorage.getItem(this.AUTH_TOKEN)
  }

  private clearToken() {
    localStorage.removeItem(this.AUTH_TOKEN)
  }

  AUTH_TOKEN = "authToken"

  login(email: string, password: string, callback: () => void): void {
    const input: AuthenticateVariables = {
      email: email,
      password: password
    }

    this.apollo.mutate({
      mutation: AuthenticateMutation,
      variables: input
    }).subscribe(({ data }) => {
      this.setToken(data.authenticate.jwtToken)
      callback()
    }, (error) => {
      console.log('there was an error logging in', error);
    });
  }

  logout(): void {
    this.clearToken()
    this.apollo.getClient().resetStore();
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  currentPerson(): Observable<CurrentPerson_currentPerson> {
    return this.apollo
      .watchQuery<CurrentPerson>({
        query: CurrentPersonQuery
      })
      .valueChanges
      .pipe(map(({data}) => data.currentPerson))
  }
}
