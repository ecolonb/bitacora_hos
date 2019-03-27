import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'configuracion-servicio', loadChildren: './pages/configuracion-servicio/configuracion-servicio.module#ConfiguracionServicioPageModule' },
  { path: 'configuracion', loadChildren: './pages/configuracion/configuracion.module#ConfiguracionPageModule' },
  { path: 'detalle-item-bitacora', loadChildren: './pages/detalle-item-bitacora/detalle-item-bitacora.module#DetalleItemBitacoraPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'bitacora', loadChildren: './pages/bitacora/bitacora.module#BitacoraPageModule' },
  { path: 'actividades', loadChildren: './pages/actividades/actividades.module#ActividadesPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
