const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const path = require("path");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

// 📱 Phone numbers with country code
const numbers = ["916354058642", "916354058642"];

// 💬 Message text
const MESSAGE = "Hello 👋 Please find the attached PDF";

// 📄 PDF file path
const PDF_PATH = path.join(__dirname, "files", "brochure.pdf");

// ⏱️ 30 seconds delay
const INTERVAL = 30 * 1000;

client.on("qr", (qr) => {
  console.log("📱 Scan QR Code");
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("✅ WhatsApp Logged In");

  const pdfMedia = MessageMedia.fromFilePath(PDF_PATH);

  for (let i = 0; i < numbers.length; i++) {
    const chatId = `${numbers[i]}@c.us`;

    try {
      // Send text
      await client.sendMessage(chatId, MESSAGE);

      // Send PDF
      await client.sendMessage(chatId, pdfMedia, {
        caption: "📄 Attached PDF",
      });

      console.log(`📨 Text + PDF sent to ${numbers[i]}`);
    } catch (err) {
      console.error(`❌ Failed for ${numbers[i]}:`, err.message);
    }

    // Wait before next number
    if (i < numbers.length - 1) {
      console.log("⏳ Waiting 30 seconds...");
      await new Promise((res) => setTimeout(res, INTERVAL));
    }
  }

  console.log("🎉 All messages sent");
});

client.initialize();
