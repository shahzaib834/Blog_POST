import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  BASE_URL: string = 'http://localhost:4000/api/';

  getData(url: string): Observable<any> {
    const requestUrl: string = this.BASE_URL + url;
    return this.http.get(requestUrl);
  }

  postDataWithHeaders(url: string, body: {}): Observable<any> {
    const token = localStorage.getItem('token');
    const requestUrl: string = this.BASE_URL + url;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    });
    return this.http.post(requestUrl, body, {
      headers,
    });
  }

  authRequest(url: string, body: {}): Observable<any> {
    const requestUrl: string = this.BASE_URL + url;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(requestUrl, body, {
      headers,
    });
  }
}
