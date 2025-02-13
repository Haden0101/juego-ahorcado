import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { VersiculoService } from '../../services/versiculo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jugador',
  standalone: true,
  imports: [CommonModule, NgFor], 
  templateUrl: './jugador.component.html',
  styleUrls: ['./jugador.component.css']
})
export class JugadorComponent implements OnInit, OnDestroy {
  grid: { letter: string; color: string; textColor: string; revealed: boolean; }[] = [];
  revealedLetterSubscription: Subscription = new Subscription();

  constructor(private versiculoService: VersiculoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeGrid(); // Inicializar cuadrícula vacía

    // Escuchar el versículo en tiempo real
    this.versiculoService.getVerseUpdate().subscribe((verse) => {
      console.log("🎯 JUGADOR: Recibido versículo en TIEMPO REAL:", verse);
      this.updateGridWithVerse(verse);
    });

    // Escuchar letras reveladas en tiempo real
    this.revealedLetterSubscription = this.versiculoService.getRevealedLetter().subscribe((letra) => {
      console.log(`🎯 JUGADOR: Recibida letra para mostrar: ${letra}`);
      this.updateRevealedLetters(letra);
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.revealedLetterSubscription) {
      this.revealedLetterSubscription.unsubscribe();
    }
  }

  loadGridFromStorage(): void {
    const savedGrid = localStorage.getItem('gameGrid');
    if (savedGrid) {
        this.grid = JSON.parse(savedGrid); // 🚀 Restaurar cuadrícula guardada
        console.log("📌 Cuadrícula restaurada desde localStorage");
    } else {
        this.initializeGrid(); // Si no hay datos, inicializar nueva cuadrícula
    }
  }

  saveGridToStorage(): void {
    localStorage.setItem('gameGrid', JSON.stringify(this.grid)); // Guardar la cuadrícula actual
  }

  initializeGrid(): void {
    const totalCells = 25 * 6; // 6 filas x 25 columnas
    this.grid = Array.from({ length: totalCells }, () => ({
      letter: '_', // Letras ocultas por defecto
      color: 'orange', // Fondo inicial
      textColor: 'transparent', // Oculta la letra hasta que se revele
      revealed: false // Indica si la letra ha sido revelada
    }));
  }

  updateGridWithVerse(verse: string): void {
    console.log("📌 Aplicando versículo:", verse);
    if (!verse) {
      console.warn("⚠️ Versículo vacío, no se actualiza la cuadrícula.");
      return;
    }

    const rows = 6;
    const cols = 25;
    const totalCells = rows * cols;

    verse = verse.trim();
    const verseLength = verse.length;

    if (verseLength > cols) {
      console.warn("⚠️ El versículo es demasiado largo para una sola fila, se truncará.");
    }

    const centerRow = Math.floor(rows / 2);
    const rowStartIndex = centerRow * cols;
    const startIndex = rowStartIndex + Math.floor((cols - verseLength) / 2);

    verse.split('').forEach((char, i) => {
      const cellIndex = startIndex + i;
      if (cellIndex < totalCells) {
        this.grid[cellIndex].letter = char;
        this.grid[cellIndex].color = char === ' ' ? 'orange' : 'lightblue';
        this.grid[cellIndex].textColor = 'transparent'; // Mantiene las letras ocultas
        this.grid[cellIndex].revealed = false;
      }
    });

    console.log("🎯 JUGADOR: Cuadrícula con versículo aplicada:", this.grid);
  }

  updateRevealedLetters(letra: string): void {
    console.log(`🔄 JUGADOR: Letra recibida para actualizar: "${letra}"`);

    if (!letra) {
      console.warn("⚠️ Letra vacía, no se actualiza la cuadrícula.");
      return;
    }

    let updated = false;

    this.grid.forEach((cell) => {
      if (cell.letter.toLowerCase() === letra.toLowerCase() && !cell.revealed) {
        cell.revealed = true;  // ✅ Revelar la letra
        cell.color = 'yellow'; // ✅ Pintar solo coincidencias
        updated = true;
      }
    });

    if (updated) {
      console.log("✅ JUGADOR: Letras reveladas en la cuadrícula:", this.grid);
      this.cdr.detectChanges(); // 🔥 Forzar actualización del DOM
    } else {
      console.warn(`⚠️ JUGADOR: La letra "${letra}" no se encontró en la cuadrícula.`);
    }
  }

  resetGrid(): void {
    this.grid.forEach((cell) => {
      cell.revealed = false;
      cell.color = 'orange'; // Fondo predeterminado al refrescar
      cell.textColor = 'transparent';
    });

    // Cancelar la suscripción para evitar mantener la letra anterior
    if (this.revealedLetterSubscription) {
      this.revealedLetterSubscription.unsubscribe();
    }

    this.cdr.detectChanges();
    console.log("🔄 Cuadrícula reiniciada.");
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}