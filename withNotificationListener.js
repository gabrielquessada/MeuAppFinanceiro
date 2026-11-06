const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNotificationListener(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // 1. Adiciona a permissão de uso do serviço
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    
    const permissionExists = androidManifest.manifest['uses-permission'].some(
      (p) => p.$['android:name'] === 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE'
    );

    if (!permissionExists) {
      androidManifest.manifest['uses-permission'].push({
        $: {
          'android:name': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
        },
      });
    }

    // 2. Registra o serviço de escuta de notificações no AndroidManifest
    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    const serviceExists = mainApplication.service.some(
      (s) => s.$['android:name'] === '.NotificationListener'
    );

    if (!serviceExists) {
      mainApplication.service.push({
        $: {
          'android:name': 'expo.modules.notifications.service.ExpoNotificationListenerService',
          'android:label': 'Leitor de Notificações Financeiras',
          'android:permission': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name': 'android.service.notification.NotificationListenerService',
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
};
