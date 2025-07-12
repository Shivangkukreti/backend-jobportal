


// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://9cc257fe3d38eeded060759a29f5f0b8@o4509656053907456.ingest.us.sentry.io/4509656124555264",
integrations: [Sentry.mongooseIntegration()],
tracesSampleRate: 1.0,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});