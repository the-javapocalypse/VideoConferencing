import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

    // control variables
    hidePassword = true;

    // error variables
    passwordErr = false;
    emailEmptyErr = false;
    emailTakenErr = false;

    constructor() {
    }

    ngOnInit() {
    }


    login(data) {
        console.log(data);
        // Reset Errors
    }

}
