import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController,AlertController, Platform, Slides } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../services/config';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/users';
import { GroupService } from '../../services/group';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-group',
  templateUrl: 'group.html'
})
export class GroupPage implements OnInit{
    navData:any;
    profilePage=ProfilePage;
    batch_tab_value:any=[];
    current_batch_id:any;
    batchData:any;
    load_more_ob:any;
    refresh_tab_ob:any;
    current_active_tab_key:any;

    @ViewChild('GroupTabs') groupTabs: Slides;
    @ViewChild('GroupSlides') groupSlides: Slides;
  	constructor(public navCtrl: NavController, 
                public config: ConfigService,
                public groupService: GroupService,
                public navParams: NavParams,
                private nav: NavController,
                public courseService: CourseService,
                private toastCtrl:ToastController,
                public loadingCtrl: LoadingController
  		){}


  	ngOnInit(){
        this.initialize_load_more();
        this.navData=this.navParams.data;  // here is our {id:"",name:""}
        this.getBatchById(this.navData.id);
        this.current_batch_id=this.navData.id;
  	}

    initialize_load_more(){
        this.load_more_ob={
            'members':1,
            'activity':1,
            'news':1
        };
        this.refresh_tab_ob={
            'members':1,
            'activity':1,
            'news':1
        }
    }

    getBatchById(id){
        let loading = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 3000,//this.config.get_translation('loadingresults'),
            spinner:'hide',
            showBackdrop:true,
        });
        loading.present();

        let $this=this;
        $this.groupService.getBatchById(id).then((res:any)=>{
            if(res){
                $this.batchData=res;
            }
            loading.dismiss();
        });
    }

    onTabChanged() {
        let index = this.groupTabs.getActiveIndex();
        this.groupSlides.slideTo(index, 500);
    }

    /*
        On slide changed make api hit to get tab values
        making offset 0 to first hit
    */
    onSlideChanged(){
        this.get_tab_value().then((res)=>{
           
        });
    }

    doRefresh(refresher){
        this.get_tab_value().then((res)=>{
            refresher.complete();
        });
    }

    get_tab_value(){
        let $this=this;

        let loading = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 5000,//this.config.get_translation('loadingresults'),
            spinner:'hide',
            showBackdrop:true,
        });

        loading.present();

        $this.batch_tab_value={};
        return new Promise((resolve_val)=>{
            let index = $this.groupSlides.getActiveIndex();
            $this.groupTabs.slideTo(index,500);
            let current_tab_key=$this.batchData.tabs[index].key;
            $this.current_active_tab_key=current_tab_key;  // settting current tab key
            let per_page=$this.config.batch.limit;
            let offset=0;
            $this.load_more_ob[$this.current_active_tab_key]=1;
            if(current_tab_key=='activity'){
                offset=1;
            }
            if(index!=0){
                console.log('make a hit');
                $this.groupService.get_batch_tab_value($this.current_batch_id,current_tab_key,per_page,offset).then((resolve:any)=>{
                    loading.dismiss();
                    resolve_val();
                    if(resolve.status){
                        let data=resolve.data;
                        if(current_tab_key=='members'){
                            $this.batch_tab_value.members=[];
                            data.map((item,i)=>{
                                $this.batch_tab_value.members.push(item);
                            });      
                        }else if(current_tab_key=='activity'){
                            $this.batch_tab_value.activity=[];
                            data.map((item,i)=>{
                                $this.batch_tab_value.activity.push(item);
                            });
                        }else if(current_tab_key=='news'){
                            $this.batch_tab_value.news=[];
                            data.map((item,i)=>{
                                $this.batch_tab_value.news.push(item);
                            });
                        }
                    }else{
                        // do nothing
                    }
                console.log('Batch TAB vALUE####');
                console.log( $this.batch_tab_value);
                });  

            }else{
                loading.dismiss();
                resolve_val();
            }
        });
    
    }

    selectedTab(index,tab){
        this.groupSlides.slideTo(index, 500);
        console.log('selectedTab');
        console.log(index);
        console.log(tab);
    }

    loadMore(event:any){
        let loading = this.loadingCtrl.create({
        content: '<img src="assets/images/bubbles.svg">',
        duration: 3000,
        spinner:'hide',
        showBackdrop:true,
        });
        loading.present();

        let $this=this;
        let index = $this.groupSlides.getActiveIndex();
        let current_tab_key=$this.batchData.tabs[index].key;
        $this.current_active_tab_key=current_tab_key;  // settting current tab key
        let per_page=$this.config.batch.limit;
        let offset= $this.batch_tab_value[current_tab_key].length;

        /* Hiding load more */
        $this.load_more_ob[$this.current_active_tab_key]=0;

        /* making offset for activity to get only page no.*/
        if(current_tab_key=='activity' && ($this.batch_tab_value && $this.batch_tab_value.hasOwnProperty('activity'))){
            offset= Math.round(($this.batch_tab_value[current_tab_key].length/per_page)+1);
        }
        $this.groupService.get_batch_tab_value($this.current_batch_id,current_tab_key,per_page,offset).then((resolve:any)=>{
            event.complete();
            loading.dismiss();
            if(resolve.status){
                let data=resolve.data;
                if(data.length<per_page){
                    $this.load_more_ob[$this.current_active_tab_key]=0;
                }else{
                    $this.load_more_ob[$this.current_active_tab_key]=1;
                }
                if(current_tab_key=='members'){
                    data.map((item,i)=>{
                        if($this.batch_tab_value && $this.batch_tab_value.hasOwnProperty('members')){
                            $this.batch_tab_value.members.push(item);
                        }else{
                            $this.batch_tab_value.members=[];
                            $this.batch_tab_value.members.push(item);
                        }
                    }); 
                }else if(current_tab_key=='activity'){
                    data.map((item,i)=>{
                        if($this.batch_tab_value && $this.batch_tab_value.hasOwnProperty('activity')){
                            $this.batch_tab_value.activity.push(item);
                        }else{
                            $this.batch_tab_value.activity=[];
                            $this.batch_tab_value.activity.push(item);
                        }
                    });
                }else if(current_tab_key=='news'){
                    data.map((item,i)=>{
                        if($this.batch_tab_value && $this.batch_tab_value.hasOwnProperty('news')){
                            $this.batch_tab_value.news.push(item);
                        }else{
                            $this.batch_tab_value.news=[];
                            $this.batch_tab_value.news.push(item);
                        }
                    });
                }
            }else{
                // do nothing
            }
        console.log('Batch TAB vALUE####');
        console.log( $this.batch_tab_value);
        });  
      
    }

    get_time_diff(timestamp){
        let current_time=Math.floor(new Date().getTime() / 1000);
        let time=Math.floor( current_time- parseInt(timestamp));
        return time;
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