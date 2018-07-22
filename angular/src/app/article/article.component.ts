import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { ArticleService } from '../service/article.service'
import { QueryPost_postById } from '../service/apollo-types/QueryPost'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  loading: boolean;
  post: QueryPost_postById;
  querySubscription: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private article: ArticleService,
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.querySubscription = this.article.queryPost(id)
      .subscribe( ({data, loading}) => {
        this.post = data.postById;
        this.loading = loading;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
