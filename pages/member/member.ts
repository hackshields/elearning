import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController,AlertController, Platform, Slides } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { ConfigService } from '../../services/config';
import { MembersService } from '../../services/members';
import { ProfilePage } from '../profile/profile';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'page-member',
    templateUrl: 'member.html'
})
export class MemberPage implements OnInit {

    profilePage = ProfilePage;
    navData: any;
    current_member_id:any;
    current_member_details:any;
    constructor(public navCtrl: NavController,
        public config: ConfigService,
        private platform:Platform,
        public membersService: MembersService,
        public navParams: NavParams,
        private nav: NavController,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        private iab:InAppBrowser
    ) { }


    ngOnInit() {
        let $this=this;
        console.log(this.navParams.data);
        this.navData = this.navParams.data;     // it containes member object
        this.current_member_id=this.navData.ID  // this is current member id for this page
        let loading = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 5000,
            spinner:'hide',
            showBackdrop:true,

        });
        this.get_member_profile_details(this.current_member_id,false).then((res)=>{
            $this.current_member_details=res;
            loading.dismiss();
            console.log('res on init');
            console.log(res);
        });
    }

    get_member_profile_details(current_member_id,refresh=false){
        let $this=this;
        return new Promise((resolve)=>{
            $this.membersService.get_member_profile_details(current_member_id,refresh).then((response)=>{
                resolve(response);
            });
        });
    }

    triggerCertificateInBrowser(url:string){
        this.platform.ready().then(() => {
            this.iab.create(url, "_blank");
        });
    }
    checkImage(d:any){
        return d.match(/.+\.(jpeg|jpg)$/);
    }
    triggerImage(url:string,title:string){
        //this.photoViewer.show(url,title);
    }

    doRefresh($event){
        let $this=this;
        this.get_member_profile_details(this.current_member_id,true).then((res)=>{
            console.log('doRefresh');
            console.log(res);
            $this.current_member_details=res;
            $event.complete();  
        });
   
    }


}