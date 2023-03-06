import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import messages from "./translation";
import { getLocales } from "expo-localization";

i18n
	.use(initReactI18next)
	.init({
		compatibilityJSON: "v3",
		resources: messages,
		lng: getLocales()[0].languageCode,
		fallbackLng: 'en',
		debug: false,

		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		}
	});

export default i18n;