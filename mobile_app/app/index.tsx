import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { WEBVIEW_URL } from "@env";

export default function App() {

  const url = WEBVIEW_URL || 'http://192.168.29.80:5173/';
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1, backgroundColor: '#fff' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
