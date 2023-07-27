import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/UserModel';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  checkUserNameAvailability(user: User): Observable<any> {
    return this.http.post(environment.apiurl + `/checkUserNameAvailability`,user);
  }
  register(user: User): Observable<any>
  {
    console.log(user)
    return this.http.post(environment.apiurl + `/createUser`, user);
  }
}
