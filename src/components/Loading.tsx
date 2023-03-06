import { ActivityIndicator, View } from "react-native";

export function Loading() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#171717' }}>
			<ActivityIndicator color={"#F59E0B"} />
		</View>
	)
}