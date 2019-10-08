import { Component , Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController,AlertController, Platform, Slides } from 'ionic-angular';
import { GroupPage } from '../../pages/group/group';
import { ConfigService } from '../../services/config';
import { WalletService } from '../../services/wallet';
import { GroupService } from '../../services/group';

@Component({
  selector: 'GroupBlock',
  templateUrl: 'groupblock.html'
})
export class GroupBlock implements OnInit   {

	@Input('group') group;
	@Input('course_id') course_id;
	groupPage=GroupPage;
	
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private config:ConfigService,
	    private walletService: WalletService,
	    public groupService:GroupService,
	    public loadingController: LoadingController,
	    private toastCtrl: ToastController,
	    private alertCtrl: AlertController
 	) {
 		
 


  	}
    ngOnInit(){
    	console.log('------');

    	console.log(this.group);
    }



	goToNextPage(group:any){
		let $this=this;
		if(group.is_batch){
			if($this.config.isLoggedIn){
				if(group.is_member){
					$this.navCtrl.push(this.groupPage,group);
				}else{
					let toast = $this.toastCtrl.create({
	                    message: $this.config.get_translation('Please_buy_batch_first'),
	                    duration: 1000,
	                    position: 'bottom'
		            });
		            toast.present();
				}
				
			}else{
				let toast = $this.toastCtrl.create({
	                    message: $this.config.get_translation('login_buy_batch'),
	                    duration: 1000,
	                    position: 'bottom'
	            });
	            toast.present();	
			}
		}else{
			if(group.status === 'public'){
				this.navCtrl.push(this.groupPage,group);
			}

			if(group.status === 'private'){
				if(this.config.isLoggedIn){
					this.navCtrl.push(this.groupPage,group);
				}else{
					let toast = $this.toastCtrl.create({
	                    message: $this.config.get_translation('login_to_access'),
	                    duration: 1000,
	                    position: 'bottom'
		            });
		            toast.present();
				}
			}
			if(group.status === 'hidden'){
				if(this.config.isLoggedIn && group.is_member){
					this.navCtrl.push(this.groupPage,group);
				}else{
					let toast = $this.toastCtrl.create({
	                    message: $this.config.get_translation('join_to_access'),
	                    duration: 1000,
	                    position: 'bottom'
		            });
		            toast.present();
				}
			}

		}
	}

	buy_batch(group:any){
		let $this=this;
		if($this.config.isLoggedIn){
			let buttons:any=[];
			buttons = [
			    {
			      text: this.config.get_translation('cancel'),
			      role: 'cancel',
			      handler: () => {
			        console.log('Cancel clicked');
			      }
			    },
			    {
				text: this.config.get_translation('pay_from_wallet'),
					handler: () => {
						let loading = this.loadingController.create({
						content: '<img src="assets/images/bubbles.svg">',
						duration: 15000,//this.config.get_translation('loadingresults'),
						spinner:'hide',
						showBackdrop:true,
				     	});
				        loading.present();

						
						$this.walletService.getWallet(true).subscribe(res=>{
							console.log('getWallet');
							console.log(res);
							if(group.price.sale_price<=res.amount){
								$this.groupService.join_remove_batch(group.id,'add').then((resolve:any)=>{
									if(resolve.status){
										console.log('joined');
										loading.dismiss();
										let toast = $this.toastCtrl.create({
				                            message: resolve.message,
				                            duration: 1000,
				                            position: 'bottom'
				                        });
						                group.buy_method='debit';
										$this.walletService.walletPayment_batch(group).then((reswalletd:any)=>{
											if(reswalletd.status=='success'){
												loading.dismiss();
												let toast = $this.toastCtrl.create({
								                            message: $this.config.get_translation('money_deducted_joined'),
								                            duration: 1000,
								                            position: 'bottom'
								                        });
								            	toast.present();
								            	$this.group.is_member=true;
								            	/*set storage here  with changes*/
								            	$this.setGroupStorage(group);
								            	$this.resetBatchCourse(group);

								            	console.log('debited');
											}else{
												$this.groupService.join_remove_batch(group.id,'remove').then((resolve:any)=>{
													loading.dismiss();
													if(resolve.status){
														let toast = $this.toastCtrl.create({
								                            message: resolve.message,
								                            duration: 1000,
								                            position: 'bottom'
								                        });
													}else{
														let toast = $this.toastCtrl.create({
								                            message: resolve.message,
								                            duration: 1000,
								                            position: 'bottom'
								                        });
													}
												});
											}
										});
				                       
									}else{
										loading.dismiss();
										let toast = $this.toastCtrl.create({
				                            message: resolve.message,
				                            duration: 1000,
				                            position: 'bottom'
				                        });
				            			toast.present();
									}
								});  
							}else{
								loading.dismiss();
								let toast = $this.toastCtrl.create({
				                        message: $this.config.get_translation('not_enough_money_to_purchase_batch'),
				                        duration: 1000,
				                        position: 'bottom'
				                });
				                toast.present();
				                console.log('not enough money');
							}
				        });
					}
			    },
			  ];
			let title:string = '';
			title = group.name;
			let alert = this.alertCtrl.create({
			title: title,
			buttons: buttons
		    });
		    alert.present();
		}else{
			let toast = $this.toastCtrl.create({
                    message: $this.config.get_translation('login_buy_batch'),
                    duration: 1000,
                    position: 'bottom'
            });
            toast.present();	
		}
	
	}

	setGroupStorage(group){
		let $this=this;
		$this.groupService.setGroupStorage(group);
	}
	resetBatchCourse(group){
		let $this=this;
		$this.groupService.resetBatchCourse(group);
	}

	get_start_end_date(start_date='',end_date=''){
		let months = this.config.batch.months;
		if(start_date){
		  var res_start_date:any = start_date.split("-");
		  var new_start_date_month:any=months[Number(res_start_date[1]-1)];
		}
		if(end_date){
		  var res_end_date:any = end_date.split("-");
		  var new_end_date_month:any=months[Number(res_end_date[1]-1)];
		}
		if(start_date && end_date){
			return (res_start_date[2]+' '+new_start_date_month+' '+res_start_date[0]+'-'+res_end_date[2]+' '+new_end_date_month+' '+res_end_date[0]);		
		}else if(start_date){
			return (res_start_date[2]+' '+new_start_date_month+' '+res_start_date[0]+'-'+this.config.get_translation('continue'));
		}else if(end_date){
			return (this.config.get_translation('now_to')+'-'+res_end_date[2]+' '+new_end_date_month+' '+res_end_date[0]);
		}else{
			return (this.config.get_translation('not_set'));
		}
	}

}



