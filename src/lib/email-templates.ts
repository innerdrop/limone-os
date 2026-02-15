/**
 * Email Templates for Taller Limoné
 * Branded HTML templates with consistent design
 */

// Brand colors
const colors = {
    yellow: '#F1C40F',
    green: '#27AE60',
    purple: '#8E44AD',
    charcoal: '#2D2D2D',
    warmGray: '#F5F0E8',
    white: '#FFFFFF'
}

// Base template wrapper
function baseTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Taller Limoné</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${colors.warmGray};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${colors.warmGray};">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: ${colors.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, ${colors.yellow} 0%, ${colors.green} 100%); padding: 30px; text-align: center;">
                                <img src="https://limone.usev.app/logo.png" alt="Taller Limoné" width="180" style="display: block; margin: 0 auto; max-width: 100%; height: auto;">
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                ${content}
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: ${colors.charcoal}; padding: 24px 30px; text-align: center;">
                                <p style="margin: 0 0 8px 0; color: ${colors.white}; font-size: 14px;">Taller Limoné - Dibujo y Pintura para Niños</p>
                                <p style="margin: 0; color: #888; font-size: 12px;">Alem 4611, Ushuaia, Tierra del Fuego</p>
                                <p style="margin: 8px 0 0 0; color: #888; font-size: 12px;">+54 9 2901 588969 | tallerlimone@gmail.com</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
}

// Button component
function button(text: string, url: string, color: string = colors.yellow): string {
    return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
        <tr>
            <td style="background-color: ${color}; border-radius: 50px; padding: 14px 32px;">
                <a href="${url}" style="color: ${colors.charcoal}; text-decoration: none; font-weight: 600; font-size: 16px;">${text}</a>
            </td>
        </tr>
    </table>
    `
}

// Info box component
function infoBox(content: string, bgColor: string = '#FFF9C4'): string {
    return `
    <div style="background-color: ${bgColor}; border-radius: 12px; padding: 20px; margin: 20px 0;">
        ${content}
    </div>
    `
}

// ======================= EMAIL TEMPLATES =======================

interface WelcomeEmailData {
    nombre: string
    email: string
    tempPassword: string
    loginUrl: string
}

export function welcomeEmail(data: WelcomeEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">¡Bienvenido/a a Taller Limoné! 🎨</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Tu cuenta ha sido creada exitosamente. Ahora podés acceder al Portal de Alumnos para inscribirte en talleres, ver tu calendario y mucho más.
        </p>
        ${infoBox(`
            <p style="margin: 0 0 8px 0; color: ${colors.charcoal};"><strong>Tus credenciales de acceso:</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">📧 Email: <strong>${data.email}</strong></p>
            <p style="margin: 0; color: #666;">🔑 Contraseña temporal: <strong>${data.tempPassword}</strong></p>
        `)}
        <p style="color: #888; font-size: 14px; margin: 16px 0;">
            ⚠️ Por seguridad, te pediremos que cambies tu contraseña en el primer inicio de sesión.
        </p>
        ${button('Iniciar Sesión', data.loginUrl)}
        <p style="color: #888; font-size: 14px; margin: 24px 0 0 0;">
            Si no creaste esta cuenta, podés ignorar este correo.
        </p>
    `)
}

// ---------------------------------------------------------------

interface EnrollmentEmailData {
    nombre: string
    alumnoNombre: string
    tallerNombre: string
    dia: string
    horario: string
    precio: number
    sede: string
}

export function enrollmentEmail(data: EnrollmentEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">¡Inscripción Registrada! ✨</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            La inscripción de <strong>${data.alumnoNombre}</strong> al taller ha sido registrada correctamente.
        </p>
        ${infoBox(`
            <p style="margin: 0 0 12px 0; color: ${colors.charcoal}; font-size: 18px;"><strong>📚 ${data.tallerNombre}</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">📅 Día: <strong>${data.dia}</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">🕐 Horario: <strong>${data.horario}</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">📍 Sede: <strong>${data.sede}</strong></p>
            <p style="margin: 12px 0 0 0; color: ${colors.green}; font-size: 18px;"><strong>💰 Precio: $${data.precio.toLocaleString('es-AR')}</strong></p>
        `)}
        <p style="color: #666; line-height: 1.6; margin: 16px 0;">
            Para confirmar tu lugar, realizá el pago correspondiente. Podés subir el comprobante desde tu portal o enviárnoslo por WhatsApp.
        </p>
        ${button('Ver mi Inscripción', 'https://limone.usev.app/portal')}
    `)
}

// ---------------------------------------------------------------

interface FreeTrialEmailData {
    nombre: string
    alumnoNombre: string
    fecha: string
    hora: string
}

export function freeTrialEmail(data: FreeTrialEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">¡Clase de Prueba Agendada! 🎉</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Has agendado una clase de prueba gratuita para <strong>${data.alumnoNombre}</strong>.
        </p>
        ${infoBox(`
            <p style="margin: 0 0 8px 0; color: ${colors.purple}; font-size: 18px;"><strong>🖌️ Clase de Nivelación</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">📅 Fecha: <strong>${data.fecha}</strong></p>
            <p style="margin: 0; color: #666;">🕐 Hora: <strong>${data.hora}</strong></p>
        `, '#E8DAEF')}
        <p style="color: #666; line-height: 1.6; margin: 16px 0;">
            En esta clase evaluaremos el nivel y los intereses del alumno para recomendarte el taller más adecuado. ¡No es necesario traer materiales!
        </p>
        <p style="color: #888; font-size: 14px;">
            📍 Nos vemos en: Alem 4611, Ushuaia
        </p>
    `)
}

