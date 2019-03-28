import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  constructor(public navParams: NavParams) { }

  ngOnInit() {
    const data = this.navParams.data;
    console.log('Data: ', data);
    setTimeout(() => {
      data.modal.dismiss();
    }, 2000)
  }

}
