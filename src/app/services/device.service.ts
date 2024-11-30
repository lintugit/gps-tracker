import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = 'api/v1/device';
  private apiTrackerUrl = 'api/v1/trackerdata';

  constructor(private http: HttpClient) { }


  getDevices(): Observable<any> {
    const token = localStorage.getItem('token');  // If token is stored in localStorage
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)  // Add the Bearer token in the header
      .set('Accept', 'application/json'); 
      // Set Accept header for JSON response
    return this.http.get(this.apiUrl, { headers });
  }
  getTrackingData(deviceId: string,lastPoints:number): Observable<any> {
    const token:any = localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)  // Add the Bearer token in the header
    .set('Accept', 'application/json'); 
    // Set Accept header for JSON response
    const url = this.apiTrackerUrl+`/${deviceId}/last_points?lastPoints=`+lastPoints;
    return this.http.get(url, { headers });
  }
  getDeviceLastPosition(deviceIdsArray:any): Observable<any> {
    const token = localStorage.getItem('token');  // If token is stored in localStorage
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)  // Add the Bearer token in the header
      .set('Accept', 'application/json'); 
      let data: any = {
        deviceIDs: deviceIdsArray,
        fromLastPoint: false
      };
      
    let url=this.apiTrackerUrl+`/getalllastpositions`
    return this.http.post(url,data, { headers });
  }
}
