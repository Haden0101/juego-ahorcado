import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JugadorComponent } from "./components/jugador/jugador.component";
import { AdministradorComponent } from "./components/administrador/administrador.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ahorcado-biblico';
}
