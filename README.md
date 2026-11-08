# S'Agrícola - App Mobile-First de Eventos en Mesa

Aplicación web progresiva **mobile-first** diseñada para que los clientes de un local (bar, restaurante, centro cultural) accedan escaneando un código QR desde las mesas para ver los eventos activos en tiempo real, junto con un panel de administración protegido por PIN.

---

## 🚀 Tecnologías Utilizadas

- **React 18** + **TypeScript**
- **Tailwind CSS** (estilos modernos con gradientes, glassmorphism y paleta adaptada)
- **Lucide Icons** (iconografía limpia y coherente)
- **Canvas Confetti** (efectos visuales al inscribirse o interactuar)
- **LocalStorage API** (persistencia inmediata sin base de datos)
- **Vite** (entorno de desarrollo ultrarrápido)

---

## 📱 Características Principales

### 1. Vista de Cliente (Pública)
- **Mobile-first**: Formato óptimo para pantallas de smartphones con botones grandes táctiles (44px - 56px).
- **Feed Vertical de Tarjetas**:
  - Imagen de portada en alta resolución con fallback automático.
  - Título, fecha formateada en español, hora, categoría, precio y ubicación.
  - Badge dinámico de tiempo restante (*"¡HOY!"*, *"Mañana"*, *"En X días"*).
  - Filtro interactivo por categorías (*Música*, *Gastronomía*, *Juegos*, *Fiesta*, *Todos*) y buscador en tiempo real.
  - **Filtro estricto de visibilidad**: Solo se muestran los eventos en estado **Activo**.
- **Modal de Detalle Completo**:
  - Apertura suave con animación `slide-up` y fondo desenfocado (*backdrop blur*).
  - Descripción larga detallada, aforo, ubicación y fecha extendida.
  - Botón táctil principal **"Saber más / Apuntarse"** que lanza una celebración de confeti y abre el enlace externo en una nueva pestaña.
  - Acciones rápidas: **Compartir con la mesa** (Web Share API / Portapapeles) y **Añadir a Google Calendar**.
- **Generador de QR de Mesa**:
  - Botón en la cabecera para visualizar y descargar el código QR de la mesa (#4), permitiendo escanear la app desde un segundo móvil en la misma red local.

---

### 2. Vista de Administrador (Privada)
- **Acceso Protegido**:
  - Botón discreto en el pie de página (*"Acceso Administración (PIN)"*) o mediante acceso por hash `#admin`.
  - Teclado numérico táctil para ingresar el PIN de acceso (**PIN por defecto: `1234`**).
- **Panel de Control (Dashboard)**:
  - Resumen de métricas: Total de eventos, Activos (visibles) y Ocultos (borradores).
  - Filtros rápidos por estado (*Todos*, *Activos*, *Ocultos*) y buscador.
  - **Interruptor (Toggle Switch)** en cada tarjeta para alternar al instante entre **"Activo"** y **"Oculto"**, con persistencia inmediata en LocalStorage.
  - **Botón "Crear Nuevo Evento"**:
    - Formulario modal con validación de campos obligatorios.
    - Selector rápido de imágenes predefinidas (música, cócteles, catas, juegos, etc.) o URL personalizada.
    - Campos: Título, Descripción corta (tarjeta), Descripción larga (detalle), Fecha, Hora, Categoría, Ubicación, Precio y URL Externa.
  - **Editar Eventos**: Permite modificar cualquier evento existente con el formulario precargado.
  - **Eliminar Eventos**: Modal de confirmación para evitar borrados accidentales.
  - **Previsualizar como cliente**: Permite abrir la vista de cliente de cualquier evento.
  - **Botón de Restaurar**: Restablece los datos de prueba iniciales en cualquier momento.

---

## 🛠️ Cómo Iniciar el Proyecto

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir en el navegador: [http://localhost:5173](http://localhost:5173) o la IP de red local mostrada en consola para probar desde el smartphone.

3. **Construir para producción:**
   ```bash
   npm run build
   ```

---

## 🔑 Credenciales de Acceso

- **PIN de Administrador:** `1234`
- **Acceso rápido por URL:** Añade `#admin` al final de la URL en el navegador (ejemplo: `http://localhost:5173/#admin`).
