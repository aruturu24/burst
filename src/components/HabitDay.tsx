import { TouchableOpacity, TouchableOpacityProps, Dimensions } from "react-native";
import { generateProgressPercentage } from "../utils/generate-progess-percentage";
import clsx from "clsx";
import dayjs from "dayjs";

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get("screen").width/WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

interface Props extends TouchableOpacityProps {
	total?: number;
	completed?: number;
	date: Date;
}

export function HabitDay({total = 0, completed = 0, date, ...rest}: Props) {
	const amountAccomplishedPercentage = total > 0 ? generateProgressPercentage(completed, total) : 0;
	const today = dayjs().startOf("day").toDate();
	const isCurrentDay = dayjs(date).isSame(today);
	return(
		<TouchableOpacity
			className={clsx("rounded-full border-2 m-1 bg-zinc-900 border-zinc-800", {
				["bg-amber-900 border-amber-700"]: amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
				["bg-amber-800 border-amber-600"]: amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
				["bg-amber-700 border-amber-500"]: amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
				["bg-amber-600 border-amber-400"]: amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
				["bg-amber-500 border-amber-300"]: amountAccomplishedPercentage >= 80,
				["border-white border-3"]: isCurrentDay
			})}
			style={{width: DAY_SIZE, height: DAY_SIZE}}
			activeOpacity={0.7}
			{...rest}
		/>
	)
}