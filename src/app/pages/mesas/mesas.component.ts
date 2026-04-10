import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MesaService, Mesa } from '../../services/mesa.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  mesas: Mesa[] = [];

  constructor(
    private mesaService: MesaService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.mesaService.listar().subscribe({
      next: (data) => {
        this.mesas = data;
      },
      error: (err) => {
        console.error('Error al cargar mesas', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  agregarMesa(): void {
    const nuevoNumero = this.mesas.length > 0 ? Math.max(...this.mesas.map(m => m.numero)) + 1 : 1;
    const nuevaMesa: Mesa = {
      numero: nuevoNumero,
      capacidad: 4,
      estado: 'LIBRE',
      ubicacion: 'Sala principal'
    };
    this.mesaService.crear(nuevaMesa).subscribe({
      next: () => this.cargarMesas(),
      error: (err) => console.error(err)
    });
  }

  quitarMesa(): void {
    if (this.mesas.length > 0) {
      const ultimaMesa = this.mesas[this.mesas.length - 1];
      if (ultimaMesa.id) {
        this.mesaService.eliminar(ultimaMesa.id).subscribe({
          next: () => this.cargarMesas(),
          error: (err) => console.error(err)
        });
      }
    }
  }

  cambiarEstado(mesa: Mesa): void {
    let nuevoEstado: string;
    if (mesa.estado === 'LIBRE') nuevoEstado = 'OCUPADA';
    else if (mesa.estado === 'OCUPADA') nuevoEstado = 'RESERVADA';
    else nuevoEstado = 'LIBRE';
    
    if (mesa.id) {
      this.mesaService.cambiarEstado(mesa.id, nuevoEstado).subscribe({
        next: () => this.cargarMesas(),
        error: (err) => console.error(err)
      });
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}