import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AuthorComponent } from './author/author.component';
import { AuthorListComponent } from './author-list/author-list.component';

const routes: Routes = [
  { path: '',            component: ArticleListComponent },
  { path: 'articles',    component: ArticleListComponent },
  { path: 'authors',     component: AuthorListComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'author/:id',  component: AuthorComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
