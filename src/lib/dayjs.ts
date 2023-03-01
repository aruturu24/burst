import dayjs from "dayjs";
import "dayjs/locale/pt-br"
import { getLocales } from "expo-localization";

dayjs.locale(getLocales()[0].languageCode);