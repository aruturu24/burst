import { TouchableOpacity, TouchableOpacityProps, View, Text } from "react-native";
import { Checkbox } from "./Checkbox";
import { HabitRemove } from "./HabitRemove";

interface Props extends TouchableOpacityProps {
	title: string;
	checked?: boolean;
	disabled?: boolean;
	canRemove?: boolean;
	removeOnPress?: () => void
}

export function HabitInfo({ 
		title, checked = false, disabled = false, canRemove = false, removeOnPress, ...rest
	}: Props) {
	return(
		<View className="flex-row mb-2 justify-between">
			<TouchableOpacity 
				activeOpacity={0.7} className="flex-row mb-2 items-center" disabled={disabled} {...rest}
			>
				<Checkbox checked={checked} />
				<Text className="text-white text-base ml-3 font-semibold">
					{title}
				</Text>
			</TouchableOpacity>
			{
				canRemove ? (<HabitRemove onPress={removeOnPress}/>) : null
			}
		</View>
	);
}