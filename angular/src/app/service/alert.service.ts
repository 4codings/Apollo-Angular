import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertMessage: string = "";

  delay = 2000; // milliseconds

  setAlert(alertMessage) {
    this.alertMessage = alertMessage;
    setTimeout(this.clearAlert.bind(this), this.delay)
  }

  clearAlert() {
    this.alertMessage = ""
  }

  constructor() { }
}
