import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { Router } from '@angular/router';
// import { Slides } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  showSkip: boolean = true;
  //slides: Slides;
  slideOpts = {
    effect: 'flip',
    scrollbar: true
  };
  @ViewChild('welcomeSlider') slides;




  constructor(private ui: UiService, private router: Router) {
    //this.ui.desactiveSideMenu();
  }
  // @ViewChild('slides') slides;

  ngOnInit() {
    console.log('ngOnInit------------------------------------------>>')
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter------------------------------------------->>');
    this.ui.desactiveSideMenu();
  }
  public skip_() {
    console.log('Saltar intro==>>>>!')
    this.slides.slideTo(2);
  }
  public async nextSlide() {
    let indexSlide = await this.slides.isEnd();
    if (indexSlide) {
      this.router.navigate(['/tabs/actividades'], { replaceUrl: true });
      this.ui.activeSideMenu();
    }
    this.slides.slideNext();
  }
  public async slideChange() {
    let indexSlide = await this.slides.getActiveIndex();
    if (indexSlide == 2) {
      this.showSkip = false;
    } else {
      this.showSkip = true;
    }
  }
}
