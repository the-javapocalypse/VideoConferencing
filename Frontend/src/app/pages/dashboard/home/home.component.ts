import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {RestService} from '../../../services/api/rest.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

    // User info from local storage
    userInfo = {};

    // data variables
    createRoomName = '';

    // control flags
    creatingRoomFLAG = false;

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 4
            }
        },
        nav: true
    };

    constructor(private storage: LocalStorageService,
                private api: RestService,
                private notification: NzNotificationService) {
    }

    ngOnInit() {
        this.userInfo = this.storage.retrieveJWT().userInfo;
    }

    // Create Room
    createRoom() {
        this.creatingRoomFLAG = true; // set flag
        this.api.createRoom({title: this.createRoomName}).subscribe(
            (res: any) => {
                this.creatingRoomFLAG = false; // reset flag
                // show notification
                this.notification.create(
                    'success',
                    'Room ' + res.body.message.toLowerCase(),
                    ''
                );
            },
            (err: any) => {
                this.creatingRoomFLAG = false; // reset flag
                // show notification
                this.notification.create(
                    'warning',
                    'Oops! Something went wrong',
                    ''
                );
            }
        );
    }
}
