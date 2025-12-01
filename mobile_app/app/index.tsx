import { Text, View } from "react-native";
import { WEBVIEW_URL} from "@env"
import { WebView } from "react-native-webview";
import { useRouter,useRootNavigationState,Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter()
  const navigationState = useRootNavigationState()
  

  return (
    // <WebView source={{ uri: WEBVIEW_URL }} />
    <Redirect href="/land" />
  );
}
