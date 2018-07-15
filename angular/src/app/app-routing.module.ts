import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { AuthorComponent } from './author/author.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { EditPostComponent } from './edit-post/edit-post.component';

const routes: Routes = [
  { path: '',            component: ArticleListComponent },
  { path: 'articles',    component: ArticleListComponent },
  { path: 'authors',     component: AuthorListComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'author/:id',  component: AuthorComponent },
  { path: 'login',       component: LoginComponent },
  { path: 'profile',     component: ProfileComponent },
  { path: 'edit/:id',    component: EditPostComponent, data: { newPost: false } },
  { path: 'edit',        component: EditPostComponent, data: { newPost: true } },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
