import {Component, OnInit, Input} from '@angular/core';
import {HostListener} from '@angular/core';
import { ViewportScroller } from '@angular/common';


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

  constructor(private viewportScroller: ViewportScroller) {
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
    this.isScrolled = true; // set scrolled flag on scroll event
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
}
