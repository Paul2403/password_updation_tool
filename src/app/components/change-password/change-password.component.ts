import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public currentPassword:any='';
  public showCurrentPassword: boolean = false;
  public showNewPassword: boolean = false;
  public showRetypeNewPassword:boolean = false;
  public newPassword:any='';
  public retypeNewPassword:any='';
  public weakPasswords:any;
 
  power:any=0;
  char:any='';
  upperCount:any='';
  lowerCount:any='';
  special:any='';
  digits:any='';
  errorMessage:any='';

  

  constructor() { }

  ngOnInit() {
   
    this.power = document.querySelector('#power-point');
    this.char = document.querySelector('#charNum');
    this.upperCount = document.querySelector('#upper_count');
    this.lowerCount = document.querySelector('#lower_count');
    this.special =document.querySelector('#special_count');
    this.digits=document.querySelector('#digits_count');
    this.errorMessage=document.querySelector('#banner');
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

  showPasswordStrength(object:any) {
    let point = 0;
    let value = this.newPassword;
    var maxLength = 50;
    var strLength = object.length;
    let widthPower = ['1%', '25%', '50%', '75%', '100%'];
    let colorPower = ['#D73F40', '#DC6551', '#F2B84F', '#BDE952', '#30CEC7'];

    if(value.length >= 12){
        let arrayTest = [
            /[0-9]/,
            /[a-z]/,
            /[A-Z]/,
            /[^0-9a-zA-Z]/
        ];
  

        arrayTest.forEach(item => {
            if(item.test(value)){
                point += 1;
            }
        });
    }

    this.power.style.width = widthPower[point];
    this.power.style.backgroundColor = colorPower[point];

    if(strLength > maxLength){
      this.char.innerHTML = '<span style="color: red;">'+strLength+' characters containing: </span>';
  }else{
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
    let colorPower = ['#D73F40', '#DC6551', '#F2B84F', '#BDE952', '#30CEC7'];
    // var errorMessage = document.getElementById("banner");
    let errorDetected = 0;
        if(value.length >= 12){
        let arrayTest = [
            /[0-9]/,
            /[a-z]/,
            /[A-Z]/,
            /[^0-9a-zA-Z]/
        ];
        arrayTest.forEach(item => {
          if(item.test(value)){
              point += 1;
          }
      });
    }
    for (const pwd of this.weakPasswords) {
      if (obj == pwd){
          point = 0;
          this.power.style.width = widthPower[point];
          this.power.style.backgroundColor = colorPower[point];
          errorDetected=errorDetected+1;
      }
  }
  if(errorDetected>0){
      this.errorMessage.style.display = "block";
  }
  else{
      this.errorMessage.style.display = "none";
  }
  }


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
