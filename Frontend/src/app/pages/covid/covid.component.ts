import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../../services/api/rest.service";

@Component({
    selector: 'app-covid',
    templateUrl: './covid.component.html',
    styleUrls: ['./covid.component.sass']
})
export class CovidComponent implements OnInit {

    suspectForm: FormGroup;
    spinner = false;

    constructor(private api: RestService,
                private formBuilder: FormBuilder) {
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
        console.log(this.suspectForm.value);
    }

}
