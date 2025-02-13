import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VersiculoService } from '../../services/versiculo.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  versiculo: string = '';
  letra: string = '';
  
  @ViewChild('letraInput') letraInput!: ElementRef;

  constructor(private versiculoService: VersiculoService) {}

  applyVerse(): void {
    console.log("✅ ADMIN: Aplicando versículo:", this.versiculo);
    this.versiculoService.setVerse(this.versiculo);
  }

  applyLetter(): void {
    const letraIngresada = this.letra.toLowerCase();
    console.log(`📢 ADMINISTRADOR: Aplicando letra "${letraIngresada}"`);
    this.versiculoService.sendRevealedLetter(letraIngresada);
    this.letra = ''; // Limpiar el campo de entrada después de enviar la letra
    this.letraInput.nativeElement.focus(); // Enfocar el campo de entrada después de enviar la letra
  }

  mostrarTodoVersiculo(): void {
    console.log("📢 ADMINISTRADOR: Mostrando todo el versículo");
    this.versiculoService.revealEntireVerse();
  }
}