import {Component, OnInit} from '@angular/core';
import {HostListener} from '@angular/core';


@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.sass']
})

@HostListener('window:scroll', ['$event'])


export class LandingComponent implements OnInit {

    isScrolled = false;

    constructor() {
    }

    ngOnInit() {
        // reset scroll
        this.isScrolled = false;
        window.addEventListener('scroll', this.scroll, true); //third parameter
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
    }

    scroll = (event): void => {
      this.isScrolled = true; // set scrolled flad
    }

}
