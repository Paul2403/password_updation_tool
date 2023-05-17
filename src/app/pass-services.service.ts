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
    this.originalString = "http://localhost:4200/'http://localhost:3000'/user/login";
    this.url = new URL(this.originalString);
    this.targetUrl = this.url.pathname.slice(1);
  }

  public async createPasswordToken(password: string): Promise<string> {
    const saltSize = 16; // 128 bits
    const salt = new Uint8Array(saltSize);
    crypto.getRandomValues(salt);

    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const passwordHash = await crypto.subtle.digest('SHA-256', passwordData);

    const buffer = new ArrayBuffer(saltSize + passwordHash.byteLength);
    const view = new DataView(buffer);

    for (let i = 0; i < saltSize; i++) {
      view.setUint8(i, salt[i]);
    }
    for (let i = 0; i < passwordHash.byteLength; i++) {
      view.setUint8(saltSize + i, new Uint8Array(passwordHash)[i]);
    }

    const passwordToken = Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    return passwordToken;
  }
  

   sha256(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return crypto.subtle.digest('SHA-256', data)
      .then((hash) => {
        const hexString = new Uint8Array(hash)
          .reduce((accumulator, value) => accumulator + value.toString(16).padStart(2, '0'), '');
        return hexString;
      });
  }



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

  public getWeakPasswords(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/user/common-passwords`, data, {
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
