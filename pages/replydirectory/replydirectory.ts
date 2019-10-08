import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../services/config';
import { UserService } from '../../services/users';
import { ForumService } from '../../services/forum';
import { ProfilePage } from '../profile/profile';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'page-replydirectory',
    templateUrl: 'replydirectory.html'
})
export class ReplydirectoryPage implements OnInit {

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
    navData: any;

    /* search options */
    searchTerm: string = '';

    /* new reply form */
    new_reply_form_visible = false;
    new_reply: FormGroup;

    /* Edit reply form */
    editreply_form_visible = false;
    edit_reply: FormGroup;


    topic:any;
    current_editable_reply : any; //which reply going to edit



    constructor(public navCtrl: NavController,
        public config: ConfigService,
        public forumService: ForumService,
        public navParams: NavParams,
        private nav: NavController,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder,
    ) {
        this.new_reply = formBuilder.group({
            post_content: new FormControl('', Validators.compose([
                Validators.required
            ]))
        });
        this.edit_reply = formBuilder.group({
            post_content: new FormControl('', Validators.compose([
                Validators.required
            ]))
        });
    }


    ngOnInit() {
        let $this = this;
        this.navData = this.navParams.data;
        this.topic = this.navData;
        this.args = this.set_start();
        this.loadmore = 0;
        this.get_replies('ngoninit', this.args).then((resolve: any) => {
            if (Array.isArray(resolve) && (resolve.length == $this.config.forum.limit)) {
                $this.loadmore = 1;
            }
        });
    }

    doRefresh($event) {
        let $this = this;
        console.log('refresh');
        this.args = this.set_start();
        this.loadmore = 0;
        this.get_replies('refresh', this.args).then((resolve: any) => {
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
        this.get_replies('infinite', this.args).then((resolve: any) => {
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
                this.get_replies('search', this.args).then((resolve: any) => {
                    if (Array.isArray(resolve) && (resolve.length == $this.config.batch.limit)) {
                        $this.loadmore = 1;
                    }
                });
            } else {
                // do nothing
            }
        }
    }

    get_replies(activity, args) {
        let $this = this;
        // let loading = this.loadingCtrl.create({
        //     content: '<img src="assets/images/bubbles.svg">',
        //     duration: 3000,//this.config.get_translation('loadingresults'),
        //     spinner: 'hide',
        //     showBackdrop: true,
        // });
        // loading.present();

        return new Promise((resolve) => {
            $this.forumService.get_all_replies(activity, args).then((res: any) => {
                //loading.dismiss();
                resolve(res);
            });
        });
    }

    set_start() {
        return {
            'post_parent': this.navData.ID,  //topic id
            'posts_per_page': this.config.forum.limit,
            'paged': this.config.forum.paged,
            'order' : 'DESC'
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
        this.get_replies('sort', this.args).then((resolve: any) => {
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
        this.get_replies('type', args).then((resolve: any) => {
            if (Array.isArray(resolve) && (resolve.length == $this.config.batch.limit)) {
                $this.loadmore = 1;
            }
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

    toggle_form() {
        this.new_reply_form_visible = !this.new_reply_form_visible;
    }

    logForm() {
        let toast = this.toastCtrl.create({
            message: this.config.get_translation('creating'),
            duration: 1000,
            position: 'bottom'
        });
        toast.present();
        this.toggle_form();
        let $this = this;
        let data = this.new_reply.value;
        data.post_parent = $this.navData.ID;
        console.log(data);
        let toast1 = this.toastCtrl.create({
            message: 'Reply creation restricted by App Admin.',
            duration: 1000,
            position: 'bottom'
        });
        toast1.present();
        if(0){
            $this.forumService.create_reply(data).then((res: any) => {
                if(res.status){
                    let toast = this.toastCtrl.create({
                        message: res.message,
                        duration: 1000,
                        position: 'bottom'
                    });
                    toast.present();
                }else{
                    let toast = this.toastCtrl.create({
                        message: res.message,
                        duration: 1000,
                        position: 'bottom'
                    });
                    toast.present();
                }
            });
        }
    }

    toggle_edit_form() {
        this.editreply_form_visible = !this.editreply_form_visible;
    }
    editreply(ev:any){
        this.editreply_form_visible = !this.editreply_form_visible;
        this.edit_reply.value.post_content = ev.post_content;
        this.current_editable_reply = ev;
    }
    edit_replyForm(){
        
        let toast = this.toastCtrl.create({
            message: this.config.get_translation('updating'),
            duration: 1000,
            position: 'bottom'
        });
        toast.present();
        this.toggle_edit_form();
        let $this = this;
        let reply = $this.current_editable_reply;
        let new_content =  this.edit_reply.value.post_content;
        $this.forumService.editreply(reply,new_content).then((res: any) => {
            if(res.status){
                let toast = this.toastCtrl.create({
                    message: res.message,
                    duration: 1000,
                    position: 'bottom'
                });
                toast.present();
            }else{
                let toast = this.toastCtrl.create({
                    message: res.message,
                    duration: 1000,
                    position: 'bottom'
                });
                toast.present();
            }
        });
    }

}