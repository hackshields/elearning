import { Component, OnInit, ViewChild } from '@angular/core';
import { App, Platform, NavController, MenuController,LoadingController } from 'ionic-angular';

//import { StatusBar, Splashscreen } from 'ionic-native';

import { SplashScreen } from '@ionic-native/splash-screen';
import { Intro } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { BlogPage } from '../pages/blog/blog';
import { DirectoryPage } from '../pages/directory/directory';
import { GroupdirectoryPage } from '../pages/groupdirectory/groupdirectory';
import { MembersDirectoryPage } from '../pages/membersdirectory/membersdirectory';
import { ForumdirectoryPage } from '../pages/forumdirectory/forumdirectory'; 

import { InstructorsPage } from '../pages/instructors/instructors';
import { ConfigService } from '../services/config';
import { Storage } from '@ionic/storage';
import { ImgcacheService } from '../services/imageCache';
// import { AdMob } from "ionic-admob";

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  styles:any;
  tabsPage = TabsPage;
  intro:Intro;
  pages:any[]=[];

  rootPage: any = 'Tabs';
  loader: any;

  @ViewChild('nav') nav:NavController;
  
    constructor(private config:ConfigService,
        private platform: Platform, 
        private menuCtrl: MenuController,
        private loadingCtrl:LoadingController,
        private app:App,
        private storage:Storage,
        private imgcacheService:ImgcacheService,
        // private admob: AdMob,
        public splashScreen: SplashScreen
        ) {


        this.presentLoading();

        platform.ready().then(() => {
           
            // this.config.showAds('home');
            // this.config.showAds('global');


            if(this.config.settings.rtl){
               platform.setDir('rtl', true);
            }
            this.storage.get('introShown').then((result) => {
                this.splashScreen.hide();
                if(result){

                    imgcacheService.initImgCache().subscribe(() => {
                      this.rootPage = TabsPage;
                      this.loader.dismiss();
                    });
                    
                    
                } else {
                    this.rootPage = Intro;
                    
                    let nav = this.app.getRootNav();
                    imgcacheService.initImgCache().subscribe(() => {
                      nav.setRoot(this.rootPage);
                      this.loader.dismiss();
                    });
                    
                }
            });
        });

        //Tracker
        
        this.pages =[
          { title: config.get_translation('home_menu_title'), component: TabsPage, index: 0, hide:false},
          { title: config.get_translation('directory_menu_title'), component: DirectoryPage, index: 2, hide:false},
          { title: config.get_translation('instructors_menu_title'), component: InstructorsPage, index: 3, hide:false},
          { title: config.get_translation('blog_menu_title'), component: BlogPage, index: 1, hide:false},
          { title: config.get_translation('contact_menu_title'), component: ContactPage, index: 4, hide:false}
        ];

        if(this.config.batch.enable_batch){
          this.pages.push({ title: config.get_translation('group_directory'), component: GroupdirectoryPage, index: 5, hide:false});
        
        }

        if(this.config.members_directory.enable_members_directory){
          this.pages.push({ title: config.get_translation('members_directory'), component: MembersDirectoryPage, index: 6, hide:false});
        }

        if(this.config.forum.enable_forum){
          this.pages.push({ title: config.get_translation('forum_directory'), component: ForumdirectoryPage, index: 6, hide:false});
        }
    }

    ngOnInit(){
        this.config.initialize();
    }

    presentLoading() {




        this.loader = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 5000,//this.config.get_translation('loadingresults'),
            spinner:'hide',
            showBackdrop:true,
        });
        this.loader.present();
    }

    onLoad(page: any){
        let nav = this.app.getRootNav();

        nav.setRoot(page.component,{index:page.index});
        //nav.push(page);
        //this.app.getRootNav().push(page);
        //this.nav.push(page);
        //this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
