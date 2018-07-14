import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private message: string = "";
  private type: string = "warning"

  delay = 2000; // milliseconds

  setAlert(message, type="warning") {
    this.message = message
    this.type = type
    setTimeout(this.clearAlert.bind(this), this.delay)
  }

  clearAlert() {
    this.message = ""
  }

  constructor() { }
}
