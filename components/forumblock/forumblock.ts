import { Component , Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController,AlertController, Platform, Slides } from 'ionic-angular';
import { ConfigService } from '../../services/config';
import { ForumService } from '../../services/forum';
import { TopicdirectoryPage } from '../../pages/topicdirectory/topicdirectory';

@Component({
  selector: 'ForumBlock',
  templateUrl: 'forumblock.html'
})
export class ForumBlock implements OnInit   {

	@Input('forum') forum;
	topicpPage=TopicdirectoryPage;
	
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
    	if(this.forum.post_date){
    		let new_time= Math.floor((new Date().getTime() -  Date.parse(this.forum.post_date) )/1000);
    		this.forum.post_date = new_time;
    	}
    }

  
	goToNextPage(forum:any){
		let $this=this;
		$this.navCtrl.push(this.topicpPage,forum);
	}

	// buy_batch(group:any){
	// 	let $this=this;
	// 	if($this.config.isLoggedIn){
	// 		let buttons:any=[];
	// 		buttons = [
	// 		    {
	// 		      text: this.config.get_translation('cancel'),
	// 		      role: 'cancel',
	// 		      handler: () => {
	// 		        console.log('Cancel clicked');
	// 		      }
	// 		    },
	// 		    {
	// 			text: this.config.get_translation('pay_from_wallet'),
	// 				handler: () => {
	// 					let loading = this.loadingController.create({
	// 					content: '<img src="assets/images/bubbles.svg">',
	// 					duration: 15000,//this.config.get_translation('loadingresults'),
	// 					spinner:'hide',
	// 					showBackdrop:true,
	// 			     	});
	// 			        loading.present();

						
	// 					$this.walletService.getWallet(true).subscribe(res=>{
	// 						console.log('getWallet');
	// 						console.log(res);
	// 						if(group.price.sale_price<=res.amount){
	// 							$this.groupService.join_remove_batch(group.id,'add').then((resolve:any)=>{
	// 								if(resolve.status){
	// 									console.log('joined');
	// 									loading.dismiss();
	// 									let toast = $this.toastCtrl.create({
	// 			                            message: resolve.message,
	// 			                            duration: 1000,
	// 			                            position: 'bottom'
	// 			                        });
	// 					                group.buy_method='debit';
	// 									$this.walletService.walletPayment_batch(group).then((reswalletd:any)=>{
	// 										if(reswalletd.status=='success'){
	// 											loading.dismiss();
	// 											let toast = $this.toastCtrl.create({
	// 							                            message: $this.config.get_translation('money_deducted_joined'),
	// 							                            duration: 1000,
	// 							                            position: 'bottom'
	// 							                        });
	// 							            	toast.present();
	// 							            	$this.group.is_member=true;
	// 							            	/*set storage here  with changes*/
	// 							            	$this.setGroupStorage(group);
	// 							            	$this.resetBatchCourse(group);

	// 							            	console.log('debited');
	// 										}else{
	// 											$this.groupService.join_remove_batch(group.id,'remove').then((resolve:any)=>{
	// 												loading.dismiss();
	// 												if(resolve.status){
	// 													let toast = $this.toastCtrl.create({
	// 							                            message: resolve.message,
	// 							                            duration: 1000,
	// 							                            position: 'bottom'
	// 							                        });
	// 												}else{
	// 													let toast = $this.toastCtrl.create({
	// 							                            message: resolve.message,
	// 							                            duration: 1000,
	// 							                            position: 'bottom'
	// 							                        });
	// 												}
	// 											});
	// 										}
	// 									});
				                       
	// 								}else{
	// 									loading.dismiss();
	// 									let toast = $this.toastCtrl.create({
	// 			                            message: resolve.message,
	// 			                            duration: 1000,
	// 			                            position: 'bottom'
	// 			                        });
	// 			            			toast.present();
	// 								}
	// 							});  
	// 						}else{
	// 							loading.dismiss();
	// 							let toast = $this.toastCtrl.create({
	// 			                        message: $this.config.get_translation('not_enough_money_to_purchase_batch'),
	// 			                        duration: 1000,
	// 			                        position: 'bottom'
	// 			                });
	// 			                toast.present();
	// 			                console.log('not enough money');
	// 						}
	// 			        });
	// 				}
	// 		    },
	// 		  ];
	// 		let title:string = '';
	// 		title = group.name;
	// 		let alert = this.alertCtrl.create({
	// 		title: title,
	// 		buttons: buttons
	// 	    });
	// 	    alert.present();
	// 	}else{
	// 		let toast = $this.toastCtrl.create({
 //                    message: $this.config.get_translation('login_buy_batch'),
 //                    duration: 1000,
 //                    position: 'bottom'
 //            });
 //            toast.present();	
	// 	}
	
	// }

	// setGroupStorage(group){
	// 	let $this=this;
	// 	$this.groupService.setGroupStorage(group);
	// }
	// resetBatchCourse(group){
	// 	let $this=this;
	// 	$this.groupService.resetBatchCourse(group);
	// }

	// get_start_end_date(start_date='',end_date=''){
	// 	let months = this.config.batch.months;
	// 	if(start_date){
	// 	  var res_start_date:any = start_date.split("-");
	// 	  var new_start_date_month:any=months[Number(res_start_date[1]-1)];
	// 	}
	// 	if(end_date){
	// 	  var res_end_date:any = end_date.split("-");
	// 	  var new_end_date_month:any=months[Number(res_end_date[1]-1)];
	// 	}
	// 	if(start_date && end_date){
	// 		return (res_start_date[2]+' '+new_start_date_month+' '+res_start_date[0]+'-'+res_end_date[2]+' '+new_end_date_month+' '+res_end_date[0]);		
	// 	}else if(start_date){
	// 		return (res_start_date[2]+' '+new_start_date_month+' '+res_start_date[0]+'-'+this.config.get_translation('continue'));
	// 	}else if(end_date){
	// 		return (this.config.get_translation('now_to')+'-'+res_end_date[2]+' '+new_end_date_month+' '+res_end_date[0]);
	// 	}else{
	// 		return (this.config.get_translation('not_set'));
	// 	}
	// }

}



