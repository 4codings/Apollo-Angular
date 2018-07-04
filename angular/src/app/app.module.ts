import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ArticleComponent } from './article/article.component';
import { AppRoutingModule } from './/app-routing.module';
import { AuthorComponent } from './author/author.component';


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ArticleComponent,
    AuthorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const uri = `http://${environment.apiHost}:${environment.apiPort}/graphql`;

    apollo.create({
      link: httpLink.create({
        uri: uri
      }),
      cache: new InMemoryCache()
    })
  }
}
