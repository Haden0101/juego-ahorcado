import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersiculoService {
  private verseSubject = new BehaviorSubject<string>(localStorage.getItem('versiculo') || '');
  private channel = new BroadcastChannel('versiculo_channel'); // 🔥 Canal de comunicación entre pestañas
  private letterSubject = new BehaviorSubject<string>(localStorage.getItem('letra') || '');

  constructor() {
    // 🔥 Escuchar actualizaciones en tiempo real de otras ventanas
    this.channel.onmessage = (event) => {
      if (typeof event.data === 'string') {
        if (event.data.length === 1) {
          console.log("📡 🔄 RECIBIDO LETRA (BroadcastChannel):", event.data);
          this.letterSubject.next(event.data);
        } else {
          console.log("📡 🔄 RECIBIDO VERSÍCULO (BroadcastChannel):", event.data);
          this.verseSubject.next(event.data);
        }
      }
    };
  }

  getVerseUpdate(): Observable<string> {
    return this.verseSubject.asObservable();
  }

  setVerse(verse: string): void {
    console.log("📡 ADMIN: Enviando versículo en tiempo real:", verse);
    localStorage.setItem('versiculo', verse);
    this.verseSubject.next(verse);
    this.channel.postMessage(verse); // 🔥 Notificar a otras ventanas
  }

  getCurrentVerse(): string {
    return localStorage.getItem('versiculo') || '';
  }

  sendRevealedLetter(letra: string): void {
    console.log(`📢 SERVICIO: Enviando letra -> "${letra}"`);

    // Normalizar y eliminar diacríticos
    const normalizedLetter = letra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let revealedLetters = JSON.parse(localStorage.getItem('revealedLetters') || '[]');
    if (!revealedLetters.includes(normalizedLetter)) {
        revealedLetters.push(normalizedLetter);
    }

    localStorage.setItem('revealedLetters', JSON.stringify(revealedLetters));
    this.letterSubject.next(normalizedLetter);  
    this.channel.postMessage(normalizedLetter);
  }

  getRevealedLetter(): Observable<string> {
    return this.letterSubject.asObservable();
  }

  revealEntireVerse(): void {
    const verse = this.getCurrentVerse();
    if (verse) {
      verse.split('').forEach(letter => {
        if (letter !== ' ') {
          this.sendRevealedLetter(letter);
        }
      });
    }
  }
}