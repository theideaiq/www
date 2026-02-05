const fs = require('node:fs');
const path = require('node:path');

const ANDROID_DEST = path.join(
  __dirname,
  '../apps/web/android/app/google-services.json',
);
const IOS_DEST = path.join(
  __dirname,
  '../apps/web/ios/App/App/GoogleService-Info.plist',
);

function restoreSecrets() {
  console.log('🔄 Restoring mobile secrets...');

  // 1. Android
  if (process.env.ANDROID_GOOGLE_SERVICES_BASE64) {
    try {
      const buffer = Buffer.from(
        process.env.ANDROID_GOOGLE_SERVICES_BASE64,
        'base64',
      );
      fs.writeFileSync(ANDROID_DEST, buffer);
      console.log('✅ Android google-services.json restored');
    } catch (error) {
      console.error('❌ Failed to restore Android secrets');
      // biome-ignore lint/complexity/useOptionalChain: Scripts run in restricted envs
      if (error && error.constructor && error.constructor.name) {
        console.error(error.constructor.name);
      }
    }
  } else {
    console.warn('⚠️ ANDROID_GOOGLE_SERVICES_BASE64 not found');
  }

  // 2. iOS
  if (process.env.IOS_GOOGLE_SERVICE_INFO_BASE64) {
    try {
      const buffer = Buffer.from(
        process.env.IOS_GOOGLE_SERVICE_INFO_BASE64,
        'base64',
      );
      fs.writeFileSync(IOS_DEST, buffer);
      console.log('✅ iOS GoogleService-Info.plist restored');
    } catch (error) {
      console.error('❌ Failed to restore iOS secrets');
    }
  } else {
    console.warn('⚠️ IOS_GOOGLE_SERVICE_INFO_BASE64 not found');
  }
}

restoreSecrets();
