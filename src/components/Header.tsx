import { View, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

export function Header() {
	const { navigate } = useNavigation();

	return(
		<View className="w-full flex-row items-center justify-between">
			{/*<Logo />*/}
			<Image source={require("../assets/logo.png")} className="w-16 h-4"/>
			<TouchableOpacity 
				activeOpacity={0.7} 
				className="flex-row h-11 px-4 border-2 border-amber-500 rounded-lg items-center"
				onPress={() => navigate("New")}
			>
				<Feather 
					name="plus"
					color={colors.amber[500]}
					size={20}
				/>
				<Text className="text-white ml-3 font-semibold text-base">Novo</Text>
			</TouchableOpacity>
		</View>
	);
}