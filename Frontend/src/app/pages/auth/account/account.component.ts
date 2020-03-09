import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';


@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {

    isLoginScreen = false; // show login form by default
    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    showLoginScreen(toggle) {
        this.isLoginScreen = toggle;
    }

}
