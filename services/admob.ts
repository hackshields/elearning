import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';

// import { AdMob } from "ionic-admob";
import { WalletService } from "./wallet";
import { NavController, NavParams, ToastController,ModalController, LoadingController,Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConfigService } from "./config";


@Injectable()
export class AdmobService{  
	
	adMobConfig:any;

	constructor(
		// private admob: AdMob,
		public WalletService: WalletService,
		private toastCtrl:ToastController,
		private platform: Platform, 
		private storage: Storage,
		private config: ConfigService
		)
	{
			
		
	}
	varible_initilize(){

			this.adMobConfig=[
				{	
					'id':1,
					'type':'home',           //Type of Ad in App.
					'adType':'interstitial', // Type of Ad in Admob
					'adProp': {				 // Ad properties
						'delay': 0,		// Show after how much time		
						'times' : 50		// Number of times this ad is shown per user    
											// use 0 for disable this add  
											// -1 for infine times to show this add
					},			 
					'addId': {				// App store App ids
						'android':'ca-app-pub-7208148259344527/4953826511',
						'ios':''
					},
					'action':[				// Set of actions to perform on successful ad display or completion
						{
							type:'add_wallet_points',
							on:'completion',
							times:200,
							amount:2
						},
					]
				},
				{	
					'id':2,
					'type':'about', 
					'adType':'reward',
					'adProp': {				 // Ad properties
						'delay':  10000,		// Show after how much time		
						'times' : 20		// Number of times this ad is shown per user
											// -1 for infinite times
											// 0 to disable
					},
					'addId':  {
						'android':'ca-app-pub-7208148259344527/6047416333',
						'ios':''
					},
					'action':[
						{
							type:'add_wallet_points',
							on:'completion',
							times:10,
							amount:3
						}
					]
				}
			];

	}

	// showAds(id){
	// 	// alert(this.config.get_translation('pay'));
	// 	this.varible_initilize();
	// 	//this.config.addToTracker('addTracker',this.adMobConfig);
	// 	console.log(this.config.getTracker());
	// 								let $this =this;
	// 								let showAd=true;

	// 		this.platform.ready().then(() => {	  // check if platform is ready or not for adshow

			

	// 					this.varible_initilize();   // initialize variable admobconfig before ues

	// 					if(typeof this.adMobConfig === "undefined" || !this.adMobConfig.length){
	// 						return;
	// 					}

	// 					this.adMobConfig.map((item,index)=>{
	// 						if(item.id === id){
	// 							switch(item.adType){
	// 								case 'reward':
	// 										 showAd= true;
	// 										if($this.config.track.ads.findIndex((it,k)=>{ return k === item.id;}) > -1 && item.adProp.times > -1){
	// 											if($this.config.track.ads[item.id] >= item.adProp.times){
	// 												let toast = this.toastCtrl.create({
	// 												message: $this.config.get_translation('limit_reached_to_get_reward'),
	// 												duration: 2000,
	// 												position: 'top'
	// 										   		});
	// 											   	toast.present(); 
	// 												return;
	// 											}
	// 										}
	// 										if(showAd){
	// 										this.admob.rewardVideo.load({
	// 										      id: {
	// 								                  android: item.addId.android,
	// 								                  ios: item.addId.ios
	// 							                  },
	// 										    }).then(() => this.admob.rewardVideo.show())
								    
					
	// 							            .then(()=>{
								            	
	// 							            	document.addEventListener('admob.reward_video.reward', () => {
	// 												 //do something after complete ads show		
	// 														item.action.map((actionI)=>{
										            			
	// 									            			if(actionI.type=='add_wallet_points'){   // ad wallet point action type
										            					
