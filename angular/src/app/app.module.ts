import { HttpHeaders } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';

import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';
import { setContext } from 'apollo-link-context';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AuthorComponent } from './author/author.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { LoginComponent } from './login/login.component';

import { AuthService } from './service/auth.service';
import { AlertService } from './service/alert.service';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './alert/alert.component';
import { ProfileComponent } from './profile/profile.component';
import { EditPostComponent } from './edit-post/edit-post.component';


@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    ArticleListComponent,
    AuthorComponent,
    AuthorListComponent,
    LoginComponent,
    HeaderComponent,
    AlertComponent,
    ProfileComponent,
    EditPostComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [AuthService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private authService: AuthService
  ) {
    const http = httpLink.create({
      uri: `http://${environment.apiHost}:${environment.apiPort}/graphql`
    })

    const token = this.authService.getToken()
    let auth = null

    if (token) {
      auth = setContext((_, { headers }) => {
        if (!headers) {
          headers = new HttpHeaders()
        }

        return { headers: headers.append('Authorization', `Bearer ${token}`) }
      }).concat(http)
    } else {
      auth = http
    }

    apollo.create({
      link: auth,
      cache: new InMemoryCache()
    })
  }
}
