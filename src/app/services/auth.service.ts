import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'api/v1/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    return this.http.post(url,null);
  }
}
