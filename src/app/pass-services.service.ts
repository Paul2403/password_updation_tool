import { Injectable } from '@angular/core';
import { Observable, throwError, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PassServicesService {

  private _baseConfig: Object;
  public originalString:any='';
  public url:any='';
  public targetUrl:any='';




  constructor(private http : HttpClient) { 
    this._baseConfig = environment.sr.cross_url;
    
  }

  trimUrl(){
    console.log('BASECONFIG',this._baseConfig);
    this.originalString = "http://localhost:4200/'http://localhost:3000'/user/login";
    this.url = new URL(this.originalString);
    this.targetUrl = this.url.pathname.slice(1);
    console.log(this.targetUrl);
  }

  // getData() {
  //   return this.http.get('/api/getData')
  // }

  // public getData(data: any): Observable<any> {
  //   return this.http.post<Boolean>(`http://localhost:3000/user/login`, data, {
  //     observe: 'response',
  //   }).pipe(
  //     map(res => {
  //       console.log(res['body']);
  //       return res['body'];
  //     }),
  //     catchError((e: any) => {

  //       return throwError(e)
  //     })
  //   )

  // }

  public getData(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/user/login`, data, {
      observe: 'response'
    }).pipe(
      map(res => {
        return res.body;
      }),
      catchError((e: any) => {
        return throwError(e)
      })
    )
  }

  public sendOTP(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/user/otp`, data, {
      observe: 'response'
    }).pipe(
      map(res => {
        return res.body;
      }),
      catchError((e: any) => {
        return throwError(e)
      })
    )
  }

  public confirmOTP(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/user/otpConfirm`, data, {
      observe: 'response'
    }).pipe(
      map(res => {
        return res.body;
      }),
      catchError((e: any) => {
        return throwError(e)
      })
    )
  }
}
