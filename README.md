# Neuri - Diario de Salud 💝

Una aplicación web para el seguimiento diario de la salud de niños, diseñada especialmente para familias que necesitan llevar un registro detallado de síntomas, emociones y convulsiones.

## 🚀 Características

- **Registro Diario**: Seguimiento de emociones, síntomas y convulsiones
- **Asistente de Voz**: Interfaz conversacional para facilitar el registro
- **Análisis de Patrones**: Detección automática de tendencias y correlaciones
- **Reportes Visuales**: Generación de reportes semanales y mensuales
- **Base de Datos Persistente**: Almacenamiento seguro en MongoDB
- **Interfaz Amigable**: Diseño cálido y accesible para toda la familia

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Vite** como bundler

### Backend
- **Node.js** con Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MongoDB (local o Atlas)

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd neuri-health-diary
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/neuri-health-diary
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001

# Frontend Environment Variables
VITE_API_URL=http://localhost:3001/api
```

4. **Iniciar MongoDB**
```bash
# Si usas MongoDB local
mongod

# O usar MongoDB Atlas (configurar MONGODB_URI en .env)
```

## 🚀 Ejecución

### Desarrollo

1. **Iniciar el servidor backend**
```bash
npm run server
```

2. **Iniciar el frontend (en otra terminal)**
```bash
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Producción

```bash
# Construir el frontend
npm run build

# El servidor puede servir archivos estáticos si se configura
npm run server
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/profile` - Actualizar perfil

### Diario
- `GET /api/diary/entries` - Obtener todas las entradas
- `GET /api/diary/entries/:date` - Obtener entrada por fecha
- `POST /api/diary/entries` - Crear nueva entrada
- `PUT /api/diary/entries/:id` - Actualizar entrada
- `DELETE /api/diary/entries/:id` - Eliminar entrada

## 🗄️ Estructura de la Base de Datos

### Usuarios (Users)
```javascript
{
  email: String (único),
  password: String (encriptado),
  name: String,
  childName: String,
  childAge: Number,
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Entradas del Diario (DiaryEntries)
```javascript
{
  userId: ObjectId (referencia a User),
  date: String,
  hadSeizure: Boolean,
  seizureTime: String,
  symptoms: [String],
  emotion: String,
  observations: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Seguridad

- **Autenticación JWT** con tokens de 7 días de duración
- **Contraseñas encriptadas** con bcryptjs
- **Validación de datos** en frontend y backend
- **Middleware de autenticación** para rutas protegidas

## 🎯 Funcionalidades Principales

### 1. Registro de Usuario
- Validación completa de formularios
- Encriptación segura de contraseñas
- Generación automática de tokens JWT

### 2. Diario de Salud
- Registro diario de emociones (6 estados)
- Seguimiento de convulsiones con hora
- Registro de 10 síntomas diferentes
- Observaciones adicionales en texto libre

### 3. Asistente de Voz
- Reconocimiento de voz en español
- Conversación guiada paso a paso
- Análisis de patrones en tiempo real
- Síntesis de voz para respuestas

### 4. Análisis y Reportes
- Detección automática de patrones
- Reportes semanales y mensuales
- Exportación de datos
- Visualización de tendencias

## 🔧 Scripts Disponibles

```bash
npm run dev          # Iniciar frontend en desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
npm run server       # Iniciar servidor backend
npm run lint         # Ejecutar ESLint
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 💝 Hecho con amor para las familias

Neuri está diseñado pensando en las familias que necesitan llevar un seguimiento cuidadoso de la salud de sus hijos. Cada característica ha sido desarrollada con empatía y comprensión hacia las necesidades reales de los usuarios.