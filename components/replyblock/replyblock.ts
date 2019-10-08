import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController, AlertController, Platform, Slides } from 'ionic-angular';
import { ConfigService } from '../../services/config';
import { ForumService } from '../../services/forum';


@Component({
    selector: 'ReplyBlock',
    templateUrl: 'replyblock.html'
})
export class ReplyBlock implements OnInit {

    @Input('reply') reply;
    @Input('edit') edit;
    @Input('delete') delete;
    @Input('is_topic') is_topic;
    @Output() edit_form = new EventEmitter();

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private config: ConfigService,
        public forumService: ForumService,
        public loadingController: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController
    ) {




    }
    ngOnInit() {
        if(this.is_topic){
        }else{
            if (this.reply.post_date) {
                let new_time = Math.floor((new Date().getTime() - Date.parse(this.reply.post_date)) / 1000);
                this.reply.post_date = new_time;
            }
        }
    }

    deletereply(reply) {
        let $this = this;

        let alert = this.alertCtrl.create({
            title: this.config.get_translation('delete_reply'),
            message: this.config.get_translation('sure_to_delete_reply'),
            buttons: [
                {
                    text: this.config.get_translation('cancel'),
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        $this.forumService.deletereply(reply).then((res: any) => {
                            if (res.status) {
                                let toast = this.toastCtrl.create({
                                    message: res.message,
                                    duration: 1000,
                                    position: 'bottom'
                                });
                                toast.present();
                            } else {
                                let toast = this.toastCtrl.create({
                                    message: res.message,
                                    duration: 1000,
                                    position: 'bottom'
                                });
                                toast.present();
                            }
                        });
                    }
                }
            ]
        });
        alert.present();
    }
    editreply(reply: any) {
        let $this = this;
        this.edit_form.emit(this.reply);
        // if(new_content){
        //     $this.forumService.editreply(reply,new_content).then((res:any)=>{
        //         if(res.status){
        //             let toast = this.toastCtrl.create({
        //                 message: res.message,
        //                 duration: 1000,
        //                 position: 'bottom'
        //             });
        //             toast.present();
        //         }else{
        //             let toast = this.toastCtrl.create({
        //                 message: res.message,
        //                 duration: 1000,
        //                 position: 'bottom'
        //             });
        //             toast.present();
        //         }
        //     });
        // }
    }


}



