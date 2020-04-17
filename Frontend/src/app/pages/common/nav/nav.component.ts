import {Component, OnInit, Input} from '@angular/core';
import {HostListener} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.sass']
})

@HostListener('window:scroll', ['$event'])

export class NavComponent implements OnInit {

    @Input() useCaseSection: HTMLElement;
    @Input() landingSection: HTMLElement;
    @Input() featuresSection: HTMLElement;
    @Input() contactSection: HTMLElement;

    isScrolled = false;
    isLoggedIn = false;

    constructor(private viewportScroller: ViewportScroller,
                private storage: LocalStorageService,
                private router: Router) {
    }

    ngOnInit() {
        // reset scroll
        this.isScrolled = false;
        window.addEventListener('scroll', this.scroll, true); // third parameter
        this.isLoggedIn = this.storage.isLoggedIn();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
    }

    scroll = (event): void => {
        this.isScrolled = true; // set scrolled flag on scroll event
    }

    scrollTo(el: HTMLElement) {
        el.scrollIntoView({behavior: 'smooth'});
    }


    logout() {
        this.storage.clearAll();
        this.router.navigate(['landing']);
    }
}
