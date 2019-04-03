import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    loadChildren: "./tabs/tabs.module#TabsPageModule"
  },
  { path: "login", loadChildren: "./pages/login/login.module#LoginPageModule" },
  {
    path: "welcome",
    loadChildren: "./pages/welcome/welcome.module#WelcomePageModule"
  },
  {
    path: "loading",
    loadChildren: "./pages/loading/loading.module#LoadingPageModule"
  },
  {
    path: "app",
    canActivate: [AuthGuard],
    loadChildren: "./routing/auth-pages-routing.module#AuthPagesRoutingModule"
  },
  {
    path: "tabs",
    canActivate: [AuthGuard],
    loadChildren: "./tabs/tabs.router.module#TabsPageRoutingModule"
  },
  {
    path: "terminos",
    loadChildren: "./pages/terminos/terminos.module#TerminosPageModule"
  },
  {
    path: "aviso-de-privacidad",
    loadChildren:
      "./pages/aviso-de-privacidad/aviso-de-privacidad.module#AvisoDePrivacidadPageModule"
  }
];

/**
 *  // { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  // { path: 'configuracion-servicio', loadChildren: './pages/configuracion-servicio/configuracion-servicio.module#ConfiguracionServicioPageModule' },
  // { path: 'configuracion', loadChildren: './pages/configuracion/configuracion.module#ConfiguracionPageModule' },
  // { path: 'detalle-item-bitacora', loadChildren: './pages/detalle-item-bitacora/detalle-item-bitacora.module#DetalleItemBitacoraPageModule' },

  // { path: 'bitacora', loadChildren: './pages/bitacora/bitacora.module#BitacoraPageModule' },
  // { path: 'actividades/:param', loadChildren: './pages/actividades/actividades.module#ActividadesPageModule' },
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
