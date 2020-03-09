import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {

    isLoginScreen = true; // show login form by default
    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {

        // Get param from url to toggle login/register screen
        if (this.route.snapshot.paramMap.get('action').toLowerCase() === 'login') {
            this.isLoginScreen = true;
        } else {
            this.isLoginScreen = false;
        }
    }

}
