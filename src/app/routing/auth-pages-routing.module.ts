// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class AuthPagesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: '../pages/home/home.module#HomePageModule' },
  { path: 'configuracion-servicio', loadChildren: '../pages/configuracion-servicio/configuracion-servicio.module#ConfiguracionServicioPageModule' },
  { path: 'configuracion', loadChildren: '../pages/configuracion/configuracion.module#ConfiguracionPageModule' },
  { path: 'detalle-item-bitacora', loadChildren: '../pages/detalle-item-bitacora/detalle-item-bitacora.module#DetalleItemBitacoraPageModule' },
  { path: 'bitacora', loadChildren: '../pages/bitacora/bitacora.module#BitacoraPageModule' },
  { path: 'actividades/:param', loadChildren: '../pages/actividades/actividades.module#ActividadesPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthPagesRoutingModule { }
