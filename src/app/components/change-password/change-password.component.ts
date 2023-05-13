import { Component, OnInit } from '@angular/core';
import { PassServicesService } from 'src/app/pass-services.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public currentPassword:any='';
  public email:any=''
  public twoFactor:any='';
  public showCurrentPassword: boolean = false;
  public showNewPassword: boolean = false;
  public showRetypeNewPassword:boolean = false;
  public newPassword:any='';
  public retypeNewPassword:any='';
  public weakPasswords:any;
  public credentialCheck:any;
  public twoFaModel:any=true;
  
  private subscriptionCollection: Subscription = new Subscription();
 
  power:any=0;
  char:any='';
  upperCount:any='';
  lowerCount:any='';
  special:any='';
  digits:any='';
  errMsg:any;
  otpScreen:boolean = true;
  showClose:boolean=true;
  optExpired:boolean=false;
  validOTP:boolean=true;
  headMsg:any='Two-Factor Authentication'
  errorMessage:any='';
  commonpsswd:any='';
  public passwordAuthForm = new FormGroup({
    fEmail: new FormControl('', [Validators.required, Validators.email]),
    fCurrentPassword: new FormControl('', Validators.required),
    fNewPassword: new FormControl('',Validators.required),
    fConfirmPassword: new FormControl('', Validators.required)
  });

  public tfA = new FormGroup({
    ftfA: new FormControl('',Validators.required)
  })

  

  constructor(private passService: PassServicesService,public formBuilder: FormBuilder,private router: Router) { }

  ngOnInit() {
   this.passwordAuthForm = new FormGroup({
    fEmail: new FormControl('', [Validators.required, Validators.email]),
    fCurrentPassword: new FormControl('', Validators.required),
    fNewPassword: new FormControl(''),
    fConfirmPassword: new FormControl('', Validators.required)
  });
   
    this.power = document.querySelector('#power-point');
    this.char = document.querySelector('#charNum');
    this.upperCount = document.querySelector('#upper_count');
    this.lowerCount = document.querySelector('#lower_count');
    this.special =document.querySelector('#special_count');
    this.digits=document.querySelector('#digits_count');
    this.commonpsswd=document.querySelector('#common_passwd');
    this.errorMessage=document.querySelector('#banner');
    this.twoFaModel= false;
    this.weakPasswords = [
      "Password1!",
      "Helloworld123!",
      "Qwerty1!",
      "P@ssw0rd",
      "Summer2021!",
      "Welcome1!",
      "Abc123!",
      "Football1!",
      "123456!",
      "Pa$$w0rd",
      "Letmein1!",
      "Hello123!",
      "Monkey1!",
      "Helloworld!23",
      "Dragon1!",
      "Starwars1!",
      "Batman1!",
      "Liverpool1!",
      "Superman1!",
      "Iloveyou1!",
      "Helloworld1!",
      "Winter2022!",
      "Password1",
    "Qwerty123",
    "Abc123456",
    "P@ssword1",
    "123456789a",
    "Welcome1",
    "Iloveyou1",
    "1234Abcd",
    "Password12",
    "Qwertyui1",
    "Monkey12",
    "Sunshine1",
    "Baseball1",
    "Football12",
    "Starwars1",
    "1234567aA",
    "Admin1234",
    "Football123",
    "1234Qwer",
    "Qwerty1234",
    "123456Abc",
    "Admin12345",
    "Password1234",
    "Letmein123",
    "123456789b",
    "Superman1",
    "123456789c",
    "Qwerty12345",
    "1234567Aa",
    "Letmein2018",
    "123456789d",
    "Trustno1",
    "Football1234",
    "Starwars123",
    "123456789f",
    "Qazwsx123",
    "Welcome1234",
    "1234567b",
    "1234AbcdE",
    "Letmein2019",
    "12345678Ab",
    "123456789i",
    "12345Abcde",
    "Admin123456",
    "Password12345",
    "Qwertyuiop123",
    "123456f",
    "12345Abcdef",
    "Admin1234567",
    "Qwerty123456",
    "123456789j",
    "12345AbcdEf",
    "1234567Bb",
    "Password1234567",
    "Qwertyuiop1234",
    "123456789k",
    "12345Abcdefg",
    "Pa$$w0rd!234",
    "Admin12345678",
    "Qwerty1234567",
    "1234567Cc",
    "12345AbcdEfg",
    "Admin123456789",
    "Qwertyuiop12345",
    "123456789l",
    "12345Abcdefgh",
    "Admin1234567890",
    "Qwerty12345678",
    "1234567Dd",
    "12345AbcdEfgh",
    "Admin12345678910",
    "Qwertyui123",
    "123456789m",
    "12345Abcdefghi",
    "Admin1234567891",
    "Qwerty12345678a",
    "1234567Ee",
    "12345AbcdEfghi",
    "Admin12345678912",
    "HellowWorld123!",
    "Qwertyuiop123456",
    "123456789n"
    ];
  }

  updatePsswordMain(){
    this.headMsg='Two-Factor Authentication';
    this.twoFactor='';
    this.optExpired=false;
    this.validOTP=true;
    this.twoFaModel = true;
    let otpParams={
      "email_id": this.passwordAuthForm.get('fEmail')?.value,
      
      };
      const createSubscription = this.passService.sendOTP(otpParams).subscribe(response => {
        // if(response.status == 200){
        //   this.credentialCheck = response.data.id;
        //   if(this.credentialCheck){
        //     this.updatePsswordMain();
        //   }
        // }
        // else{
  
        // }
      }, err => {
        console.log('error', err);
      
      });
      this.subscriptionCollection.add(createSubscription);
  }

  submitOTP(){
    let otpConfirmParams={
      "otp": this.twoFactor,
      "id": this.credentialCheck,
      "passwd":this.passwordAuthForm.get('fNewPassword')?.value
      };
      const createSubscription = this.passService.confirmOTP(otpConfirmParams).subscribe(response => {
        if(response.status == 200){
          this.headMsg='';
          this.showClose=false;
          this.otpScreen=false;
          this.optExpired=false;
          this.validOTP=true;
        }
        else if(response.status == 100){
          this.headMsg='OTP Expired';
          this.optExpired=true;
          this.validOTP=true;
        }
        else{
          this.headMsg='Two-Factor Authentication';
          this.optExpired=false;
          this.validOTP=false;
        }
        // if(response.status == 200){
        //   this.credentialCheck = response.data.id;
        //   if(this.credentialCheck){
        //     this.updatePsswordMain();
        //   }
        // }
        // else{
  
        // }
      }, err => {
        console.log('error', err);
      
      });
      this.subscriptionCollection.add(createSubscription);
  }

  goToHomePage(){
    window.location.reload();
  }

  updatePassword(){
      if(((this.passwordAuthForm.get('fEmail')?.value !== '' && this.passwordAuthForm.get('fEmail')?.value !== undefined && this.passwordAuthForm.get('fEmail')?.value !== null)) && ((this.passwordAuthForm.get('fCurrentPassword')?.value !== '' && this.passwordAuthForm.get('fCurrentPassword')?.value !== undefined && this.passwordAuthForm.get('fCurrentPassword')?.value !== null)) && ((this.passwordAuthForm.get('fNewPassword')?.value !== '' && this.passwordAuthForm.get('fNewPassword')?.value !== undefined && this.passwordAuthForm.get('fNewPassword')?.value !== null)) && ((this.passwordAuthForm.get('fConfirmPassword')?.value !== '' && this.passwordAuthForm.get('fConfirmPassword')?.value !== undefined && this.passwordAuthForm.get('fConfirmPassword')?.value !== null))){
        this.errorMessage.style.display = "none";
      if(this.passwordAuthForm.get('fNewPassword')?.value == this.passwordAuthForm.get('fConfirmPassword')?.value){
           this.errorMessage.style.display = "none";
           let passCheckParams={
              "email_id": this.passwordAuthForm.get('fEmail')?.value,
              "current_password": this.passwordAuthForm.get('fCurrentPassword')?.value,
          };
          const createSubscription = this.passService.getData(passCheckParams).subscribe(response => {
            if(response.status == 200){
              this.credentialCheck = response.data.id;
              console.log('CREDENTIAL CHECK',this.credentialCheck);
              if(this.credentialCheck){
                this.updatePsswordMain();
              }
            }
            else{
              this.errorMessage.style.display = "block";
              this.errMsg = 'Ivalid Current Password!';
            }
          }, err => {
            console.log('error', err);
          
          });
          this.subscriptionCollection.add(createSubscription);
      }
      else{
        this.errorMessage.style.display = "block";
        this.errMsg = 'Passwords do not match!';
      }
      }
      else{
        this.errorMessage.style.display = "block";
        this.errMsg = 'Please Enter All Fields!';
      }



   


    // this.service.getData().subscribe((response) => {
    //   console.log('Response from API is ', response)
    // }, (error)=>{
    //   console.log('Error is ', error);
    // })
  
  }

  showPasswordStrength(object:any) {
    let point = 0;
    let value = this.newPassword;
    var maxLength = 50;
    var strLength = object.length;
    let widthPower = ['1%', '25%', '50%', '75%', '100%'];
    let colorPower = ['#D73F40', '#DC6551', '#F2B84F', '30CEC7','#BDE952'];

    // if(value.length >= 10){
    //     let arrayTest = [
    //         /[0-9]/,
    //         /[a-z]/,
    //         /[A-Z]/,
    //         /[^0-9a-zA-Z]/
    //     ];
  

        // arrayTest.forEach(item => {
        //     if(item.test(value)){
        //         point += 1;
        //     }
        // });
        if(this.hasUppercase(object) == true){
          if(this.hasLowercase(object) == true){
            point += 1;
          }
        }
        if(this.hasNumbers(object) == true){
          point += 1;
        }
        if(this.hasSpecialCharacters(object) == true){
          point += 1;
        }
        if(value.length>=10){
          point += 1;
        }
    // }

    this.power.style.width = widthPower[point];
    this.power.style.backgroundColor = colorPower[point];

    if(strLength > maxLength){
      this.char.innerHTML = '<span style="color: red;">'+strLength+' characters containing: </span>';
    }
    this.char.innerHTML = strLength+' characters containing: ';
      if(this.hasUppercase(object) == true){
          this.upperCount.style.color = '#72D2CB';
      }
      else{
          this.upperCount.style.color = '#5b6262'
      }

      if(this.hasLowercase(object)==true){

          this.lowerCount.style.color = '#72D2CB';
      }
      else{
        this.lowerCount.style.color = '#5b6262'
      }

      if(this.hasNumbers(object)==true){

          this.digits.style.color = '#72D2CB';
      }
      else{
          this.digits.style.color = '#5b6262';
      }

      if(this.hasSpecialCharacters(object)==true){

          this.special.style.color = '#72D2CB';
      }
      else{
          this.special.style.color = '#5b6262';
      }
  
  this.commonPasswordCheck(object);

    
  }

  countChars(obj:any) {
   console.log('OBJECT',obj);
   this.showPasswordStrength(obj);
  }
  
  hasUppercase(str: string): boolean {
    return /[A-Z]/.test(str);
  }
  
  hasLowercase(str: string): boolean {
    return /[a-z]/.test(str);
  }
  
  hasNumbers(str: string): boolean {
    return /[0-9]/.test(str);
  }
  
  hasSpecialCharacters(str: string): boolean {
    return /[^0-9a-zA-Z]/.test(str);
  }
  
  commonPasswordCheck(obj: any) {
    let point = 0;
    let value = this.newPassword;
    let widthPower = ['1%', '25%', '50%', '75%', '100%'];
    let colorPower = ['#D73F40', '#DC6551', '#F2B84F', '30CEC7','#BDE952'];
    // var errorMessage = document.getElementById("banner");
    let errorDetected = 0;
    if(this.hasUppercase(obj) == true){
      if(this.hasLowercase(obj) == true){
        point += 1;
      }
    }
    if(this.hasNumbers(obj) == true){
      point += 1;
    }
    if(this.hasSpecialCharacters(obj) == true){
      point += 1;
    }
    if(value.length>=10){
      point += 1;
    }
    //     if(value.length >= 10){
    //     let arrayTest = [
    //         /[0-9]/,
    //         /[a-z]/,
    //         /[A-Z]/,
    //         /[^0-9a-zA-Z]/
    //     ];
    //     arrayTest.forEach(item => {
    //       if(item.test(value)){
    //           point += 1;
    //       }
    //   });
    // }
    for (const pwd of this.weakPasswords) {
      if (obj == pwd){
          point = 0;
          this.power.style.width = widthPower[point];
          this.power.style.backgroundColor = colorPower[point];
          errorDetected=errorDetected+1;
      }
  }
  if(errorDetected>0){
      this.commonpsswd.style.color = '#fb2035';
    }
    else{
      this.commonpsswd.style.color = '#5b6262';
    }
  }
  // else{
  //     // this.errorMessage.style.display = "none";
  // }
  


  togglePasswordType(passType: any){
      if(passType==1){
        this.showCurrentPassword = !this.showCurrentPassword;
      }
      else if(passType==2){
        this.showNewPassword = !this.showNewPassword;
      }
      else{
        this.showRetypeNewPassword = !this.showRetypeNewPassword;
      }
  }

  // verifyIfEqual(){
  //   if()
  // }

}
