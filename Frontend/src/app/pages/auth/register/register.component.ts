import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RestService} from '../../../services/api/rest.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

    @Output() loginForm: EventEmitter<any> = new EventEmitter<any>();

    // control variables
    hidePassword = true;
    spinner = false;

    // Error|success variable
    emailExistsErr = false;

    registerForm: FormGroup;

    constructor(private api: RestService,
                private formBuilder: FormBuilder,
                private notification: NzNotificationService) {
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerForm.controls;
    }


    onSubmit() {
        this.spinner = true; // show spinner
        this.emailExistsErr = false; // reset error

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            this.spinner = false; // hide spinner
            return;
        }

        this.api.createUser(this.registerForm.value).subscribe((res: any) => {
                console.log(res);
                this.spinner = false; // hide spinner
                // show notification
                this.notification.blank(
                    'Registered successfully',
                    'We have sent you an email. Click on the link present in the email to activate your account.'
                );
            },
            (err: any) => {
                this.spinner = false; // hide spinner
                this.emailExistsErr = true; // show error
            }
        );
    }


    login() {
        this.loginForm.emit();
    }


}
