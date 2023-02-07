import { TouchableOpacity, TouchableOpacityProps, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

export function HabitRemove({ ...rest }: TouchableOpacityProps) {

	return(
		<TouchableOpacity activeOpacity={0.7} className="mt-1" {...rest}>
				<Feather 
					name="trash"
					size={20}
					color={colors.white}
				/>
		</TouchableOpacity>
	);
}