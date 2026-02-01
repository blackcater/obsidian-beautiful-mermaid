import BeautifulMermaidPlugin from 'main'
import { ThemeColors, PRESET_THEMES as THEMES } from './settings'

export function getThemeColors(plugin: BeautifulMermaidPlugin): ThemeColors {
	const isDarkMode = plugin.app.isDarkMode()
	const isCustom = isDarkMode ? plugin.settings.darkIsCustom : plugin.settings.lightIsCustom

	if (isDarkMode) {
		return isCustom ? plugin.settings.darkCustomColors : THEMES[plugin.settings.darkPreset]!
	} else {
		return isCustom ? plugin.settings.lightCustomColors : THEMES[plugin.settings.lightPreset]!
	}
}
