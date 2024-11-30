import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  // Default Route Redirection: Redirect user to login if they are not authenticated.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'map',
    canActivate: [AuthGuard],  // Protect the route with the AuthGuard
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  // Optionally add a wildcard route for 404 error page
  {
    path: '**',
    redirectTo: 'login',  // Redirect to login if an unknown route is visited
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })  // Preload all lazy-loaded modules
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
