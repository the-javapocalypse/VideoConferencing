import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

    @Output() loginForm: EventEmitter<any> = new EventEmitter<any>();

    // control variables
    hidePassword = true;

    constructor() {
    }

    ngOnInit() {
    }

    login() {
        this.loginForm.emit();
    }

    register(data) {

    }

}
