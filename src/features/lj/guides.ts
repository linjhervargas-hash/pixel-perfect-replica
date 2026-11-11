export interface Guide { slug: string; title: string; short: string; category: string; intro: string; rule?: string; steps: { title: string; text: string }[] }
export const GUIDES: Guide[] = [
  { slug: 'me-estafaron', title: 'Me estafaron, qué hago', short: 'Pasos concretos para cuidar tu dinero, tus cuentas y a vos.', category: 'Primeras horas', intro: 'Lo primero: no es tu culpa. Estas estafas están diseñadas por profesionales para que cualquiera caiga. Lo que más importa son las primeras horas.', steps: [
    { title: 'Cortá el contacto y no pagues nada más', text: 'No pagues “tasas”, impuestos, comisiones ni supuestos gastos para liberar tu dinero. Bloqueá a quien te contactó después de guardar la evidencia.' },
    { title: 'Guardá toda la evidencia', text: 'Conservá capturas, comprobantes, números, usuarios, links y billeteras. No borres chats. Anotá fechas y montos.' },
    { title: 'Avisá a tu banco o billetera virtual ya', text: 'Usá los canales oficiales. Pedí que intenten frenar o reclamar la transferencia y anotá el número de reclamo. La recuperación no está garantizada.' },
    { title: 'Protegé tus cuentas', text: 'Cambiá claves, activá la verificación en dos pasos, cerrá sesiones abiertas y desinstalá apps que te hayan hecho instalar.' },
    { title: 'Hacé la denuncia', text: 'Presentá tu evidencia en la policía o fiscalía de tu país. Pedí y conservá una copia o el número de denuncia.' },
    { title: 'Reportá las cuentas', text: 'Reportá en Instagram, WhatsApp o Telegram y también en LJ. Tu experiencia puede ayudar a otras personas.' },
    { title: 'Desconfiá de las promesas de recuperación', text: 'Nadie serio cobra por adelantado para recuperar dinero estafado. No compartas claves ni instales apps de acceso remoto.' },
    { title: 'Cuidate vos también', text: 'La vergüenza es normal, pero no estás solo. Hablá con alguien de confianza. Haber sido estafado no dice nada sobre tu inteligencia ni tu valor.' },
  ] },
  { slug: 'recuperacion', title: 'Estafas de recuperación de fondos', short: 'Cuando la promesa de recuperar tu dinero es otra estafa.', category: 'Recuperación de fondos', intro: 'Después de una estafa, alguien puede aprovechar tu preocupación para pedirte más dinero.', rule: 'Nadie serio cobra por adelantado para recuperar dinero estafado.', steps: [
    { title: 'Te contactan primero y prometen certezas', text: 'Dicen ser abogados, hackers o agentes del gobierno y aseguran que ya “localizaron” tu dinero. Una promesa de recuperación garantizada es una señal de alerta.' },
    { title: 'Piden pagos por adelantado', text: 'Los llaman gestión, desbloqueo, impuestos o fianza. No pagues: cambiar el nombre del cobro no lo hace más seguro.' },
    { title: 'Piden claves o acceso a tus dispositivos', text: 'No compartas contraseñas, códigos ni frases de recuperación. No instales apps de acceso remoto.' },
    { title: 'Presionan con urgencia y secreto', text: 'Desconfiá si te piden actuar ya o no contarle a nadie. Tomate tiempo y hablá con alguien de confianza.' },
    { title: 'Cortá el contacto y verificá por tu cuenta', text: 'No pagues. Si dicen ser abogados, verificá su matrícula con el colegio profesional por un canal oficial. Guardá evidencia y reportá en LJ.' },
  ] },
  { slug: 'trabajo-por-tareas', title: 'Señales de alerta: trabajo por tareas', short: 'Te pagan al principio. Después, te piden que deposites.', category: 'Trabajo por tareas', intro: 'Los pequeños pagos iniciales pueden ser parte de una estrategia para ganar tu confianza.', rule: 'Un trabajo real nunca te pide dinero para poder trabajar ni para poder cobrar.', steps: [
    { title: 'Una oferta que no buscaste', text: 'Te escriben por redes y prometen pagos altos por tareas simples: dar likes, reseñar productos o seguir cuentas.' },
    { title: 'Una plataforma desconocida', text: 'Te dan un usuario y una clave. Los primeros pagos llegan para generar confianza y te suman a grupos con testimonios que pueden ser falsos.' },
    { title: 'El trabajo se convierte en un depósito', text: 'Piden una “inversión” para seguir o retirar. El saldo crece en pantalla, pero no se puede sacar. Un número en una plataforma no prueba que ese dinero exista.' },
    { title: 'No inviertas más', text: 'Cortá el contacto, guardá los mensajes y comprobantes, avisá a tu banco y reportá el dato en LJ.' },
  ] },
  { slug: 'prevencion', title: 'Cómo detectar una estafa antes de caer', short: 'Las señales que conviene revisar antes de responder.', category: 'Prevención e inversión', intro: 'Frenar un momento puede hacer la diferencia. Si algo te genera dudas, no pagues ni compartas información.', steps: [
    { title: 'Urgencia y presión', text: '“Solo por hoy” o “tu cuenta se bloquea ya” buscan que decidas sin pensar. Consultá por un canal oficial.' },
    { title: 'Pedidos de dinero, claves o códigos', text: 'No compartas contraseñas ni códigos de verificación, aunque parezca un banco o un familiar. Verificá con esa persona por otro canal.' },
    { title: 'Contactos que no esperabas', text: 'No atiendas números desconocidos. Verificá en LJ antes de responder y revisá si el perfil es nuevo o no tiene historial.' },
    { title: 'Promesas de ganancias fáciles', text: 'Las inversiones y las criptomonedas tienen riesgos. Desconfiá de retornos garantizados, ganancias extraordinarias y depósitos para desbloquear retiros.' },
    { title: 'Links raros o acortados', text: 'No abras links de mensajes inesperados. Entrá escribiendo la dirección oficial. Revisá el dominio completo, no solo el nombre o el logo.' },
    { title: 'Consultá y compartí tu experiencia', text: 'Buscá el dato en LJ. No encontrar reportes no garantiza seguridad. Si te pasó algo, un reporte anónimo ayuda a la comunidad.' },
  ] },
];
