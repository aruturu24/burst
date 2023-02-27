import 'react-native-get-random-values';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold} from "@expo-google-fonts/inter"
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import "./src/lib/dayjs";
import * as Notifications from "expo-notifications";

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permissão para mandar notificações recusada :(');
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  //console.log(token);
  // Save the token to your server for future use
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Marque seu progresso.',
      body: 'Entre no app e complete seus hábitos!',
    },
    trigger: {
      hour: 18,
      minute: 0,
      repeats: true,
    },
  });
}

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
    schedulePushNotification();
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  if(!fontsLoaded) return (<Loading />)

  return (
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
}
