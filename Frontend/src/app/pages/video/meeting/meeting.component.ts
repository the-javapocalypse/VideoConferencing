import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-meeting',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.sass']
})
export class MeetingComponent implements OnInit {

    constructor() {
    }

    isCollapsed = false;

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    ngOnInit() {
    }

}
