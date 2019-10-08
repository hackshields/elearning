import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController,LoadingController, ToastController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../services/config';
import { CourseService } from '../../services/course';
import { UserService } from '../../services/users';
import { GroupService } from '../../services/group';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-groupdirectory',
  templateUrl: 'groupdirectory.html'
})
export class GroupdirectoryPage implements OnInit{

    profilePage=ProfilePage;
    userdata:any;
    loadmore=1;
    initial_group:any;
    filter:any;

    /* filter options */
    sortby:any='';
    filterby:any='';
    sortSelectOptions: any;
    filterSelectOptions: any;
    args:any;

    searchTerm: string = '';


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
        let $this=this;
        console.log('init GroupdirectoryPage');
        let args={};
        this.args={};
        $this.loadmore=0;
        this.get_groups('ngoninit',args).then((resolve:any)=>{
            if(resolve.length==$this.config.batch.limit){
                $this.loadmore=1;
            }
        });
    }

    doInfinite($event){
        let $this=this;
        let args={};
        args=this.args;
        $this.loadmore=0;
        this.get_groups('infinite',args).then((resolve:any)=>{
            if(resolve.length==$this.config.batch.limit){
                $this.loadmore=1;
            }
            $event.complete();
        });
      
    }
    doRefresh($event){
        let $this=this;
        let args={};
        this.args={};
        $this.loadmore=0;
        this.get_groups('refresh',args).then((resolve:any)=>{
            if(resolve.length==$this.config.batch.limit){
                $this.loadmore=1;
            }
            $event.complete();
        });
        this.reset();
    }

    reset(){
        this.sortby='';
        this.filterby='';
        this.searchTerm = '';
        this.args = {};
    }

    get_groups(activity,args){
        let $this=this;
        let loading = this.loadingCtrl.create({
                content: '<img src="assets/images/bubbles.svg">',
                duration: 3000,//this.config.get_translation('loadingresults'),
                spinner:'hide',
                showBackdrop:true,
            });
        loading.present();

        return new Promise((resolve)=>{
            $this.groupService.get_all_groups(activity,args).then((res:any)=>{
                if(res.status){

                }else{
                    let toast = this.toastCtrl.create({
                            message: res.message,
                            duration: 3000,
                            position: 'bottom'
                        });
                    toast.present();
                }
                loading.dismiss();
                resolve(res);
            });  
        });
    }
    /* sort by groups and batches */
    onSortOptions($event:any){ 
        let $this=this;
        this.sortby= $event;
        this.args.type = this.sortby;
        $this.loadmore=0;
        this.get_groups('type',this.args).then((resolve:any)=>{
            if(resolve.length==$this.config.batch.limit){
                $this.loadmore=1;
            }
        });
    }
    /* filter by alphabet , lastActive , newlyCreated  and mostMembers */
    onFilterOptions($event:any){ 
        let $this=this;
        this.filterby= $event;
        this.args.filterby = this.filterby;
        $this.loadmore=0;
        this.get_groups('filterby',this.args).then((resolve:any)=>{
            if(resolve.length==$this.config.batch.limit){
                $this.loadmore=1;
            }
        });
    }

    ionViewDidLoad() {
        this.sortSelectOptions = {
            title : this.config.get_translation('sort_options'),
            okText:this.config.get_translation('okay'),
            cancelText:this.config.get_translation('dismiss'),
        };
        this.filterSelectOptions = {
            title : this.config.get_translation('filter_options'),
            okText:this.config.get_translation('okay'),
            cancelText:this.config.get_translation('dismiss'),
        };
    }

/*    activateFilters(){
        this.activateFilterBlock=true;
    }*/

    /* Search by keyword */
    onSearchInput(){
        console.log('onSearchInput');
        console.log(this.searchTerm);
        let $this=this;
        if(this.searchTerm){
            if(this.searchTerm.length>=3){
                // make api hit
                let args={};
                args={
                    'search':$this.searchTerm
                }
                this.args.search = $this.searchTerm;
                this.loadmore=0;
                this.get_groups('search',this.args).then((resolve:any)=>{
                    console.log('onSearchInput res');
                    if(resolve.length==$this.config.batch.limit){
                        $this.loadmore=1;
                    }
                });
            }else{
                // do nothing
            }
        }
    }
/*
    applyFilters(){
        let $this=this;
        console.log('applyFilters');
        let filter=this.fetchFiltersSorters();
        let args={};
        // args.filter=filter;
        this.filter=args;
        this.loadmore=0;
        this.get_groups('filter',args).then((resolve:any)=>{
            console.log('applyFilters');
            if(resolve.data.length==$this.config.batch.limit){
                $this.loadmore=1;
            }
        });
    }

    fetchFiltersSorters(){
        let filter={
           'alphabetical':[],
           'newlyCreated':[],
           'lastActive':[],
           'mostMembers':[]
        };
        if(this.selectedAlphabetical){
            if(this.selectedAlphabetical.length){
                filter.alphabetical=this.selectedAlphabetical;
            }
        }
        if(this.selectedNewlyCreated){
            if(this.selectedNewlyCreated.length){
                filter.newlyCreated=this.selectedNewlyCreated;
            }
        }
        if(this.selectedLastActive){
            if(this.selectedLastActive.length){
                filter.lastActive=this.selectedLastActive;
            }
        }
        if(this.selectedMostMembers){
            if(this.selectedMostMembers.length){
                filter.mostMembers=this.selectedMostMembers;
            }
        }
        console.log(filter);
        return filter;
    }*/

}