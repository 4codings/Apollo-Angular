import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

declare var require: any
const Author = require('graphql-tag/loader!./author.component.graphql')
import { AuthorQuery } from '../gen/apollo-types'

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  private loading: boolean;
  private author: object;

  private querySubscription: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.querySubscription = this.apollo
      .watchQuery<AuthorQuery>({
        query: Author,
        variables: {
          id: id
        }
      })
      .valueChanges
      .subscribe( ({data, loading}) => {
        this.author = data.personById;
        this.loading = loading;
      });
    console.log(this.querySubscription)
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
