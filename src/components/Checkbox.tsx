import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import Animated, { BounceIn, BounceOut } from "react-native-reanimated";

interface Props {
	checked?: boolean;
}

export function Checkbox({ checked = false }: Props) {
	return(
		<>
			{ checked ?
			<Animated.View 
				className="h-8 w-8 bg-green-500 border-2 border-zinc-800 rounded-lg items-center justify-center"
				entering={BounceIn.duration(150)}
				exiting={BounceOut.duration(150)}
			>
				<Feather 
					name="check"
					size={20}
					color={colors.white}
				/>
			</Animated.View>
			: <View className="h-8 w-8 bg-zinc-900 border-2 border-zinc-800 rounded-lg" />
			}
		</>
	);
}