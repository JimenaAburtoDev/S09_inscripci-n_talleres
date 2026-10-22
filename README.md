# Sistema de Inscripción a Talleres

Aplicación Angular 17 (NgModule) con Template Driven Forms.

**Autora:** Aburto Rodríguez, Yojana Jimena Elsa
**Sesión:** S11 | M12 - Validaciones Avanzadas y Estados del Formulario

## Ejecutar

```
npm install
npm start
```

Se abre en http://localhost:4200

## Nuevas validaciones (S11 | M12)

| Campo | Regla | Implementación |
|-------|-------|----------------|
| **DNI** | Exactamente 8 dígitos numéricos | `required` + `pattern="^[0-9]{8}$"` |
| **Edad** | Mínimo 15 años (entero) | `required` + `min=15` + `pattern="^[0-9]+$"` |
| **Correo** | Formato válido y dominio institucional (`.edu` / `.edu.pe`) | `required` + `email` + `pattern` |

## Control de estados y envío

- Los mensajes de error se muestran con `*ngIf` solo cuando el campo está **`invalid` y `touched`**, para no llenar la pantalla de rojo al cargar.
- Al presionar **Registrar inscripción** con errores se ejecuta `formulario.form.markAllAsTouched()` y se detiene el guardado, lo que muestra de inmediato todas las alertas pendientes.
- El botón de envío ya no se deshabilita: así el usuario siempre puede hacer clic y ver qué campos debe corregir.

## Funciones de M11 conservadas

Listar inscripciones, editar, eliminar y limpiar formulario siguen funcionando igual (ahora también muestran DNI y edad).

## Casos de prueba (video)

1. Inscribir con DNI de 7 dígitos → debe fallar.
2. Ingresar edad 12 → debe fallar.
3. Completar datos válidos e inscribir en el taller → aparece en la lista; luego eliminar un registro.
