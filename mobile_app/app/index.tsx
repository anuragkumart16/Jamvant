import { Text, View } from "react-native";
import { WEBVIEW_URL} from "@env"
import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView source={{ uri: WEBVIEW_URL }} />
  );
}
