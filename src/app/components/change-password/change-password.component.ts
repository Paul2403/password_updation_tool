import { Component, OnInit } from '@angular/core';
import { PassServicesService } from 'src/app/pass-services.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [MessageService]
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
  public timetoCrack:any='Instantly';
  public timetoCrackColor:any='red';
  public showTimetoCrack:boolean = true;
  
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

  //Form Validation for the Page
  public passwordAuthForm = new FormGroup({
    fEmail: new FormControl('', [Validators.required, Validators.email]),
    fCurrentPassword: new FormControl('', Validators.required),
    fNewPassword: new FormControl('',Validators.required),
    fConfirmPassword: new FormControl('', Validators.required)
  });

  //Form Validation for the OTP Form
  public tfA = new FormGroup({
    ftfA: new FormControl('',Validators.required)
  })

  

  constructor(private passService: PassServicesService,public formBuilder: FormBuilder,private router: Router,private messageService: MessageService) { }

  ngOnInit() {
    //Password Crack time initial values
    this.timetoCrack='Instantly';
    this.timetoCrackColor = 'red';

    //Form Validation for the Page
    this.passwordAuthForm = new FormGroup({
    fEmail: new FormControl('', [Validators.required, Validators.email]),
    fCurrentPassword: new FormControl('', Validators.required),
    fNewPassword: new FormControl(''),
    fConfirmPassword: new FormControl('', Validators.required)
  });
   
    //HTML Elements are being stored as variables
    this.power = document.querySelector('#power-point');
    this.char = document.querySelector('#charNum');
    this.upperCount = document.querySelector('#upper_count');
    this.lowerCount = document.querySelector('#lower_count');
    this.special =document.querySelector('#special_count');
    this.digits=document.querySelector('#digits_count');
    this.commonpsswd=document.querySelector('#common_passwd');
    this.errorMessage=document.querySelector('#banner');
    this.twoFaModel= false;

    //Initally we are fetching the common passwords from the database
    this.getWeakPasswords();
 
  }

  //Function to get the weak passwords from the database
  getWeakPasswords(){
      let params = {

      };
      const createSubscription = this.passService.getWeakPasswords(params).subscribe(response => {
        if(response.status == 200){
            this.weakPasswords = response.data;
        }
        else{
          // console.log(response);
        }
      }, err => {
        console.log('error', err);
      
      });
      this.subscriptionCollection.add(createSubscription);
  }


  //Function to send OTP 
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
      }, err => {
        console.log('error', err);
      
      });
      this.subscriptionCollection.add(createSubscription);
  }


  //Final function to submit the given recieved OTP and update the password of the user
  submitOTP(){
    let finalCrypt =  this.convertToSHA256(this.newPassword);
    let otpConfirmParams={
      "otp": this.twoFactor,
      "id": this.credentialCheck,
      "passwd":finalCrypt
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
      }, err => {
        console.log('error', err);
      
      });
      this.subscriptionCollection.add(createSubscription);
  }

  //Function to refresh the page after each updation happens
  goToHomePage(){
    window.location.reload();
  }

  //Hashing the Password
  encryptText(data:string){
    const key = '34532';
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const plaintext = data;
    const ciphertext = CryptoJS.AES.encrypt(plaintext, key, { iv, padding: CryptoJS.pad.NoPadding }).toString();
    return ciphertext;
  }

  //Converting the password to SHA256 Hash code
  convertToSHA256(code:any){
    const salt = '@!VVlg2020Cd!@';
    const hashedValue = SHA256(code + salt);
    let encryptText = hashedValue.toString();
    return encryptText;
    
  }
  
  //The Function call to check if password already exists, if its already used password among the last 5 passwords and to send the OTP
  updatePassword(){
      if(((this.passwordAuthForm.get('fEmail')?.value !== '' && this.passwordAuthForm.get('fEmail')?.value !== undefined && this.passwordAuthForm.get('fEmail')?.value !== null)) && ((this.passwordAuthForm.get('fCurrentPassword')?.value !== '' && this.passwordAuthForm.get('fCurrentPassword')?.value !== undefined && this.passwordAuthForm.get('fCurrentPassword')?.value !== null)) && ((this.passwordAuthForm.get('fNewPassword')?.value !== '' && this.passwordAuthForm.get('fNewPassword')?.value !== undefined && this.passwordAuthForm.get('fNewPassword')?.value !== null)) && ((this.passwordAuthForm.get('fConfirmPassword')?.value !== '' && this.passwordAuthForm.get('fConfirmPassword')?.value !== undefined && this.passwordAuthForm.get('fConfirmPassword')?.value !== null))){
        this.errorMessage.style.display = "none";
      if(this.passwordAuthForm.get('fNewPassword')?.value == this.passwordAuthForm.get('fConfirmPassword')?.value){
          if(this.newPassword.length >=10 && this.hasNumbers(this.newPassword)==true && this.hasUppercase(this.newPassword)==true && this.hasLowercase(this.newPassword)==true && this.hasSpecialCharacters(this.newPassword)==true){
            this.errorMessage.style.display = "none";
            let finalCrypt =  this.convertToSHA256(this.currentPassword);
            let finalyCrypt1 = this.convertToSHA256(this.newPassword);
              let passCheckParams={
                 "email_id": this.passwordAuthForm.get('fEmail')?.value,
                 "current_password": finalCrypt,
                 "typedPass": finalyCrypt1
             };
             const createSubscription = this.passService.getData(passCheckParams).subscribe(response => {
               if(response.status == 200){
                 this.credentialCheck = response.data;
                 if(this.credentialCheck){
                   this.updatePsswordMain();
                 }
               }
               else if(response.status == 300){
                this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: response.data});
                //  this.errorMessage.style.display = "block";
                //  this.errMsg = response.data;
               }
               else{
                this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: 'Ivalid Current Password!'});
                //  this.errorMessage.style.display = "block";
                //  this.errMsg = 'Ivalid Current Password!';
               }
             }, err => {
               console.log('error', err);
             
             });
             this.subscriptionCollection.add(createSubscription);
          }
          else{
            this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: 'Passwords must be atleast 10 characters, with a combination of Uppercase, Lowercase, Symbols and Numbers!'});
            // this.errorMessage.style.display = "block";
            // this.errMsg = 'Passwords must contain a combination of Uppercase, LowerCase, Symbols and Numbers!';
          }
          
      }
      else{
        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: 'Passwords do not match!'});
        // this.errorMessage.style.display = "block";
        // this.errMsg = 'Passwords do not match!';
      }
      }
      else{
        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: 'Please Enter All Fields!'});
        // this.errorMessage.style.display = "block";
        // this.errMsg = 'Please Enter All Fields!';
      }
  }

  //Random Password Generator
  generatePassword(){
    // const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    // let passLength = 15
    // let password = '';
    // for (let i = 0; i < passLength; i++) {
    //   const randomIndex = Math.floor(Math.random() * charset.length);
    //   password += charset[randomIndex];
    // }
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    const passLength = 15;
    let password = '';
    let includesNumber = false;
  
    while (password.length < passLength || !includesNumber) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      const randomChar = charset[randomIndex];
      password += randomChar;
      includesNumber = includesNumber || /\d/.test(randomChar);
    }
    this.newPassword = password;
    
  }

  
  //Function to calculate the time to crack the password
  timeToCrackPassword1(value:any){
    //condition to check if the password has numbers, uppercase, lowercase and symbols
    if(this.hasNumbers(value) == true && this.hasUppercase(value) == true && this.hasLowercase(value)==true && this.hasSpecialCharacters(value)==true){
      if(this.newPassword.length < 6){
        this.timetoCrack='Instantly';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 6){
        this.timetoCrack='5 secs';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 7){
        this.timetoCrack='6 min';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 8){
        this.timetoCrack='8 hours';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 9){
        this.timetoCrack='3 weeks';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 10){
        this.timetoCrack='5 years';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 11){
        this.timetoCrack='400 years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 12){
        this.timetoCrack='34k years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 13){
        this.timetoCrack='2m years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 14){
        this.timetoCrack='200m years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 15){
        this.timetoCrack='15bn years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 16){
        this.timetoCrack='1tn years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 17){
        this.timetoCrack='93tn years';
        this.timetoCrackColor = 'green';
      }
      else{
        this.timetoCrack='7qd years';
        this.timetoCrackColor = 'green';
      }
    }
    //condition to check if the password has numbers, uppercase and lowercase 
    else if(this.hasNumbers(value) == true && this.hasUppercase(value) == true && this.hasLowercase(value)==true){
      if(this.newPassword.length < 6){
        this.timetoCrack='Instantly';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 6){
        this.timetoCrack='1 sec';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 7){
        this.timetoCrack='1 min';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 8){
        this.timetoCrack='1 hour';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 9){
        this.timetoCrack='3 days';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 10){
        this.timetoCrack='7 months';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 11){
        this.timetoCrack='41 years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 12){
        this.timetoCrack='2k years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 13){
        this.timetoCrack='100k years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 14){
        this.timetoCrack='9m years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 15){
        this.timetoCrack='600m years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 16){
        this.timetoCrack='37bn years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 17){
        this.timetoCrack='2tn years';
        this.timetoCrackColor = 'green';
      }
      else{
        this.timetoCrack='100tn years';
        this.timetoCrackColor = 'green';
      }
    }
    //condition to check if the password has uppercase and lowercase 
    else if(this.hasUppercase(value) == true && this.hasLowercase(value)==true){
      if(this.newPassword.length < 7){
        this.timetoCrack='Instantly';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 7){
        this.timetoCrack='25 secs';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 8){
        this.timetoCrack='22 mins';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 9){
        this.timetoCrack='19 hours';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 10){
        this.timetoCrack='1 month';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 11){
        this.timetoCrack='5 years';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 12){
        this.timetoCrack='300 years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 13){
        this.timetoCrack='16k years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 14){
        this.timetoCrack='800k years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 15){
        this.timetoCrack='43m years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 16){
        this.timetoCrack='2bn years';
        this.timetoCrackColor = 'green';
      }
      else if(this.newPassword.length == 17){
        this.timetoCrack='100bn years';
        this.timetoCrackColor = 'green';
      }
      else{
        this.timetoCrack='6tn years';
        this.timetoCrackColor = 'green';
      }
    }
    //condition to check if the password has numbers
    else if(this.hasNumbers(value) == true){
      if(this.newPassword.length<11){
        this.timetoCrack='Instantly';
        this.timetoCrackColor = 'red';
      }
      else if (this.newPassword.length==11){
        this.timetoCrack='2 secs';
        this.timetoCrackColor = 'red';
      }
      else if (this.newPassword.length == 12){
        this.timetoCrack='25 secs';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 13){
        this.timetoCrack='4 mins';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 14){
        this.timetoCrack='41 mins';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 15){
        this.timetoCrack='6 hours';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 16){
        this.timetoCrack='2 days';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 17){
        this.timetoCrack='4 weeks';
        this.timetoCrackColor = 'orange';
      }
      else{
        this.timetoCrack='9 months';
        this.timetoCrackColor = 'orange';
      }
    }
    //condition to check if the password has lowercase 
    else if(this.hasLowercase(value)==true){
      if(this.newPassword.length < 8){
        this.timetoCrack='Instantly';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 8){
        this.timetoCrack='5 secs';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 9){
        this.timetoCrack='2 mins';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 10){
        this.timetoCrack='58 mins';
        this.timetoCrackColor = 'red';
      }
      else if(this.newPassword.length == 11){
        this.timetoCrack='1 day';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 12){
        this.timetoCrack='3 weeks';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 13){
        this.timetoCrack='1 year';
        this.timetoCrackColor = 'orange';
      }
      else if(this.newPassword.length == 14){
        this.timetoCrack='51 years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 15){
        this.timetoCrack='1k years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 16){
        this.timetoCrack='34 years';
        this.timetoCrackColor = 'yellow';
      }
      else if(this.newPassword.length == 17){
        this.timetoCrack='800k years';
        this.timetoCrackColor = 'yellow';
      }
      else{
        this.timetoCrack='23m years';
        this.timetoCrackColor = 'green';
      }
    }
    else{
      this.timetoCrack='Instantly';
      this.timetoCrackColor = 'red';
    }
  }

  //Function to calculate the password strength
  showPasswordStrength(object:any) {
    let point = 0;
    let value = this.newPassword;
    var maxLength = 50;
    var strLength = object.length;
    let widthPower = ['1%', '25%', '50%', '75%', '100%'];
    let colorPower = ['#D73F40', '#DC6551', '#F2B84F', '30CEC7','#BDE952'];

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

      this.timeToCrackPassword1(this.newPassword);
      this.commonPasswordCheck(object);
  }

