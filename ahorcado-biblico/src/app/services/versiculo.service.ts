import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';

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
      console.log("📡 🔄 RECIBIDO (BroadcastChannel):", event.data);
      this.verseSubject.next(event.data);
      this.letterSubject.next(event.data);
    };
  }

  getVerseUpdate() {
    return this.verseSubject.asObservable();
  }

  setVerse(verse: string) {
    console.log("📡 ADMIN: Enviando versículo en tiempo real:", verse);
    localStorage.setItem('versiculo', verse);
    this.verseSubject.next(verse);
    this.channel.postMessage(verse); // 🔥 Notificar a otras ventanas
  }

  getCurrentVerse(): string {
    return localStorage.getItem('versiculo') || '';
  }

  sendVerse(verse: string) {
    this.verseSubject.next(verse);
  }

  sendRevealedLetter(letra: string): void {
    console.log(`📢 SERVICIO: Enviando letra -> "${letra}"`);

    let revealedLetters = JSON.parse(localStorage.getItem('revealedLetters') || '[]');
    if (!revealedLetters.includes(letra)) {
        revealedLetters.push(letra);
    }

    localStorage.setItem('revealedLetters', JSON.stringify(revealedLetters));
    this.letterSubject.next(letra);  
    this.channel.postMessage(letra);
  }

  getRevealedLetter() {
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