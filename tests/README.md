# Pruebas – LMS Créditos

## Estructura

```
tests/
  unit/         # Pruebas unitarias (servicios, utils, lógica pura)
  integration/  # Pruebas de integración (API routes, flujos)
```

## Fase actual: Preparación

Las pruebas se implementarán en fases:

- **Fase 1 (actual):** Estructura de carpetas preparada
- **Fase 4:** Unit tests de servicios (ClienteService, IngresoService, etc.)
- **Fase 5:** Unit tests de DocumentoService y generación .docx
- **Fase 6:** Integration tests de API routes

## Stack de testing (recomendado)

```bash
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

O con Vitest (más rápido con Next.js):
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react
```
