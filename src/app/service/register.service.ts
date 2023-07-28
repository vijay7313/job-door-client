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

  register(user: User): Observable<any>
  {
    return this.http.post(environment.apiurl + `/createUser`, user);
  }

  checkUsernameAvailability(username: User): Observable<any> {
    return this.http.post(environment.apiurl + `/checkUserNameAvailability`, username );
  }
}
