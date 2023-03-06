import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen, Group } = createNativeStackNavigator();

import { Home } from "../screens/Home";
import { Habit } from "../screens/Habit";
import { New } from "../screens/New";

export function AppRoutes() {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Group>
				<Screen
					name="Home"
					component={Home}
				/>
				<Screen
					name="Habit"
					component={Habit}
				/>
			</Group>
			<Group screenOptions={{ presentation: "modal" }}>
				<Screen
					name="New"
					component={New}
				/>
			</Group>

		</Navigator>
	)
}