// ---------------------------------------------------------------

interface PaymentConfirmedEmailData {
    nombre: string
    alumnoNombre: string
    monto: number
    concepto: string
    fecha: string
}

export function paymentConfirmedEmail(data: PaymentConfirmedEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.green}; margin: 0 0 16px 0;">¡Pago Confirmado! ✅</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Tu pago ha sido confirmado exitosamente. La inscripción de <strong>${data.alumnoNombre}</strong> está activa.
        </p>
        ${infoBox(`
            <p style="margin: 0 0 8px 0; color: ${colors.charcoal};"><strong>Detalle del pago:</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">📚 Concepto: <strong>${data.concepto}</strong></p>
            <p style="margin: 0 0 4px 0; color: #666;">💰 Monto: <strong>$${data.monto.toLocaleString('es-AR')}</strong></p>
            <p style="margin: 0; color: #666;">📅 Fecha: <strong>${data.fecha}</strong></p>
        `, '#D5F5E3')}
        <p style="color: #666; line-height: 1.6; margin: 16px 0;">
            Las clases ya aparecen en tu calendario. ¡Nos vemos pronto!
        </p>
        ${button('Ver mi Calendario', 'https://limone.usev.app/portal/calendario')}
    `)
}

// ---------------------------------------------------------------

interface PurchaseEmailData {
    nombre: string
    productos: Array<{ nombre: string, cantidad: number, precio: number }>
    total: number
    fecha: string
}

export function purchaseEmail(data: PurchaseEmailData): string {
    const productRows = data.productos.map(p => `
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${p.nombre}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; text-align: center;">${p.cantidad}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; text-align: right;">$${p.precio.toLocaleString('es-AR')}</td>
        </tr>
    `).join('')

    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">¡Gracias por tu compra! 🛒</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 24px 0;">
            Tu pedido ha sido registrado. Te contactaremos para coordinar la entrega o retiro.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
            <tr style="background-color: ${colors.charcoal};">
                <th style="padding: 12px; text-align: left; color: white; font-size: 14px;">Producto</th>
                <th style="padding: 12px; text-align: center; color: white; font-size: 14px;">Cant.</th>
                <th style="padding: 12px; text-align: right; color: white; font-size: 14px;">Precio</th>
            </tr>
            ${productRows}
            <tr>
                <td colspan="2" style="padding: 12px 0; text-align: right; font-weight: bold; color: ${colors.charcoal};">Total:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; color: ${colors.green}; font-size: 18px;">$${data.total.toLocaleString('es-AR')}</td>
            </tr>
        </table>
        <p style="color: #888; font-size: 14px;">
            Fecha: ${data.fecha}
        </p>
    `)
}

// ---------------------------------------------------------------

interface PasswordResetEmailData {
    nombre: string
    resetUrl: string
    expiresIn: string
}

