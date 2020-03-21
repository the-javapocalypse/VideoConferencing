import {Component, OnInit} from '@angular/core';
import {HostListener} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


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


    constructor(private formBuilder: FormBuilder) {
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
    }
}
