import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.sass']
})
export class JoinComponent implements OnInit {

    // Data variables
    digest = '';

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        // Grab meeting id from url
        this.digest = this.route.snapshot.paramMap.get('digest');

    }


}
