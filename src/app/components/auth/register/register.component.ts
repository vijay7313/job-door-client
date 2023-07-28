import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { User } from 'src/app/model/UserModel'
import { RegisterService } from 'src/app/service/register.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  step = 1
  username: string = ''
  usernameAvailable: boolean | null = null
  showResult: boolean = false
  showJobSeekerForm: boolean = false
  showEmployerForm: boolean = false
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
    pincode: '',
    companyName: '',
    industry: '',
    employeesCount: '',
    foundedYear: '',
  }
  responseForUserNameAvailability: boolean = false
  userName!: FormGroup
  personalDetails!: FormGroup
  addressDetails!: FormGroup
  educationalDetails!: FormGroup
  userAvailability_step = false
  personal_step = false
  address_step = false
  education_step = false

  passwordMatchValidator(group: FormGroup) {
    const createPassword = group.get('createPassword')?.value
    const confirmPassword = group.get('confirmPassword')?.value

    return createPassword === confirmPassword
      ? null
      : { passwordMismatch: true }
  }
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.personalDetails = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    })

    this.addressDetails = this.formBuilder.group({
      city: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
    })
    this.educationalDetails = this.formBuilder.group({
      education: ['', Validators.required],
      skills: ['', Validators.required],
      experience: ['', Validators.required],
      companyname: ['', Validators.required],
      industry: ['', Validators.required],
      employeesCount: ['', Validators.required],
      foundedYear: ['', Validators.required],
    })
  }
  get personal() {
    return this.personalDetails.controls
  }
  get education() {
    return this.educationalDetails.controls
  }
  get address() {
    return this.addressDetails.controls
  }
  async next() {
    if (this.step == 1) {
      this.address_step = false
      if (this.personalDetails.invalid) {
        return
      }
      this.step++
    }
    if (this.step == 2) {
      this.address_step = true
      if (this.personalDetails.value.role == 'job_seeker')
        this.showJobSeekerForm = true
      if (this.personalDetails.value.role == 'employer')
        this.showEmployerForm = true
      if (this.addressDetails.invalid) {
        return
      }
      this.step++
    }
  }
  previous() {
    this.step--
    if (this.step == 1) {
      this.personal_step = false
    }
    if (this.step == 2) {
      this.education_step = false
    }
  }
  submit() {
    const personalDetailsValue = this.personalDetails.value
    const addressDetailsValue = this.addressDetails.value
    const educationalDetailsValue = this.educationalDetails.value
    this.user.userName = personalDetailsValue.userName
    this.user.fullName = personalDetailsValue.fullName
    this.user.email = personalDetailsValue.email
    this.user.mobileNo = personalDetailsValue.phone
    this.user.role = personalDetailsValue.role
    this.user.password = personalDetailsValue.password
    this.user.address = addressDetailsValue.address
    this.user.city = addressDetailsValue.city
    this.user.state = addressDetailsValue.state
    this.user.pincode = addressDetailsValue.pincode
    if (this.showJobSeekerForm) {
      this.user.education = educationalDetailsValue.education
      this.user.skills = educationalDetailsValue.skills
      this.user.experience = educationalDetailsValue.experience
    }
    if (this.showEmployerForm) {
      this.user.companyName = educationalDetailsValue.companyName
      this.user.industry = educationalDetailsValue.industry
      this.user.foundedYear = educationalDetailsValue.foundedYear
      this.user.employeesCount = educationalDetailsValue.employeesCount
    }
    if (this.step == 3) {
      this.education_step = true

      this.registerService.register(this.user).subscribe((response) => {
        if (response.apiStatus.statusCode == '200') {
          this.toastr.success('Registration successful!', 'Success', {
            timeOut: 1000,
            progressBar: true,
            progressAnimation: 'increasing',
          })
          this.router.navigateByUrl('/')
        }
      })
    }
  }

  onUsernameChange(): void {
    const value = this.personalDetails.value;
    if (!(value.userName.length > 3)) {
      return;
    }
    if (value) {
      this.user.userName = value.userName
      this.usernameAvailable = null
      this.registerService.checkUsernameAvailability(this.user).subscribe(
        (response) => {
          this.usernameAvailable = response
          this.showResult = true
        },
        (error) => {
          console.error('Error checking username availability:', error)
        },
      )
    } else {
      this.showResult = false
      this.usernameAvailable = null
    }
  }
}
