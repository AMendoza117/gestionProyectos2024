import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rc',
  templateUrl: './rc.component.html',
  styleUrls: ['./rc.component.css']
})
export class RCComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showChat = false;
  newMessage = '';
  messages: { content: string; type: 'user' | 'server' }[] = [];

  toggleChat() {
    this.showChat = !this.showChat;
    if (!this.showChat) {
      console.log('Chat cerrado');
    }
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ content: this.newMessage, type: 'user' });
      // Puedes agregar aquí la lógica para enviar el mensaje a un servidor o realizar otras acciones
      this.newMessage = '';
      // Si es el primer mensaje, el server responde "En breve un agente te atenderá"
      if (this.messages.length === 1) {
        setTimeout(() => {
          this.messages.push({ content: 'En breve un agente te atenderá', type: 'server' });
        }, 1500);
      }
    }
  }

}
