import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    private router: Router,
  ) { }

  search(query: string) {
    this.router.navigate(["/articles"], {
      queryParams: {"search": query}
    })
    return false
  }
}
