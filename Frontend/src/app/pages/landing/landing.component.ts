import {Component, OnInit} from '@angular/core';
import {HostListener} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestService} from '../../services/api/rest.service';
import {NzNotificationService} from 'ng-zorro-antd';


@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.sass']
})

@HostListener('window:scroll', ['$event'])


export class LandingComponent implements OnInit {

    isScrolled = false;
    contactFormSpinner = false;

    contactForm: FormGroup;


    constructor(private formBuilder: FormBuilder,
                private api: RestService,
                private notification: NzNotificationService) {
    }

    ngOnInit() {
        // reset scroll
        this.isScrolled = false;
        window.addEventListener('scroll', this.scroll, true); // third parameter

        this.contactForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required]],
        });
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
    }

    scroll = (event): void => {
        this.isScrolled = true; // set scrolled flag
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.contactForm.controls;
    }

    onSubmit() {
        this.contactFormSpinner = true; // set spinner
        // stop here if form is invalid
        if (this.contactForm.invalid) {
            this.contactFormSpinner = false; // reset spinner
            return;
        }

        // submit form
        this.api.submitContactForm(this.contactForm.value).subscribe(
            (res: any) => {
                this.contactFormSpinner = false; // reset spinner
                // show notification
                this.notification.config({
                    nzPlacement: 'bottomRight'
                });
                this.notification.create(
                    'success',
                    'Form submitted successfully',
                    'We have successfully received your request. We will contact you shortly. Thanks.'
                );
            },
            (err: any) => {
                this.contactFormSpinner = false; // reset spinner
                this.notification.create(
                    'warning',
                    'Oops! something went wrong',
                    'Please try again later.'
                );
            }
        );
    }
}