export function passwordResetEmail(data: PasswordResetEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">Recuperar Contraseña 🔐</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Hacé clic en el botón de abajo para crear una nueva:
        </p>
        ${button('Restablecer Contraseña', data.resetUrl, colors.purple)}
        <p style="color: #888; font-size: 14px; margin: 16px 0;">
            ⏰ Este enlace expira en <strong>${data.expiresIn}</strong>.
        </p>
        <p style="color: #888; font-size: 14px; margin: 16px 0 0 0;">
            Si no solicitaste este cambio, podés ignorar este correo. Tu contraseña actual seguirá funcionando.
        </p>
    `)
}

// ---------------------------------------------------------------

interface PasswordChangedEmailData {
    nombre: string
}

export function passwordChangedEmail(data: PasswordChangedEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.green}; margin: 0 0 16px 0;">Contraseña Actualizada ✅</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Tu contraseña ha sido cambiada exitosamente. Ya podés usar tu nueva contraseña para iniciar sesión.
        </p>
        ${infoBox(`
            <p style="margin: 0; color: #666;">
                ⚠️ Si no realizaste este cambio, contactanos inmediatamente al <strong>+54 9 2901 588969</strong> o respondiendo a este correo.
            </p>
        `, '#FCE4EC')}
        ${button('Iniciar Sesión', 'https://limone.usev.app/login')}
    `)
}

// ---------------------------------------------------------------

interface ContactFormEmailData {
    nombre: string
    email: string
    telefono?: string
    motivo: string
    mensaje: string
}

export function contactFormEmailToAdmin(data: ContactFormEmailData): string {
    return baseTemplate(`
        <h2 style="color: ${colors.purple}; margin: 0 0 16px 0;">Nueva Consulta Recibida 📩</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 24px 0;">
            Has recibido una nueva consulta desde el formulario de contacto:
        </p>
        ${infoBox(`
            <p style="margin: 0 0 8px 0;"><strong>👤 Nombre:</strong> ${data.nombre}</p>
            <p style="margin: 0 0 8px 0;"><strong>📧 Email:</strong> ${data.email}</p>
            ${data.telefono ? `<p style="margin: 0 0 8px 0;"><strong>📱 Teléfono:</strong> ${data.telefono}</p>` : ''}
            <p style="margin: 0;"><strong>📋 Motivo:</strong> ${data.motivo}</p>
        `)}
        <div style="background-color: #f9f9f9; border-left: 4px solid ${colors.purple}; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: ${colors.charcoal}; font-weight: bold;">Mensaje:</p>
            <p style="margin: 0; color: #666; line-height: 1.6;">${data.mensaje}</p>
        </div>
        <p style="color: #888; font-size: 14px;">
            Podés responder directamente a este correo para contactar al usuario.
        </p>
    `)
}

export function contactFormEmailToUser(data: { nombre: string }): string {
    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">¡Recibimos tu consulta! 📬</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad.
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Si tu consulta es urgente, también podés contactarnos por WhatsApp:
        </p>
        ${button('WhatsApp', 'https://wa.me/5492901588969', colors.green)}
        <p style="color: #888; font-size: 14px; margin: 24px 0 0 0;">
            ¡Gracias por tu interés en Taller Limoné!
        </p>
    `)
}

export function genericEmail(data: { titulo: string, mensaje: string, botonTexto?: string, botonUrl?: string }): string {
    return baseTemplate(`
        <h2 style="color: ${colors.charcoal}; margin: 0 0 16px 0;">${data.titulo}</h2>
        <div style="color: #666; line-height: 1.6; margin: 0 0 24px 0; white-space: pre-wrap;">
            ${data.mensaje}
        </div>
        ${data.botonTexto && data.botonUrl ? button(data.botonTexto, data.botonUrl) : ''}
    `)
}

export function nonWorkingDayEmail(data: { nombre: string, fecha: string, motivo: string, tieneCredito: boolean }): string {
    return baseTemplate(`
        <h2 style="color: ${colors.purple}; margin: 0 0 16px 0;">Aviso de Clase Cancelada 🎨</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Hola <strong>${data.nombre}</strong>,
        </p>
        <p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">
            Te informamos que el día <strong>${data.fecha}</strong> no se dictarán clases en el taller por el siguiente motivo:
        </p>
        ${infoBox(`
            <p style="margin: 0; color: ${colors.charcoal}; font-weight: bold; text-align: center;">
                ${data.motivo}
            </p>
        `, '#F4ECF7')}
        ${data.tieneCredito ? `
        <p style="color: #666; line-height: 1.6; margin: 16px 0;">
            Se ha acreditado una <strong>clase extra</strong> en tu cuenta para que puedas recuperarla en cualquier otro horario disponible del mes.
        </p>
        ${button('Ver mi Calendario', 'https://limone.usev.app/portal/calendario', colors.yellow)}
        ` : `
        <p style="color: #666; line-height: 1.6; margin: 16px 0;">
            Ante cualquier consulta, no dudes en contactarnos.
        </p>
        `}
        <p style="color: #888; font-size: 14px; margin: 24px 0 0 0;">
            ¡Nos vemos pronto en el taller! 🖌️
        </p>
    `)
}
