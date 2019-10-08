import { Component , Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController,AlertController, Platform, Slides } from 'ionic-angular';
import { ConfigService } from '../../services/config';
import { MembersService } from '../../services/members';
import { MemberPage } from '../../pages/member/member';

@Component({
  selector: 'MemberBlock',
  templateUrl: 'memberblock.html'
})
export class MemberBlock implements OnInit   {

	memberPage=MemberPage;
	@Input('member') member;
	
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private config:ConfigService,
	    public loadingController: LoadingController,
	    private toastCtrl: ToastController,
	    private alertCtrl: AlertController
 	) {
 		
 


  	}
    ngOnInit(){
	}
	
    goToNextPage(member:any){
		this.navCtrl.push(this.memberPage,member);
	}
  
}



