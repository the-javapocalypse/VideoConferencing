import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../../services/storage/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  userInfo = {};

  constructor(private storage: LocalStorageService) { }

  ngOnInit() {
    this.userInfo = this.storage.retrieveJWT().userInfo;
  }

}
