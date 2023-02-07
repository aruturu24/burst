import { useState } from "react";
import { TouchableOpacity, ScrollView, View, Text, TextInput, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
//import { api } from "../lib/axios";
import { setHabit } from "../lib/storage";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import { v4 as uuidv4 } from "uuid";
import { HabitInfo } from "../components/HabitInfo";

const availableWeekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function New() {
	const[title, setTitle] = useState("");
	const [weekDays, setWeekDays] = useState<number[]>([]);
	function handleToggleWeekDay(weekDayIndex: number) {
		if(weekDays.includes(weekDayIndex)) {
			setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
		}else {
			setWeekDays(prevState => [...prevState, weekDayIndex]);
		}
	}

	async function handleCreateNewHabit() {
		setTitle(title.trim())
		try {
			if(!title || weekDays.length === 0) {
				return Alert.alert("Novo hábito", "Informe o nome do hábito e escolha a recorrência.")
			}

			//await api.post("/habits", {title, weekDays});
			await setHabit({
				id: uuidv4(),
				title: title,
				created_at: dayjs(new Date).startOf("day").toDate(),
				week_days: weekDays
			});
			setTitle("");
			setWeekDays([]);
			Alert.alert("Novo hábito", "Hábito criado com sucesso!");
		} catch(e) {
			console.log(e);
			Alert.alert("Ops", "Não foi possível criar o novo hábito.");
		}
	}

	return(
		<View className="flex-1 bg-background px-8 pt-16">
			<BackButton />
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
				<Text className="mt-6 text-white font-extrabold text-3xl">
					Criar hábito
				</Text>
				<Text className="mt-6 text-white font-semibold text-base">
					Qual seu comprometimento?
				</Text>
				<TextInput 
					className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
					placeholder="Exercícios, dromir bem, etc..."
					placeholderTextColor={colors.zinc[400]}
					onChangeText={setTitle}
					value={title}
				/>
				<Text className="font-semibold mt-4 mb-3 text-white text-base">
					Qual a recorrência?
				</Text>
				{availableWeekDays.map((weekDay, i) => (
					<HabitInfo
						key={weekDay} 
						title={weekDay} 
						checked={weekDays.includes(i)} 
						onPress={() => handleToggleWeekDay(i)}
					/>
				))}

				<TouchableOpacity
					onPress={handleCreateNewHabit} 
					className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6" 
					activeOpacity={0.7}
				>
					<Feather name="check" size={20} color={colors.white} />
					<Text className="font-semibold text-base text-white ml-2">
						Confirmar
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}