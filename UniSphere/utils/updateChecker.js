import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import Constants from 'expo-constants';

const LAST_UPDATE_CHECK = 'lastUpdateCheck';
const currentVersion = Constants.expoConfig?.version;

function isMoreThan24HoursAgo(timestamp) {
  const now = Date.now();
  const last = Number(timestamp);

  return now - last > 24 * 60 * 60 * 1000;
}

export async function checkForAppUpdates(showNoUpdateMessage = false) {
  try {
    const lastCheck =
      await SecureStore.getItemAsync(LAST_UPDATE_CHECK);

    if (
      !showNoUpdateMessage &&
      lastCheck &&
      !isMoreThan24HoursAgo(lastCheck)
    ) {
      return;
    }

    await SecureStore.setItemAsync(
      LAST_UPDATE_CHECK,
      Date.now().toString()
    );

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert(
        'Update Available',
        `Current Version: ${currentVersion}`,
        [
          {
            text: 'Later',
            style: 'cancel'
          },
          {
            text: 'Download Now',
            onPress: async () => {
              await Updates.fetchUpdateAsync();

              Alert.alert(
              'Update Ready',
              'Restart app to apply update.',
              [
                {
                  text: 'Restart Now',
                  onPress: async () => {
                    await Updates.reloadAsync();
                  }
                }
              ]
            );
          }
        }
      ]
    );
  } else if (showNoUpdateMessage) {
    Alert.alert(
      'No Updates Available',
      `You are using the latest version (${currentVersion}).`
    );
  }
  } catch (e) {
    console.log('Update check failed:', e);
  }
}