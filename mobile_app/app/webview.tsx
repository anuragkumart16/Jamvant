import React from 'react';
import { WebView } from 'react-native-webview';

const MyWebPage = () => {
  return (
    <WebView source={{ uri: 'http://10.0.2.2:5173' }} />
  );
};

export default MyWebPage;
