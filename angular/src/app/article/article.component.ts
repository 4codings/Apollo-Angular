import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { AuthService } from '../service/auth.service';

declare var require: any
const { Post: PostQuery } = require('graphql-tag/loader!./article.component.graphql')
import { Post, PostVariables, Post_postById } from './apollo-types/Post'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  loading: boolean;
  post: Post_postById;
  private querySubscriptions: any[] = [];
  currentId: number;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.querySubscriptions.push(this.auth.currentPerson()
      .subscribe( (currentPerson) => { this.currentId = currentPerson.id }))

    const id = +this.route.snapshot.paramMap.get('id');
    this.querySubscriptions.push(this.apollo
        .watchQuery<Post>({
          query: PostQuery,
          variables: {
            id: id
          }
        })
        .valueChanges
      .subscribe( ({data, loading}) => {
        this.post = data.postById;
        this.loading = loading;
      }))
  }

  ngOnDestroy() {
    this.querySubscriptions.forEach(querySubscription => querySubscription.unsubscribe())
  }
}
