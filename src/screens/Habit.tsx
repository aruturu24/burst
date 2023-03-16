import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Loading } from "../components/Loading";
//import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progess-percentage";
import { HabitEmpty } from "../components/HabitEmpty";
import clsx from "clsx";
import { getDay, remHabit, setCompletedHabit } from "../lib/storage";
import { HabitInfo } from "../components/HabitInfo";
import { useTranslation } from "react-i18next";

interface Params {
	date: Date;
}

interface DayInfoProps {
	completedHabits: string[];
	habits: {
		id: string;
		title: string;
	}[]
}

export function Habit() {
	const [loading, setLoading] = useState(true);
	const [dayInfo, setDayInfo] = useState<DayInfoProps>({ completedHabits: [], habits: [] });
	const [completedHabits, setCompletedHabits] = useState<string[]>([]);
	const { t } = useTranslation();

	const route = useRoute();
	const { navigate } = useNavigation();
	const { date } = route.params as Params;
	const parsedDate = dayjs(date);
	const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
	const dayOfWeek = parsedDate.format("dddd");
	const dayAndMonth = parsedDate.format("DD/MM");
	const habitProgress = dayInfo?.habits.length ?
		generateProgressPercentage(completedHabits.length, dayInfo.habits.length) : 0;

	async function fetchHabits() {
		try {
			setLoading(true);
			//const res = await api.get("/day", {params: {date}});
			//setDayInfo(res.data);
			//setCompletedHabits(res.data.completedHabits);
			const res = await getDay(date);
			setDayInfo(res);
			setCompletedHabits(res.completedHabits);
		} catch (e) {
			console.log(e);
			Alert.alert("Ops!", t("error.habitLoad") || "");
		} finally {
			setLoading(false);
		}
	}

	async function handleToggleHabit(habitId: string) {
		try {
			//await api.patch(`/habits/${habitId}/toggle`);
			await setCompletedHabit(habitId);
			if (completedHabits.includes(habitId)) {
				setCompletedHabits(prev => prev.filter(habit => habit !== habitId));
			} else {
				setCompletedHabits(prev => [...prev, habitId]);
			}
		} catch (e) {
			console.log(e);
			Alert.alert("Ops!", t("error.habitToggle") || "");
		}
	}

	async function handleRemoveHabit(habitId: string) {
		await remHabit(habitId);
		const dayInfoHabits = dayInfo.habits.filter(habit => habit.id != habitId);
		let newDayInfo = dayInfo
		newDayInfo.habits = dayInfoHabits
		setDayInfo(newDayInfo);
		navigate("Habit", { date: parsedDate.toISOString() });
	}

	useEffect(() => {
		fetchHabits();
	}, []);

	if (loading) {
		return <Loading />
	}

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<BackButton />
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
				<Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
					{dayOfWeek}
				</Text>
				<Text className="text-white font-extrabold text-3xl">
					{dayAndMonth}
				</Text>
				<ProgressBar progress={habitProgress} />
				<View className={clsx("mt-6", {
					["opacity-50"]: isDateInPast
				})}>
					{dayInfo.habits.length != 0 ? dayInfo.habits.map(habit => (
						<HabitInfo
							key={habit.id}
							title={habit.title}
							checked={completedHabits.includes(habit.id)}
							disabled={isDateInPast}
							onPress={() => handleToggleHabit(habit.id)}
							removeOnPress={() => handleRemoveHabit(habit.id)}
							canRemove={true}
						/>
					)) : <HabitEmpty />}
				</View>
				{isDateInPast &&
					<Text className="text-white mt-10 text-center">
						{t("pastHabits")}
					</Text>}
			</ScrollView>
		</View>
	)
}