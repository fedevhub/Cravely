const notifyWhatsApp = async (message) => {
  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ADMIN_NUMBER } = process.env;
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ADMIN_NUMBER) {
    return false;
  }

  const response = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: WHATSAPP_ADMIN_NUMBER,
      type: "text",
      text: { body: message },
    }),
  });

  if (!response.ok) {
    throw new Error(`WhatsApp API returned ${response.status}`);
  }
  return true;
};

module.exports = notifyWhatsApp;
