import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

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
  querySubscription: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.querySubscription = this.apollo
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
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
