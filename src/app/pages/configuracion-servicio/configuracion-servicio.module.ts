import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionServicioPage } from './configuracion-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionServicioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfiguracionServicioPage]
})
export class ConfiguracionServicioPageModule {}
