import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RestService} from '../../../services/api/rest.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {

    @Output() registerForm: EventEmitter<any> = new EventEmitter<any>();


    // control variables
    hidePassword = true;
    spinner = false;

    loginForm: FormGroup;


    constructor(private api: RestService,
                private formBuilder: FormBuilder,
                private storage: LocalStorageService,
                private router: Router) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.spinner = true; // show spinner

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            this.spinner = false; // hide spinner
            return;
        }

        this.api.loginUser(this.loginForm.value).subscribe((res: any) => {
                this.storage.storeJWT(res.body.token, res.body.user);
                this.spinner = false; // hide spinner
                this.router.navigate(['/home']);
            },
            (err: any) => {
                this.spinner = false; // hide spinner
                this.loginForm.controls.email.setErrors({serverError: err.error.message});
                this.loginForm.controls.password.setErrors({serverError: err.error.message});
            }
        );
    }


    register() {
        this.registerForm.emit();
    }
}
