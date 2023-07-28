import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../model/AuthModel';

@Injectable({
  providedIn: 'root'
})
export class UserNameCheckService {

  constructor(private http: HttpClient) { }
  
  checkUsernameAvailability(username: Auth): Observable<any> {
    return this.http.post(environment.apiurl + `/checkUserNameAvailability`, username );
  }
}
