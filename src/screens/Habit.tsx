import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
//import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progess-percentage";
import { HabitEmpty } from "../components/HabitEmpty";
import clsx from "clsx";
import { getDay, setCompletedHabit } from "../lib/storage";

enum WeekDays {
	Domingo, Segunda, Terça, Quarta, Quinta, Sexta
}

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
	const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
	const [completedHabits, setCompletedHabits] = useState<string[]>([]);

	const route = useRoute();
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
			Alert.alert("Ops", "Não foi possível carregar os seus hábitos.");
		}finally {
			setLoading(false);
		}
	}

	async function handleToggleHabit(habitId: string) {
		try {
			//await api.patch(`/habits/${habitId}/toggle`);
			await setCompletedHabit(habitId);
			if(completedHabits.includes(habitId)) {
				setCompletedHabits(prev => prev.filter(habit => habit !== habitId));
			} else {
				setCompletedHabits(prev => [...prev, habitId]);
			}
		} catch (e) {
			console.log(e);
			Alert.alert("Ops", "Não foi possível mudar o seu hábito.");
		}
	}

	useEffect(() => {
		fetchHabits();
	}, []);

	if(loading) {
		return <Loading />
	}

	return(
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
					{dayInfo?.habits ? dayInfo.habits.map(habit => (
						<Checkbox 
							key={habit.id}
							title={habit.title} 
							checked={completedHabits.includes(habit.id)}
							disabled={isDateInPast}
							onPress={() => handleToggleHabit(habit.id)}
						/>
					)) : <HabitEmpty />}
				</View>
				{isDateInPast && 
					<Text className="text-white mt-10 text-center">
						Você não pode editar hábitos de uma data passada.
					</Text>}
			</ScrollView>
		</View>
	)
}