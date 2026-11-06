const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNotificationListener(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Adiciona a permissão de BIND_NOTIFICATION_LISTENER_SERVICE
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    
    androidManifest.manifest['uses-permission'].push({
      $: {
        'android:name': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
      },
    });

    return config;
  });
};
