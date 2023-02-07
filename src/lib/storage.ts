import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
//var utc = require('dayjs/plugin/utc')
//dayjs.extend(utc)
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

enum WeekDays {
	Domingo, Segunda, Terça, Quarta, Quinta, Sexta
}

type Habits = {
	id: string;
	title: string;
	created_at: Date;
	removed_at?: Date;
	week_days: WeekDays[]
}

type CompletedHabits = {
	date: Date;
	completed_habits: [
		id: string
	]
}

type Summary = {
	amount: number;
	completed: number;
	date: Date;
}

export async function getSummary(): Promise<Summary[]> {
	let summary: Summary[] = [];
	try {
		const storageH: Habits[] = JSON.parse(await AsyncStorage.getItem('@habits') || "[]");
		const storageCH: CompletedHabits[] = JSON.parse(await AsyncStorage.getItem('@completed_habits') || "[]");
		for (let completedHabit of storageCH) {
			let habitOnDay = []
			for (let habit of storageH) {
				if (dayjs(habit.created_at).isBefore(dayjs(completedHabit.date).add(3, "h"))
					&& dayjs(completedHabit.date).isBefore(dayjs(habit.removed_at).add(3, "h"))) {
					habitOnDay.push(habit.id);
				}
			}
			summary.push({
				amount: habitOnDay.length,
				completed: completedHabit.completed_habits.length,
				date: completedHabit.date
			});
		}

	} catch (e) {
		console.log(e);
	}
	return summary;
}

export async function setHabit(habit: Habits) {
	try {
		const storageH: Habits[] = JSON.parse(await AsyncStorage.getItem('@habits') || "[]");
		storageH.push(habit);
		await AsyncStorage.setItem('@habits', JSON.stringify(storageH));
	} catch (e) {
		console.log(e);
	}
}

export async function setCompletedHabit(id: string) {
	try {
		let exist = false;
		const storageCH: CompletedHabits[] = JSON.parse(await AsyncStorage.getItem('@completed_habits') || "[]");
		storageCH.map((day, i) => {
			if (dayjs(new Date).startOf("day").isSame(day.date)) {
				exist = true;
				day.completed_habits.includes(id) ?
					storageCH[i].completed_habits.splice(storageCH[i].completed_habits.indexOf(id), 1)
					: storageCH[i].completed_habits.push(id);
			}
		});
		if (!exist) {
			storageCH.push({ date: dayjs(new Date).startOf("day").toDate(), completed_habits: [id] });
		}
		await AsyncStorage.setItem('@completed_habits', JSON.stringify(storageCH));
	} catch (e) {
		console.log(e);
	}
}

export async function getDay(date: Date) {
	date = dayjs(date).startOf("day").toDate();
	let habits: Habits[] = [];
	let completedHabits: string[] = [];
	try {
		const storageCH: CompletedHabits[] = JSON.parse(await AsyncStorage.getItem('@completed_habits') || "[{}]");
		const storageH: Habits[] = JSON.parse(await AsyncStorage.getItem('@habits') || "[{}]");
		for (let day of storageCH) {
			if (dayjs(new Date).startOf("day").isSame(day.date)) {
				completedHabits = day.completed_habits;
			}
		};
		storageH.map((habit) => {
			if (dayjs(habit.created_at).isBefore(dayjs(date).add(1, "hour"))
				&& dayjs(date).isBefore(dayjs(habit.removed_at))) {
				habits.push(habit);
			}
		});
	} catch (e) {
		console.log(e);
	}
	return { habits, completedHabits }
}

export async function remHabit(id: string) {
	try {
		const storageH: Habits[] = JSON.parse(await AsyncStorage.getItem('@habits') || "[]");
		const storageCH: CompletedHabits[] = JSON.parse(await AsyncStorage.getItem('@completed_habits') || "[]");
		storageH.map((habit, i) => {
			if (habit.id == id) {
				if (dayjs(habit.created_at).isSame(dayjs(new Date).startOf("day"))) {
					storageCH.map((completedHabit, index) => {
						if (completedHabit.completed_habits.includes(id)) {
							storageCH.splice(index, 1);
						}
					});
					storageH.splice(i, 1);
				} else {
					storageH[i].removed_at = dayjs(new Date).startOf("day").toDate();
				}
			}
		});
		await AsyncStorage.setItem("@habits", JSON.stringify(storageH));
		await AsyncStorage.setItem("@completed_habits", JSON.stringify(storageCH));
	} catch (e) {
		console.log(e);
	}
}