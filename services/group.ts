import { Injectable } from '@angular/core';
import { Component, OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';

import { ConfigService } from "./config";

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class GroupService{ 



	all_groups:any;
	my_batches:any=[];

	constructor(
		private http:Http,
		public config:ConfigService, 
		public storage:Storage
	){}



	get_all_groups(action,args){
		
		let $this=this;
		let data:any={};
		return new Promise((resolve)=>{
			switch(action) {
			  case 'refresh':
			  		$this.all_groups=[];
			  		data={
						'limit': $this.config.batch.limit,
						'offset':0,
						'args':args
					};
					$this.get_groups(data,action).then((res)=>{
						resolve(res);
					});		  
			    break;
			  case 'ngoninit':
				  	$this.storage.get('allgroups').then((allgroups) => {
			            if(allgroups && allgroups.length){
			            	$this.all_groups=allgroups;
			               	resolve(allgroups);
			            }else{
							data={
								'limit': $this.config.batch.limit,
								'offset':0,
								'args':args
							};
							$this.get_groups(data,action).then((res)=>{
								resolve(res);
							});
			            }
			        }); 
			    break;
			  case 'infinite':
			   		if($this.all_groups && $this.all_groups.length){
			   			let offset=$this.all_groups.length;
			   			data={
							'limit': $this.config.batch.limit,
							'offset':offset,
							'args':args
						};
						$this.get_groups(data,action).then((res)=>{
							resolve(res);
						});
			   		}
			 	 break;
			  case 'type':
			  	$this.all_groups=[];
	  			data={
					'limit': $this.config.batch.limit,
					'offset':0,
					'args':args
				};
				$this.get_groups(data,action).then((res)=>{
					resolve(res);
				});
			  break;
			  case 'search':
			  	$this.all_groups=[];
			  	data={
					'limit': $this.config.batch.limit,
					'offset':0,
					'args':args
				};
				$this.get_groups(data,action).then((res)=>{
					resolve(res);
				});
			  break;	
			  case 'filterby':
			  	$this.all_groups=[];
			  	data={
					'limit': $this.config.batch.limit,
					'offset':0,
					'args':args
				};
				$this.get_groups(data,action).then((res)=>{
					resolve(res);
				});			  
			  break;	
			  default:
			}
		});
	}


	get_groups(data,action){
		let $this=this;
		return new Promise((resolve)=>{
			if($this.config.isLoggedIn){
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}groups/getAllgroups`,data,opt)
		        .map(res => res.json())
		        .subscribe(res=>{
			        if(res.status){
			        	if(res.data.length){
							res.data.map((x,i)=>{
								if($this.all_groups){
									$this.all_groups.push(x);
								}else{
									$this.all_groups=[];
								}
							});
			        	}
		            }else{
		            	$this.all_groups=[];
		            }
		            if(action=='refresh' || action=='ngoninit'){
			            this.storage.set('allgroups',$this.all_groups);
			            this.config.addToTracker('allgroups',parseInt($this.all_groups.length));
		            }
		        	resolve(res.data);
			    });   
			}else{
				$this.http.post(`${$this.config.baseUrl}groups/getAllgroups-nonlog`,data)
		        .map(res => res.json())
		        .subscribe(res=>{
			        if(res.status){
			        	if(res.data.length){
							res.data.map((x,i)=>{
								if($this.all_groups){
									$this.all_groups.push(x);
								}else{
									$this.all_groups=[];
								}
							});
			        	}
		            }else{
		            	$this.all_groups=[];
		            }
		            if(action=='refresh' || action=='ngoninit'){
			            this.storage.set('allgroups',$this.all_groups);
			            this.config.addToTracker('allgroups',parseInt($this.all_groups.length));
		            }
		            console.log('this.allgroups');
		            console.log($this.all_groups);
		        	resolve(res.data);
			    }); 
			}
		});
	}

    getBatchById(batch_id,force:boolean=false){
    	// force=true;
    	let $this=this;
    	batch_id=parseInt(batch_id);
    	return new Promise((resolve)=>{

    		let track_group=$this.config.trackComponents('groups');

    		if(Array.isArray(track_group) && track_group.indexOf(batch_id) !=-1 && !force){
	    		$this.storage.get('fullbatch_'+batch_id).then((batch_val) => {
	    			if(batch_val){
	    				resolve(batch_val);
	    			}else{
	    				console.log('if hit ');
			    		let body_form_data  = new FormData();
						body_form_data.append('batch_id',batch_id);
						let opt = $this.getUserAuthorizationHeaders();
						$this.http.post(`${$this.config.baseUrl}groups/getBatchById`,body_form_data,opt)
				        .map(res => res.json())
				        .subscribe(res=>{
				        	if(res.status){
				        		this.storage.set('fullbatch_'+batch_id,res.data);
				        		this.config.addToTracker('groups',batch_id);
				        	}
				        	resolve(res.data);
					    });  
	    			}
	    		});
    		}else{
    			let body_form_data  = new FormData();
				body_form_data.append('batch_id',batch_id);
				let opt = $this.getUserAuthorizationHeaders();
				$this.http.post(`${$this.config.baseUrl}groups/getBatchById`,body_form_data,opt)
		        .map(res => res.json())
		        .subscribe(res=>{
		        	if(res.status){
		        		this.storage.set('fullbatch_'+batch_id,res.data);
		        		this.config.addToTracker('groups',batch_id);
		        	}
		        	resolve(res.data);
			    });  
    		}

    	})
    }

    public join_remove_batch(batch_id,type){
    	let $this=this;
    	console.log(batch_id);
    	return new Promise((resolve)=>{
			let body_form_data  = new FormData();
			body_form_data.append('batch_id',batch_id);
			if(type=='add'){
				body_form_data.append('type','add');
			}else if(type=='remove'){
				body_form_data.append('type','remove');
			}
			let opt = $this.getUserAuthorizationHeaders();
			$this.http.post(`${$this.config.baseUrl}groups/join-batch`,body_form_data,opt)
	        .map(res => res.json())
	        .subscribe(res=>{
	        	resolve(res);
		    });  

    	});
    }

    get_batch_tab_value(batch_id,current_tab_key,per_page,offset){
    	let $this=this;
   		return new Promise((resolve)=>{
   		 	let body_form_data  = new FormData();
			body_form_data.append('batch_id',batch_id);
			body_form_data.append('batch_tab',current_tab_key);
			body_form_data.append('per_page',per_page);
			body_form_data.append('offset',offset);

			let opt = $this.getUserAuthorizationHeaders();
   		 	$this.http.post(`${$this.config.baseUrl}groups/getbatchtabvalue`,body_form_data,opt)
	        .map(res => res.json())
	        .subscribe(res=>{
	        	resolve(res);
		    });  
   		 	// resolve({'current_batch_id':current_batch_id,'current_tab_key':current_tab_key,'per_page':per_page,'offset':offset});
   		 });
    }


	public getUserAuthorizationHeaders(){
        var userheaders = new Headers();
        userheaders.append('Authorization', this.config.settings.access_token);
        return new RequestOptions({ headers: userheaders }); 
    }

    setGroupStorage(group:any){
		this.storage.get('allgroups').then((allgroups)=>{
			if(Array.isArray(allgroups) && allgroups){
				let index=allgroups.findIndex((element)=>{
				  return element.id==group.id;
				});
				if(index!=-1){
					allgroups[index]=group;
					this.storage.set('allgroups',allgroups);
				}
			}
		});
    }

    resetBatchCourse(group:any){
    	let $this=this;
    	if(group && group.settings && group.settings.batch_course){
    		if(Array.isArray(group.settings.batch_course)){
    			(group.settings.batch_course).forEach(function(course_id) {
				    $this.config.removeFromTracker('courses',parseInt(course_id));
				    console.log(course_id+' removed from tracker');
				});
    		}
    	}
    }


    get_my_batches(res:any){
    	console.log(res);
    	let $this=this;
   		$this.my_batches=[];
        if(res.status){
        	if(res.data.length){
				res.data.map((x,i)=>{
					$this.my_batches.push(x);
				});
        	}
        }else{
        	$this.my_batches=[];
        }
    }

}



