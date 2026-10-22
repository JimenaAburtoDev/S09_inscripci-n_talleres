import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Inscripcion {
  numero: number;
  nombre: string;
  dni: string;
  edad: number;
  correo: string;
  especialidad: string;
  turno: string;
  modalidad: string;
  nivel: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Opciones de las listas desplegables
  especialidades: string[] = ['Desarrollo', 'Redes', 'Inteligencia Artificial'];
  readonly OTRO = 'Otro';
  modalidades: string[] = ['Presencial', 'Virtual'];
  niveles: string[] = ['Principiante', 'Intermedio', 'Avanzado'];

  // Expresiones regulares de validación (reto S11 | M12)
  // DNI: exactamente 8 dígitos numéricos
  readonly PATRON_DNI = '^[0-9]{8}$';
  // Edad: solo números enteros
  readonly PATRON_EDAD = '^[0-9]+$';
  // Correo institucional: usuario@dominio.edu  o  usuario@dominio.edu.pe
  readonly PATRON_CORREO_INSTITUCIONAL =
    '^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*\\.edu(\\.pe)?$';
  readonly EDAD_MINIMA = 15;

  // Objeto vinculado al formulario
  nuevaInscripcion = this.crearVacia();

  // Arreglo en memoria local (temporal)
  listaInscripciones: Inscripcion[] = [];

  // Contador para el número de inscripción (no se repite aunque se elimine una)
  private contador = 0;

  // Número de la inscripción que se está editando (null = modo registro)
  editandoNumero: number | null = null;

  private crearVacia() {
    return {
      nombre: '',
      dni: '',
      edad: null as number | null,
      correo: '',
      especialidad: '',
      otraEspecialidad: '',
      turno: '',
      modalidad: '',
      nivel: ''
    };
  }

  get modoEdicion(): boolean {
    return this.editandoNumero !== null;
  }

  // Si eligió "Otro", se guarda lo que escribió; si no, la opción elegida
  private especialidadFinal(): string {
    return this.nuevaInscripcion.especialidad === this.OTRO
      ? this.nuevaInscripcion.otraEspecialidad.trim()
      : this.nuevaInscripcion.especialidad;
  }

  guardar(formulario: NgForm): void {
    // Si hay errores: marcar TODOS los controles como "touched" para que se
    // muestren de inmediato las alertas, y detener el guardado.
    if (formulario.invalid) {
      formulario.form.markAllAsTouched();
      return;
    }

    const datos = {
      nombre: this.nuevaInscripcion.nombre.trim(),
      dni: this.nuevaInscripcion.dni.trim(),
      edad: Number(this.nuevaInscripcion.edad),
      correo: this.nuevaInscripcion.correo.trim(),
      especialidad: this.especialidadFinal(),
      turno: this.nuevaInscripcion.turno,
      modalidad: this.nuevaInscripcion.modalidad,
      nivel: this.nuevaInscripcion.nivel
    };

    if (this.modoEdicion) {
      // Actualizar la inscripción existente
      this.listaInscripciones = this.listaInscripciones.map(i =>
        i.numero === this.editandoNumero ? { ...i, ...datos } : i
      );
    } else {
      // Crear una nueva inscripción
      this.contador++;
      this.listaInscripciones.push({ numero: this.contador, ...datos });
    }

    this.limpiarFormulario(formulario);
  }

  editarInscripcion(item: Inscripcion): void {
    this.editandoNumero = item.numero;

    const esPredefinida = this.especialidades.includes(item.especialidad);
    this.nuevaInscripcion = {
      nombre: item.nombre,
      dni: item.dni,
      edad: item.edad,
      correo: item.correo,
      especialidad: esPredefinida ? item.especialidad : this.OTRO,
      otraEspecialidad: esPredefinida ? '' : item.especialidad,
      turno: item.turno,
      modalidad: item.modalidad,
      nivel: item.nivel
    };

    // Subir al formulario
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelarEdicion(formulario: NgForm): void {
    this.limpiarFormulario(formulario);
  }

  limpiarFormulario(formulario: NgForm): void {
    this.editandoNumero = null;
    this.nuevaInscripcion = this.crearVacia();
    formulario.resetForm(this.nuevaInscripcion); // limpia valores y estados (touched/dirty)
  }

  eliminarInscripcion(numero: number, formulario: NgForm): void {
    this.listaInscripciones = this.listaInscripciones.filter(i => i.numero !== numero);
    if (this.editandoNumero === numero) {
      this.limpiarFormulario(formulario); // si se eliminaba la que se editaba
    }
  }

  // Indicadores (se recalculan solos al cambiar la lista)
  get totalInscritos(): number {
    return this.listaInscripciones.length;
  }

  get totalManana(): number {
    return this.listaInscripciones.filter(i => i.turno === 'Mañana').length;
  }

  get totalNoche(): number {
    return this.listaInscripciones.filter(i => i.turno === 'Noche').length;
  }

  // Clase CSS según la especialidad
  claseEspecialidad(esp: string): string {
    switch (esp) {
      case 'Desarrollo': return 'badge badge-desarrollo';
      case 'Redes': return 'badge badge-redes';
      case 'Inteligencia Artificial': return 'badge badge-ia';
      default: return 'badge badge-otro';
    }
  }
}
