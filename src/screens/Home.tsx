import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView, Alert } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useState, useCallback } from "react";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import dayjs from "dayjs";
import { getSummary } from "../lib/storage";
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import { useTranslation } from "react-i18next";

const adUnitId = "ca-app-pub-3833728725984948/4147068885";

const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
	requestNonPersonalizedAdsOnly: true,
});

appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
	appOpenAd.show();
});
appOpenAd.load();

const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
	date: Date;
	amount: number;
	completed: number;
}>

export function Home() {
	const [loading, setLoading] = useState(true);
	const [summary, setSummary] = useState<SummaryProps | null>(null);
	const { navigate } = useNavigation();
	const { t } = useTranslation();

	const weekDays: String[] = JSON.parse(t("weekDays")) || ["S", "M", "T", "W", "T", "F", "S"];

	async function fetchData() {
		try {
			setLoading(true);
			const res = await getSummary();
			setSummary(res);
		} catch (e) {
			Alert.alert("Ops!", t("error.habitSummary") || "");
			console.log(e);
		} finally {
			setLoading(false);
		}
	}

	useFocusEffect(useCallback(() => {
		fetchData();
	}, []));

	if (loading) {
		return <Loading />
	}

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<Header />
			<View className="flex-row mt-6 mb-2">
				{weekDays.map((weekDay, i) => (
					<Text
						className="text-zinc-400 text-xl font-bold text-center mx-1"
						style={{ width: DAY_SIZE }}
						key={`${weekDay}-${i}`}
					>
						{weekDay}
					</Text>
				))}
			</View>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
				{summary &&
					<View className="flex-row flex-wrap">
						{
							datesFromYearStart.map(date => {
								const dayWithHabits = summary.find(day => {
									return dayjs(date).isSame(day.date, "day");
								})
								return (
									<HabitDay
										key={date.toISOString()}
										date={date}
										total={dayWithHabits?.amount}
										completed={dayWithHabits?.completed}
										onPress={() => navigate("Habit", { date: date.toISOString() })}
									/>
								)
							})
						}
						{amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
							<View
								key={i}
								className="bg-zinc-900 rounded-full border-2 m-1 border-zinc-800 opacity-20"
								style={{ width: DAY_SIZE, height: DAY_SIZE }}
							/>
						))}
					</View>
				}
			</ScrollView>
		</View>
	);
}