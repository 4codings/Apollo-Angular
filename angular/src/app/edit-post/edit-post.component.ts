import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ArticleService } from '../service/article.service'
import { AuthService } from '../service/auth.service';
import { AlertService } from '../service/alert.service';
import { PostFragment, PostTopic, PostPatch } from '../gen/apollo-types'

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  private loading: boolean;
  private post: PostFragment;
  private postForm: FormGroup;  // stores mutable values
  private querySubscription: any = null;
  private topics: any[];
  private isNew: boolean;
  private id: number;
  private currentPersonId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private article: ArticleService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private alert: AlertService,
  ) {
    this.postForm = this.formBuilder.group({
      headline: ['', Validators.required],
      body:     ['', Validators.maxLength(199)],
      topic:    null,
    })
    this.topics = Object.keys(PostTopic)
  }

  // id, author_id, headline, body, topic, created_at

  ngOnInit() {
    this.isNew = !!this.route.snapshot.data['isNew']
    this.id = parseInt(this.route.snapshot.paramMap.get('id'))

    this.auth.currentPerson()
      .subscribe((currentPerson) => this.currentPersonId = currentPerson.id)

    if (this.isNew) {
      this.post = {
        headline: '',
        body: '',
        topic: null,
        createdAt: null,
      }
      this.resetForm()
    } else {
      this.querySubscription = this.article.queryPost(this.id)
        .subscribe(({data}) => {
          this.post = data.postById
          this.resetForm()
        })
    }
  }

  private updateForm({data}) {
    if (data.postById) {
      this.post = data.postById
    }
    this.resetForm()
  }

  private resetForm() {
    this.postForm.reset({
      headline: this.post.headline,
      body:     this.post.body,
      topic:    this.post.topic,
    })
  }

  private createPost() {
    const newPost: PostFragment = {
      authorId: this.currentPersonId,
      headline: this.post.headline,
      body:     this.post.body,
      topic:    this.post.topic,
      ...this.postForm.value
    }
    this.article.createPost(newPost)
      .subscribe(() => {
        this.resetForm()
        this.alert.setAlert("Added Post")
      });
  }

  private updatePost() {
    const optimisitcPost: PostFragment = {
      ...this.post,
      ...this.postForm.value
    }
    const patch: PostPatch = {
      ...this.postForm.value,
      id: this.id
    }

    this.article.updatePost(patch, optimisitcPost)
      .subscribe(({data}) => {
        this.post = data.updatePostById.post
        this.resetForm()
        this.alert.setAlert("Updated Post")
      });
  }

  private submit() {
    if (this.isNew) {
      this.createPost()
    } else {
      this.updatePost()
    }
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
