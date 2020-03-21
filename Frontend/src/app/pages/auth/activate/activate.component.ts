import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {RestService} from '../../../services/api/rest.service';


@Component({
    selector: 'app-activate',
    templateUrl: './activate.component.html',
    styleUrls: ['./activate.component.sass']
})
export class ActivateComponent implements OnInit {

    token = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private api: RestService) {
    }

    ngOnInit() {
        // get token
        this.token = this.route.snapshot.paramMap.get('token');

        // activate user
        this.api.activateUser(this.token).subscribe(
            (res: any) => {
                this.router.navigate(['/account']);
            },
            (error: any) => {
                this.router.navigate(['/account']);
            }
        );
    }

}
