import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() {
  }

  private videoConferenceRoasterInformation: 'vc_roaster_info';

  public setRoasterInfo(info: object) {
    console.log('storing roaster info');
    localStorage.setItem(this.videoConferenceRoasterInformation, JSON.stringify({
      roasterInfo: info
    }));
  }

  public getRoasterInfo() {
    console.log('reading roaster info');
    let data = JSON.parse(localStorage.getItem(this.videoConferenceRoasterInformation));
    if (!data) return null;
    return data.roasterInfo;
  }


  public roasterInfoIsSet() {
    console.log('checking roaster info');
    let data = JSON.parse(localStorage.getItem(this.videoConferenceRoasterInformation));
    if (!data) return false;
    return true;
  }

}
