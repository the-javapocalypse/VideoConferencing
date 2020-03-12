import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {RestService} from '../../../services/api/rest.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

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
                items: 1
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
                ) {
    }

    ngOnInit() {
        this.userInfo = this.storage.retrieveJWT().userInfo;
        this.getRooms();
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


}
