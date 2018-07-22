import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _message: string = "";
  private _type: string = "warning"

  public get message() { return this._message }
  public get type() { return this._type }

  delay = 2000; // milliseconds

  setAlert(message, type="warning") {
    this._message = message
    this._type = type
    setTimeout(this.clearAlert.bind(this), this.delay)
  }

  clearAlert() {
    this._message = ""
  }

  constructor() { }
}
