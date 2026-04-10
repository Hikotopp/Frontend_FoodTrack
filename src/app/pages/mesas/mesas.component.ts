import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent {

  mesas: number[] = [];

  constructor(private router: Router) {
    this.agregarMesa();
  }

  agregarMesa() {
    const nueva = this.mesas.length + 1;
    this.mesas.push(nueva);
  }

  quitarMesa() {
    if (this.mesas.length > 0) {
      this.mesas.pop();
    }
  }

  irAMesa(id: number) {
    console.log("Mesa seleccionada:", id);
  }

  cerrarSesion() {
    this.router.navigate(['/']);
  }
}