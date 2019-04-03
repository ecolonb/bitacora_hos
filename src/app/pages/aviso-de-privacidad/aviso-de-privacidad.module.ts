import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AvisoDePrivacidadPage } from './aviso-de-privacidad.page';

const routes: Routes = [
  {
    path: '',
    component: AvisoDePrivacidadPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AvisoDePrivacidadPage]
})
export class AvisoDePrivacidadPageModule {}
