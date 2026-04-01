import axios from 'axios';
import { Platform } from 'react-native';
import { AppStorage } from './storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// 1. Identify your computer's local IP (Run 'ipconfig' to check)
const LOCAL_IP = '192.168.8.133';

// 2. Determine base URL based on platform and environment
const getBaseURL = () => {
  // Use the local IP for web too if you are accessing it via http://192.168.8.133:8081
  // If you are strictly using http://localhost:8081, you can keep it as localhost.
  // Using the IP is the most compatible way across all devices on the same network.
  if (Platform.OS === 'web') return `http://${LOCAL_IP}:3000`;

  if (Platform.OS === 'android') {
    // 10.0.2.2 is usually the address for the Android Emulator's host
    return `http://10.0.2.2:3000`;
  }
  // For iOS simulators or physical devices (Expo Go), use the local IP
  return `http://${LOCAL_IP}:3000`;
};

const baseURL = getBaseURL();
//const baseURL = 'https://a1b2-c3d4-e5f6.ngrok-free.app'; // Use the URL provided by ngrok



const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach the access token to every request
apiClient.interceptors.request.use(async (config) => {
  const token = await AppStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;