import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { ArticleComponent } from './article/article.component';
import { AuthorComponent } from './author/author.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',            component: ListComponent },
  { path: 'articles',    component: ListComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'author/:id',  component: AuthorComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
