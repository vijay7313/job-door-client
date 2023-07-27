import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/UserModel';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    userName: '',
    email: '',
    password: '',
    fullName: '',
    role: '',
    skills: '',
    education: '',
    experience: '',
    mobileNo: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  }
  responseForUserNameAvailability:  boolean = false;
  userName!: FormGroup;
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  userAvailability_step = false;
  personal_step = false;
  address_step = false;
  education_step = false;
  step = 1;
  passwordMatchValidator(group: FormGroup) {
    const createPassword = group.get('createPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return createPassword === confirmPassword ? null : { passwordMismatch: true };
  }
  constructor(private formBuilder: FormBuilder, private router: Router,private registerService:RegisterService) { }
  ngOnInit() {
    this.userName = this.formBuilder.group({
      userName: ['', Validators.required]
  });
        this.personalDetails = this.formBuilder.group({
          fullName: ['', Validators.required],
            email: ['', Validators.required],
          phone: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          role: ['', Validators.required] // Adding role field with Validators.required
    } );

        this.addressDetails = this.formBuilder.group({
            city: ['', Validators.required],
          address: ['', Validators.required],
          state: ['', Validators.required],
            pincode: ['',Validators.required]
        });
        this.educationalDetails = this.formBuilder.group({
          education: ['', Validators.required],
          skills: ['', Validators.required],
          experience: ['',Validators.required]
        });
  }
  get userNameAvailability(){ return this.userName.controls; }
  get personal() { return this.personalDetails.controls; }
  get education() { return this.educationalDetails.controls; }
  get address() { return this.addressDetails.controls; }
  async next() {
    if(this.step==1){
      this.userAvailability_step = true;

      if (this.userName.invalid) {

        return
      }
      const val = this.userName.value;
      this.user.userName = val.userName;
      console.log("In")
      if (await this.userNameAvailabilityCheck(this.user))
      {
        this.step++
        }
}

    if(this.step==2){
          this.personal_step = true;
      if (this.personalDetails.invalid) { return }
          this.step++
    }
    if (this.step == 3) {
        this.address_step = true;
        if (this.addressDetails.invalid) { return }
            this.step++;
    }
  }
  previous(){
    this.step--
    if(this.step==1){
      this.userAvailability_step = false;
    }
    if(this.step==2){
      this.personal_step = false;
    }
    if(this.step==3){
      this.education_step = false;
    }
  }
  submit() {
    const userNamevalue = this.userName.value;
    const personalDetailsValue = this.personalDetails.value;
    const addressDetailsValue = this.addressDetails.value;
    const educationalDetailsValue = this.educationalDetails.value;
    this.user.userName = userNamevalue.userName;
    this.user.fullName = personalDetailsValue.fullName;
    this.user.email = personalDetailsValue.email;
    this.user.mobileNo = personalDetailsValue.phone;
    this.user.role = personalDetailsValue.role;
    this.user.password = personalDetailsValue.password;
    this.user.address = addressDetailsValue.address;
    this.user.city = addressDetailsValue.city;
    this.user.state = addressDetailsValue.state;
    this.user.pincode = addressDetailsValue.pincode;
    this.user.education = educationalDetailsValue.education;
    this.user.skills = educationalDetailsValue.skills;
    this.user.experience = educationalDetailsValue.experience;
    console.log(this.user)
    if(this.step==4){
      this.education_step = true;

      if (this.educationalDetails.invalid) { return }
      this.registerService.register(this.user).subscribe(user =>
        {
          if (user.result == "success")
          {
            alert('"'+this.user.userName+'" use this as your user Name')
            console.log("ok")
           this.router.navigateByUrl('/');
          }
        }
        );
    }
  }

  async userNameAvailabilityCheck(username: any): Promise<boolean> {
    try {
      const response = await this.registerService.checkUserNameAvailability(username).toPromise();

      if (response) {
        this.responseForUserNameAvailability = response;
      } else {
        this.responseForUserNameAvailability = false;
      }

      return this.responseForUserNameAvailability;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
