import { Injectable } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
// import { Component,OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Platform, ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/toPromise';
import { AuthenticationService } from "./authentication";
import { ConfigService } from "./config";
import { Storage } from '@ionic/storage';
import { ChatService } from "./chat";


@Injectable()
export class MembersService {

    all_members: any;

    constructor(
        private http: Http,
        private storage: Storage,
        private toastCtrl: ToastController,
        private auth: AuthenticationService,
        private config: ConfigService,
        private loadingCtrl: LoadingController,
        private chatService:ChatService
    ) { }

    get_all_members(action, args) {
        let $this = this;
        return new Promise((resolve) => {
            switch (action) {
                case 'refresh':
                    $this.all_members = [];
                    $this.storage.remove('allmembers').then((x) => {
                        $this.get_members(action, args).then((res) => {
                            console.log('refresh');
                            console.log(res);
                            resolve(res);
                        });
                    });
                    break;
                case 'ngoninit':
                    $this.storage.get('allmembers').then((allmembers) => {
                        if (allmembers && allmembers.length) {
                            console.log('ngoninit n');
                            console.log(allmembers);
                            $this.all_members = allmembers;
                            $this.call_for_online_status(allmembers);  //online-offline-status
                            resolve(allmembers);
                        } else {
                            $this.get_members(action, args).then((res) => {
                                console.log(res);
                                resolve(res);
                            });
                        }
                    });
                    break;
                case 'infinite':
                    if ($this.all_members && $this.all_members.length) {
                        $this.get_members(action, args).then((res) => {
                            console.log(res);
                            resolve(res);
                        });
                    }
                    break;
                case 'search':
                    $this.all_members = [];
                    $this.get_members(action, args).then((res) => {
                        console.log(res);
                        resolve(res);
                    });
                    break;
                case 'sortby':
                    $this.all_members = [];
                    $this.get_members(action, args).then((res) => {
                        console.log(res);
                        resolve(res);
                    });
                    break;
                case 'filterby':
                    $this.all_members = [];
                    $this.get_members(action, args).then((res) => {
                        console.log(res);
                        resolve(res);
                    });
                    break;
                default:
            }
        });
    }


    get_members(action, args) {
        let $this = this;
        args.per_page = $this.config.members_directory.per_page;
        args.page = ($this.all_members && $this.all_members.length) ? ($this.all_members.length / $this.config.members_directory.per_page) + 1 : 1
        let data = args;
        return new Promise((resolve) => {
            $this.http.post(`${$this.config.baseUrl}user/getallmembers`, data)
                .map(res => res.json())
                .subscribe(res => {
                    if (res.status) {
                        if (res.data.length) {
                            res.data.map((x, i) => {
                                if ($this.all_members) {
                                    $this.all_members.push(x);
                                } else {
                                    $this.all_members = [];
                                }
                            });
                            $this.call_for_online_status(res.data); //online-offline-status
                        }
                    } else {
                        $this.all_members = [];
                    }
                    this.storage.set('allmembers', $this.all_members);
                    // this.config.addToTracker('allmembers',parseInt($this.all_members.length));
                    resolve(res.data);
                });
        });
    }


    call_for_online_status(allmembers){
        if(this.config.chat.enable_chat){
            let $this=this;
            if(Array.isArray(allmembers) && Array.isArray(allmembers) && $this.all_members.length ){
                allmembers.map((x,i)=>{
                    let index_m=$this.all_members.findIndex((element)=>{return element.ID==x.ID} );
                    if( (index_m > -1) && ($this.all_members[index_m].ID==x.ID)){
                        $this.chatService.check_user_status(x.ID).then((status)=>{
                            $this.all_members[index_m].status=status;
                        });
                    } 
                });
            }
        }
    }

    get_member_profile_details(current_member_id,refresh=false){
        let $this=this;
        return new Promise((resolve)=>{
            let track_member=$this.config.trackComponents('members');

            if(Array.isArray(track_member) && track_member.indexOf(current_member_id) !=-1 && !refresh){
                $this.storage.get('member_'+current_member_id).then((member_deatils) => {
                    if (member_deatils) {
                        resolve(member_deatils);
                    } else {
                        let data={
                            'user_id':current_member_id
                        }
                        $this.http.post(`${$this.config.baseUrl}user/getmemberbyid`, data)
                        .map(res => res.json())
                        .subscribe(res => {
                            if (res.status && res.data) {
                                $this.storage.set('member_'+current_member_id, res.data);
                                $this.config.addToTracker('members',parseInt(current_member_id));
                                resolve(res.data);
                            } else {
                                resolve({});
                            }
                            
                        });
                    }
                });
            }else{
                let data={
                    'user_id':current_member_id
                }
                $this.http.post(`${$this.config.baseUrl}user/getmemberbyid`, data)
                .map(res => res.json())
                .subscribe(res => {
                    if (res.status && res.data) {
                        $this.storage.set('member_'+current_member_id, res.data);
                        $this.config.addToTracker('members',parseInt(current_member_id));
                        resolve(res.data);
                    } else {
                        resolve({});
                    }
                    
                });
            }
    
        });
    }



}        