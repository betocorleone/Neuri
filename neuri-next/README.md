# Neuri — Netlify

Aplicación de seguimiento familiar de síntomas. Código MIT.

## Desarrollo

Usar Node 22.13 o superior. Ejecutar `npm ci` y `npm run dev`. La demo no requiere credenciales y no guarda cambios.

## Alojamiento

Importar este directorio como raíz del proyecto en Netlify. `netlify.toml` configura el build de Next.js; el adaptador de Netlify mantiene las rutas de servidor. No es una web estática: subir solamente HTML o `.next` mediante arrastrar y soltar no activa la autenticación ni el cifrado.

Configurar como secretos de servidor (sin prefijo NEXT_PUBLIC): SUPABASE_URL, SUPABASE_ANON_KEY y NEURI_DATA_KEY. La clave de cifrado debe ser la ya creada para este proyecto; no regenerarla si existen datos. Debe tener 32 bytes en base64 y contar con respaldo seguro.

Proyecto Supabase: Neuri App, glwkepzpdrzxehnaplnl. La migración de supabase/migrations ya se aplicó a ese proyecto. No repetirla.

Auth: Site URL https://neuri.xyz y redirect permitido https://neuri.xyz/. Para una vista previa, agregar solo su origen exacto a la lista de redirecciones. Antes de probar emails, configurar Resend con remitente verificado. DNS actualmente en GoDaddy; web existente alojada en Netlify.

El diario se cifra en el servidor con AES-256-GCM y RLS limita cada registro al dueño de la cuenta. La recuperación de contraseña no depende de la clave de cifrado. No es cifrado extremo a extremo. Sesiones en cookies HttpOnly y Secure.

PDF mediante la impresión del navegador. La app no diagnostica ni se monitorea para emergencias.

Pendiente antes de apertura al público: SMTP real y prueba de recuperación, privacidad con responsable y contacto, retención y borrado de cuentas, revisión de seguridad y prueba en navegadores principales.
