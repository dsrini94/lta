import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() userId: string = null;
  @Input() password: string = null;
  @Input() location:string = null;
  msg: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(): void {

    console.log(this.userId,this.password,this.location);

    if(this.userId!=null || this.password!=null)
      this.router.navigate(['/dashboard/'this.userId]);
    else
      this.msg = "Please Fill all the Fields.";
  }
}
