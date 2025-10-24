import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <WebView
        source={{ uri: 'http://192.168.29.80:5173/' }}
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
