import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { ArticleService } from '../service/article.service'
import { PostFragment } from '../gen/apollo-types'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  private loading: boolean;
  private post: PostFragment;
  private querySubscription: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private article: ArticleService
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.querySubscription = this.article.post(id)
      .subscribe( ({data, loading}) => {
        this.post = data.postById;
        this.loading = loading;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
