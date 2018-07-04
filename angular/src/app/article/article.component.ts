import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
declare var require: any
const PostQuery = require('graphql-tag/loader!./article.component.graphql')
import { Post } from '../gen/apollo-types'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  loading: boolean;
  post: any;


  private querySubscription: any;

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
