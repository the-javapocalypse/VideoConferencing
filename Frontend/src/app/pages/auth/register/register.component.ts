import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RestService} from '../../../services/api/rest.service';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

    @Output() loginForm: EventEmitter<any> = new EventEmitter<any>();

    // control variables
    hidePassword = true;

    // error variables
    nameError = false;
    passwordError = false;
    emailError = false;

    constructor(private api: RestService) {
    }

    ngOnInit() {
    }

    login() {
        this.loginForm.emit();
    }

    register(data) {

    }

}
