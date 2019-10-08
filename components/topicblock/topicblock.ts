import { Component , Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController,AlertController, Platform, Slides } from 'ionic-angular';
import { ConfigService } from '../../services/config';
import { ForumService } from '../../services/forum';
import { ReplydirectoryPage } from '../../pages/replydirectory/replydirectory';

@Component({
  selector: 'TopicBlock',
  templateUrl: 'topicblock.html'
})
export class TopicBlock implements OnInit   {

	@Input('topic') topic;
	replypPage=ReplydirectoryPage;
	
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private config:ConfigService,
	    public forumService:ForumService,
	    public loadingController: LoadingController,
	    private toastCtrl: ToastController,
	    private alertCtrl: AlertController
 	) {
 		
 


  	}
    ngOnInit(){
    	if(this.topic.post_date){
    		let new_time= Math.floor((new Date().getTime() -  Date.parse(this.topic.post_date) )/1000);
    		this.topic.post_date = new_time;
    	}
    }

    goToNextPage(topic:any){
		let $this=this;
		$this.navCtrl.push(this.replypPage,topic);
	} 

}



