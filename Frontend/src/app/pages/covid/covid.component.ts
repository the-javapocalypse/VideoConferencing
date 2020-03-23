import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestService} from '../../services/api/rest.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
    selector: 'app-covid',
    templateUrl: './covid.component.html',
    styleUrls: ['./covid.component.sass']
})
export class CovidComponent implements OnInit {

    suspectForm: FormGroup;
    spinner = false;

    constructor(private api: RestService,
                private formBuilder: FormBuilder,
                private notification: NzNotificationService) {
    }

    ngOnInit() {
        this.suspectForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            cnic: ['', [Validators.required]],
            dob: ['', [Validators.required]],
            address: ['', [Validators.required]],
            mobile: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            travel_history: ['', []],
            cough: ['', [Validators.required]],
            cough_started: [null, []],
            sore_throat: ['', [Validators.required]],
            sore_throat_started: [null, []],
            fever: ['', [Validators.required]],
            fever_started: [null, []],
            breath_shortness: ['', [Validators.required]],
            breath_shortness_started: [null, []],
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.suspectForm.controls;
    }

    register() {
        this.spinner = true;
        // stop here if form is invalid
        if (this.suspectForm.invalid) {
            this.spinner = false; // reset spinner
            return;
        }
        this.api.createCovid(this.suspectForm.value).subscribe(
            (res: any) => {
                this.spinner = false; // reset spinner
                // show notification
                this.notification.create(
                    'success',
                    'Registered successfully',
                    'Your application has been registered successfully'
                );
            },
            (err: any) => {
                console.log(err);
                this.spinner = false; // reset spinner
                // show notification
                this.notification.create(
                    'warning',
                    'Something went wrong',
                    'Please try again later'
                );
            }
        );
    }

}
