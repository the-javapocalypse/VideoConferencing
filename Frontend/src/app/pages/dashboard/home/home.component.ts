import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/storage/local-storage.service';

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

    constructor(private storage: LocalStorageService) {
    }

    ngOnInit() {
        this.userInfo = this.storage.retrieveJWT().userInfo;
    }

    // Create Room
    createRoom() {

    }
}
