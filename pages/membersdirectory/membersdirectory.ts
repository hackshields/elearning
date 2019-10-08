import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController,LoadingController, ToastController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../services/config';
import { UserService } from '../../services/users';
import { MembersService } from '../../services/members';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-membersdirectory',
  templateUrl: 'membersdirectory.html'
})
export class MembersDirectoryPage implements OnInit{

    profilePage=ProfilePage;
    loadmore=1;
    args:any;

    /* filter options */
    filterby='';
    filterSelectOptions: any;
    sortby='';
    sortSelectOptions: any;

    /* search options */
    searchTerm: any = '';
   



    constructor(public navCtrl: NavController, 
                public config: ConfigService,
                public membersService: MembersService,
                public navParams: NavParams,
                private nav: NavController,
                private toastCtrl:ToastController,
                public loadingCtrl: LoadingController
        ){}


    ngOnInit(){
        let $this=this;
        console.log('init GroupdirectoryPage');
        let args={};
        this.args=args;
        $this.loadmore=0;
        this.get_members('ngoninit',args).then((resolve:any)=>{
            if(resolve.length==$this.config.members_directory.per_page){
                $this.loadmore=1;
            }
        });
    }

    doInfinite($event){
        let $this=this;
        let args={};
        args=this.args;
        $this.loadmore=0;
        this.get_members('infinite',args).then((resolve:any)=>{
            if(resolve.length==$this.config.members_directory.per_page){
                $this.loadmore=1;
            }
            $event.complete();
        });
      
    }
    doRefresh($event){
        let $this=this;
        $this.reset_fil();
        let args={};
        this.args=args;
        $this.loadmore=0;
        this.get_members('refresh',args).then((resolve:any)=>{
            if(resolve.length==$this.config.members_directory.per_page){
                $this.loadmore=1;
            }
            $event.complete();
        });
    }

    reset_fil(){
        let $this=this;
        $this.filterby='';
        $this.sortby='';
        $this.searchTerm='';
    }

    get_members(activity,args){
        let $this=this;
        let loading = this.loadingCtrl.create({
                content: '<img src="assets/images/bubbles.svg">',
                duration: 3000,//this.config.get_translation('loadingresults'),
                spinner:'hide',
                showBackdrop:true,
            });
        loading.present();

        return new Promise((resolve)=>{
            $this.membersService.get_all_members(activity,args).then((res:any)=>{
                if(res.status){

                }else{
                    let toast = this.toastCtrl.create({
                            message: res.message,
                            duration: 3000,
                            position: 'bottom'
                        });
                    toast.present();
                }
                console.log('loading dismiss');
                loading.dismiss();
                resolve(res);
            });  
        });
    }

    /* filter by alphabet , lastActive , newlyCreated  and mostMembers */
    onFilterOptions($event:any){ 
        let $this=this;
        let args=this.return_args_obj();
        this.args=args;
        $this.loadmore=0;
        this.get_members('filterby',args).then((resolve:any)=>{
            if(resolve.length==$this.config.members_directory.per_page){
                $this.loadmore=1;
            }
        });
    }
    onSortOptions($event:any){ 
        let $this=this;
        let args=this.return_args_obj();
        this.args=args;
        $this.loadmore=0;
        this.get_members('sortby',args).then((resolve:any)=>{
            if(resolve.length==$this.config.members_directory.per_page){
                $this.loadmore=1;
            }
        });
    }
    return_args_obj(){
        let $this=this;
        let S_term=false;
        if(this.searchTerm){
            S_term=$this.searchTerm;
        }
        let args:any={
            'search_terms':S_term,
            'type':$this.sortby,
            'scope':$this.filterby
        }
        return args;
    }
    ionViewDidLoad() {
        this.filterSelectOptions = {
            title : this.config.get_translation('filter_options'),
            okText:this.config.get_translation('okay'),
            cancelText:this.config.get_translation('dismiss'),
        };
        this.sortSelectOptions = {
            title : this.config.get_translation('sort_options'),
            okText:this.config.get_translation('okay'),
            cancelText:this.config.get_translation('dismiss'),
        };

    }


    /* Search by keyword */
    onSearchInput(){
        console.log('onSearchInput');
        console.log(this.searchTerm);
        let $this=this;
        if(this.searchTerm){
            if(this.searchTerm.length>=3){
                let args={};
                let S_term=false;
                if(this.searchTerm){
                    S_term=$this.searchTerm;
                }
                args={
                    'search_terms':S_term,
                    'type':$this.filterby
                }
                this.args=args;
                this.loadmore=0;
                this.get_members('search',args).then((resolve:any)=>{
                    console.log('onSearchInput res');
                    if(resolve.length==$this.config.members_directory.per_page){
                        $this.loadmore=1;
                    }
                });
            }else{
                // do nothing
            }
        }
    }
}