import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../services/config';
import { UserService } from '../../services/users';
import { ForumService } from '../../services/forum';
import { ProfilePage } from '../profile/profile';

@Component({
    selector: 'page-forumirectory',
    templateUrl: 'forumdirectory.html'
})
export class ForumdirectoryPage implements OnInit {

    profilePage = ProfilePage;
    userdata: any;
    loadmore = 1;
    initial_group: any;
    filter: any;

    /* filter options */
    sortby: any = '';
    filterby: any = '';
    sortSelectOptions: any;
    filterSelectOptions: any;
    args: any;

    /* search options */
    searchTerm: string = '';



    constructor(public navCtrl: NavController,
        public config: ConfigService,
        public forumService: ForumService,
        public navParams: NavParams,
        private nav: NavController,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController
    ) { }


    ngOnInit() {
        let $this = this;
        this.args = this.set_start();
        this.loadmore = 0;
        let loading = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 5000,
            spinner:'hide',
            showBackdrop:true,

        });
        loading.present();
        this.get_forums('ngoninit', this.args).then((resolve: any) => {
            loading.dismiss();
            if (Array.isArray(resolve) && (resolve.length == $this.config.forum.limit)) {
                $this.loadmore = 1;
            }
        });
    }

    doRefresh($event) {
        let $this = this;
        this.args = this.set_start();
        this.loadmore = 0;
        this.get_forums('refresh', this.args).then((resolve: any) => {
            if (Array.isArray(resolve) && (resolve.length == $this.config.forum.limit)) {
                $this.loadmore = 1;
            }
            $event.complete();
        });
        this.reset();
    }

    doInfinite($event) {
        let $this = this;
        $this.loadmore = 0;
        this.get_forums('infinite', this.args).then((resolve: any) => {
            if (Array.isArray(resolve) && (resolve.length == $this.config.forum.limit)) {
                $this.loadmore = 1;
            }
            $event.complete();
        });

    }

    /* Search by keyword */
    onSearchInput() {
        let $this = this;
        if (this.searchTerm) {
            if (this.searchTerm.length >= 3) {
                // make api hit
                this.args = this.set_start();
                this.args.title = this.searchTerm;
                this.loadmore = 0;
                this.get_forums('search', this.args).then((resolve: any) => {
                    if (Array.isArray(resolve) && (resolve.length == $this.config.batch.limit)) {
                        $this.loadmore = 1;
                    }
                });
            } else {
                // do nothing
            }
        }
    }

    get_forums(activity, args) {
        let $this = this;
        let loading = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 3000,//this.config.get_translation('loadingresults'),
            spinner: 'hide',
            showBackdrop: true,
        });
        loading.present();

        return new Promise((resolve) => {
            $this.forumService.get_all_forums(activity, args).then((res: any) => {
                loading.dismiss();
                resolve(res);
            });
        });
    }

    set_start() {
        return {
            'posts_per_page': this.config.forum.limit,
            'paged': this.config.forum.paged
        }
    }
    reset() {
        this.sortby = '';
        this.filterby = '';
        this.searchTerm = '';
    }




    /* sort by groups and batches */
    onSortOptions($event: any) {
        let $this = this;
        this.args = this.set_start();
        this.args.order = $event;
        $this.loadmore = 0;
        this.get_forums('sort', this.args).then((resolve: any) => {
            if (Array.isArray(resolve) && (resolve.length == $this.config.batch.limit)) {
                $this.loadmore = 1;
            }
        });
    }
    /* filter by alphabet , lastActive , newlyCreated  and mostMembers */
    onFilterOptions($event: any) {
        let $this = this;
        this.filterby = $event;
        let args = { 'filterby': this.filterby };
        this.args = args;
        $this.loadmore = 0;
        let loading = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 2000,//this.config.get_translation('loadingresults'),
            spinner: 'hide',
            showBackdrop: true,
        });
        loading.present();
        this.get_forums('type', args).then((resolve: any) => {
            loading.dismiss();
            // if(resolve.length==$this.config.batch.limit){
            //     $this.loadmore=1;
            // }
        });
    }

    ionViewDidLoad() {
        this.sortSelectOptions = {
            title: this.config.get_translation('sort_options'),
            okText: this.config.get_translation('okay'),
            cancelText: this.config.get_translation('dismiss'),
        };
        this.filterSelectOptions = {
            title: this.config.get_translation('filter_options'),
            okText: this.config.get_translation('okay'),
            cancelText: this.config.get_translation('dismiss'),
        };
    }


}