import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActividadesPage } from './actividades.page';

const routes: Routes = [
  {
    path: '',
    component: ActividadesPage
  }
];
// declarations:[ActStatusPipe], // <---
//   imports:[CommonModule],
//   exports:[ActStatusPipe] 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)

  ],
  declarations: [ActividadesPage]
})
export class ActividadesPageModule { }
