import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleItemBitacoraPage } from './detalle-item-bitacora.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleItemBitacoraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleItemBitacoraPage]
})
export class DetalleItemBitacoraPageModule {}
