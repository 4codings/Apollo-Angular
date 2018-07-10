import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AuthorComponent } from './author/author.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',            component: ArticleListComponent },
  { path: 'articles',    component: ArticleListComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'author/:id',  component: AuthorComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
