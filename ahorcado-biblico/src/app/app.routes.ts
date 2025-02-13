import { Routes } from '@angular/router';
import { JugadorComponent } from './components/jugador/jugador.component';
import { AdministradorComponent } from './components/administrador/administrador.component';

export const routes: Routes = [
  { path: '', redirectTo: 'jugador', pathMatch: 'full' }, // Redirige a /jugador por defecto
  { path: 'jugador', component: JugadorComponent }, // Página del jugador
  { path: 'admin', component: AdministradorComponent }, // Página del administrador
];
