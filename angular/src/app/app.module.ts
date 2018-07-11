import { HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { setContext } from 'apollo-link-context';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AuthorComponent } from './author/author.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { LoginComponent } from './login/login.component';

import { AuthenticateService } from './service/authenticate.service';
import { HeaderComponent } from './header/header.component'


@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    ArticleListComponent,
    AuthorComponent,
    AuthorListComponent,
    LoginComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    AppRoutingModule
  ],
  providers: [AuthenticateService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private authenticateService: AuthenticateService
  ) {
    const http = httpLink.create({
      uri: `http://${environment.apiHost}:${environment.apiPort}/graphql`
    })

    const auth = setContext((_, { headers }) => {
      const token = this.authenticateService.getToken()
      if (!headers) {
        headers = new HttpHeaders()
      }

      if (token) {
        return { headers: headers.append('Authorization', `Bearer ${token}`) }
      } else {
        return { headers }
      }
    })

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
    })
  }
}