	// 										            			if($this.config.track.ads.findIndex((it,k)=>{ return k === item.id;}) === -1){
	// 												            						$this.config.track.ads[item.id] = 1;
	// 								            					}else{
	// 								            						$this.config.track.ads[item.id]++;
	// 								            					}
	// 								            					// alert(JSON.stringify($this.config.track.ads)+ '  '+$this.config.track.ads[item.id]);
	// 									           					$this.storage.set('track',$this.config.track).then(()=>{
	// 								            						$this.AddToWallet($this,item,actionI);  
	// 								            					});
	   	
	// 									            			}//end of action type 'add_wallet_points'




	// 									            	});										
	// 											});
	// 							            });
	// 							          }

	// 								break;
	// 								case 'interstitial':
	// 									// alert($this.config.track.ads[item.id]+'  '+item.adProp.times);
	// 									//check number of times this ad has been shown
	// 									 showAd= true;
	// 									if($this.config.track.ads.findIndex((it,k)=>{ return k === item.id;}) > -1 && item.adProp.times > -1){
	// 										if($this.config.track.ads[item.id] >= item.adProp.times){
	// 											let toast = this.toastCtrl.create({
	// 											message: $this.config.get_translation('limit_reached_to_get_reward'),
	// 											duration: 2000,
	// 											position: 'top'
	// 									   		});
	// 										   	toast.present(); 
	// 											return;
	// 										}
	// 									}
	// 									if(showAd){
	// 										$this.admob.interstitial.load({
	// 							                id: {
	// 							                  android: item.addId.android,
	// 							                  ios: item.addId.ios
	// 							                },
	// 							            })
	// 							            .then(() => {


	// 							            	setTimeout(function(){
	// 							            		// alert('9show');
	// 							            		 $this.admob.interstitial.show()
	// 							            		.then(()=>{
	// 											            	// do here after ad show
	// 													            	item.action.map((actionI)=>{
														            			
	// 												            			if(actionI.type=='add_wallet_points'){   // ad wallet point action type	
	// 											            					if($this.config.track.ads.findIndex((it,k)=>{ return k === item.id;}) === -1){
	// 											            						$this.config.track.ads[item.id] = 1;
	// 											            					}else{
	// 											            						$this.config.track.ads[item.id]++;
	// 											            					}
	// 											            					// alert(JSON.stringify($this.config.track.ads)+ '  '+$this.config.track.ads[item.id]);
	// 												           					$this.storage.set('track',$this.config.track).then(()=>{
	// 											            						$this.AddToWallet($this,item,actionI);  
	// 											            					});
												            					

	// 												            			}//end of action type 'add_wallet_points'




	// 													            	});
										            	
								            	
								            	
	// 							           						 });
	// 							            	},item.adProp.delay);
								            	
	// 							            });
	// 							        }
							            
							           
	// 								break;
	// 							}
	// 						}
	// 					})// end map

	// 		}); //end platform ready

	// }

	// AddToWallet($this,item,actionI){

	// 			$this.storage.get(item.type+'_'+actionI.type)
 //            		.then((timesStore)=>{
            						
 //            				if(timesStore<actionI.times){
	//             				$this.WalletService.UpdateAmountFromAds(actionI.amount)
	//             				.then(()=>{
	            						
	//             						console.log('within greater than 0');
	//             						$this.storage.set(item.type+'_'+actionI.type,timesStore+1);
	//             				});
	//             			}
	//             			else if(timesStore==null || timesStore=='undefined' || timesStore==0){
	//             				$this.WalletService.UpdateAmountFromAds(actionI.amount)
	//             				.then(()=>{
	//             						// alert('within 0 reached');
	//             						console.log('within 0');
	//             						$this.storage.set(item.type+'_'+actionI.type,1);
	//             				});
	//             			}
	//             			else{
	//             				let toast = this.toastCtrl.create({
	// 							message: $this.config.get_translation('limit_reached_to_get_reward'),
	// 							duration: 2000,
	// 							position: 'top'
	// 					   		});
	// 						   	toast.present(); 
	// 		            		console.log('Limit reached');
	//             			}
 //            		});

	// }


}
	
