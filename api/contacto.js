/*
 * Formulario de contacto de Moebius Labs.
 * Recibe el formulario y envía el mensaje por mail con Resend (https://resend.com).
 *
 * Variables de entorno en Vercel (Settings → Environment Variables):
 *   RESEND_API_KEY  clave de Resend (obligatoria)
 *   CONTACTO_PARA   mail donde llegan las consultas (opcional; por defecto el de Mirta)
 *   EMAIL_FROM      remitente (opcional). Sin dominio propio se usa el remitente de prueba de
 *                   Resend, que solo puede enviar al mail con el que se creó la cuenta.
 */

const PARA = process.env.CONTACTO_PARA || 'mirta.wolfsdorf@gmail.com';
const DE = process.env.EMAIL_FROM || 'Moebius Labs <onboarding@resend.dev>';

const responder = (status, datos) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const escapar = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const mailValido = (m) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m);

export async function POST(request) {
  let datos;
  try {
    datos = await request.json();
  } catch {
    return responder(400, { error: 'No se pudo leer el formulario.' });
  }

  const nombre = String(datos?.nombre ?? '').trim().slice(0, 120);
  const email = String(datos?.email ?? '').trim().slice(0, 200);
  const mensaje = String(datos?.mensaje ?? '').trim().slice(0, 5000);
  const trampa = String(datos?.sitio ?? '').trim(); // campo invisible: solo lo completan robots

  // Robot: se responde "ok" para no darle pistas, pero no se envía nada
  if (trampa) return responder(200, { ok: true });

  if (!nombre || !mensaje) return responder(400, { error: 'Completá tu nombre y tu mensaje.' });
  if (!mailValido(email)) return responder(400, { error: 'Revisá tu mail: así puedo responderte.' });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error('[contacto] Falta RESEND_API_KEY');
    return responder(500, { error: 'El formulario no está disponible ahora.' });
  }

  const texto = `Nueva consulta desde Moebius Labs\n\nNombre: ${nombre}\nMail: ${email}\n\n${mensaje}\n\n—\nRespondé este mail para contestarle directamente.`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1e293b">
<p style="margin:0 0 16px;color:#64748b">Nueva consulta desde <b>Moebius Labs</b></p>
<p style="margin:0"><b>Nombre:</b> ${escapar(nombre)}</p>
<p style="margin:0 0 16px"><b>Mail:</b> <a href="mailto:${escapar(email)}">${escapar(email)}</a></p>
<div style="white-space:pre-wrap;background:#f8f5ef;border-radius:10px;padding:14px 16px">${escapar(mensaje)}</div>
<p style="margin:16px 0 0;color:#64748b;font-size:13px">Respondé este mail para contestarle directamente.</p></div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: DE,
        to: [PARA],
        reply_to: email,
        subject: `Consulta de ${nombre} · Moebius Labs`,
        text: texto,
        html,
      }),
    });
    if (!r.ok) {
      console.error('[contacto] Resend respondió', r.status, await r.text().catch(() => ''));
      return responder(502, { error: 'No se pudo enviar el mensaje. Probá de nuevo en unos minutos.' });
    }
  } catch (e) {
    console.error('[contacto] Error de red', e);
    return responder(502, { error: 'No se pudo enviar el mensaje. Probá de nuevo en unos minutos.' });
  }

  return responder(200, { ok: true });
}
