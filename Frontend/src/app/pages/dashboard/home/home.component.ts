import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {RestService} from '../../../services/api/rest.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Router} from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

    // domain name form env
    domain = '';
    // User info from local storage
    userInfo = {
        id: undefined,
        name: undefined,
        email: undefined,
        role: undefined
    };

    // data variables
    createRoomName = '';
    allRooms: any;

    // control flags
    creatingRoomFLAG = false;

    // Owl Carousel for Rooms
    customOptions: OwlOptions = {
        loop: false,
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
                items: 3
            }
        },
        nav: true
    };

    constructor(private storage: LocalStorageService,
                private api: RestService,
                private notification: NzNotificationService,
                private message: NzMessageService,
                private router: Router,
    ) {
    }

    ngOnInit() {
        this.userInfo = this.storage.retrieveJWT().userInfo;
        this.getRooms();
        this.domain = environment.domain;
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

    // Get rooms of user
    getRooms() {
        this.api.getRooms().subscribe(
            (res: any) => {
                this.allRooms = res.body;
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    // Show toast
    showToast(e) {
        this.message.info('Invitation link copied');
    }


    // Format URL encoding
    formatURL(url) {
        return url.replace(/\//g, '%2F');
    }

    // Open tab in new url
    openInNewTab(digest) {
        // Converts the route into a string that can be used /startMeeting/{{formatURL(room.digest)}}
        // with the window.open() function
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`/join_room/` + this.formatURL(digest)])
        );
        console.log(url);
        window.open(url, '_blank');
    }

}
