const { Webhook } = require('svix');
const user = require('../models/user.js');

module.exports = async function clerkweb(req, res) {
  try {
    console.log("🔔 Clerk webhook received");

    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature']
    };

    const payload = req.body; // 🚨 This is a raw Buffer!

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers); // 🚨 Signature works only with raw

    const { data, type } = evt;

    console.log("📦 Webhook type:", type);

    switch (type) {
      case 'user.created': {
        const userData = {
          id: data.id,
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url || '',
          resume: ''
        };
        await user.create(userData);
        console.log("✅ User created:", userData);
        return res.status(200).json({});
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url || ''
        };
        await user.findOneAndUpdate({ id: data.id }, userData);
        console.log("📝 User updated:", data.id);
        return res.status(200).json({});
      }

      case 'user.deleted': {
        await user.findOneAndDelete({ id: data.id });
        console.log("🗑️ User deleted:", data.id);
        return res.status(200).json({});
      }

      default:
        console.log("ℹ️ Unhandled event:", type);
        return res.status(204).send();
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error.stack || error.message);
    return res.status(500).json({ success: false, message: "Webhook handling failed." });
  }
};