//function call to calculate the time to crack the password
  timeToCrackPassword(password:any){
    
      const characterPool = {
        lowercase: 26,
        uppercase: 26,
        numbers: 10,
        symbols: 33
      };
    
      let possibleCharacters = 0;
    
      if (/[a-z]/.test(password)) {
        possibleCharacters += characterPool.lowercase;
      }
      if (/[A-Z]/.test(password)) {
        possibleCharacters += characterPool.uppercase;
      }
      if (/[0-9]/.test(password)) {
        possibleCharacters += characterPool.numbers;
      }
      if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)) {
        possibleCharacters += characterPool.symbols;
      }
    
      const passwordLength = password.length;
      const possibleCombinations = Math.pow(possibleCharacters, passwordLength);
      const timeToCrack = possibleCombinations / (2e9 * 3600); // Assuming 2 billion (2e9) password attempts per second
    
    
      
       return timeToCrack.toFixed(2) + ' hours'; // Estimated time to crack in hours
  }


  //function to count the characters in the string
  countChars(obj:any) {
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
  
  //Function call to compare if the typed password is similar to the common password fetched from the database
  commonPasswordCheck(obj: any) {
    let point = 0;
    let value = this.newPassword;
    let widthPower = ['1%', '25%', '50%', '75%', '100%'];
    let colorPower = ['#D73F40', '#DC6551', '#F2B84F', '30CEC7','#BDE952'];
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
    for (const pwd of this.weakPasswords) {
      if (obj == pwd.passwd){
          point = 0;
          this.power.style.width = widthPower[point];
          this.power.style.backgroundColor = colorPower[point];
          errorDetected=errorDetected+1;
      }
  }
  if(errorDetected>0){
      this.commonpsswd.style.color = '#fb2035';
      this.timetoCrack='Instantly';
      this.timetoCrackColor = 'red';
    }
    else{
      this.commonpsswd.style.color = '#5b6262';
    }
  }


  //Function call to show and hide password on the text field
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



}
