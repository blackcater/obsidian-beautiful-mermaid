import { BeautifulMermaidPlugin } from './BeautifulMermaidPlugin'
import { RenderOptions, ThemeColors, PRESET_THEMES as THEMES } from './BeautifulMermaidSettingTab'

export class CommonUtils {
	public static getThemeColors(plugin: BeautifulMermaidPlugin): ThemeColors {
		const isDarkMode = plugin.app.isDarkMode()
		const isCustom = isDarkMode ? plugin.settings.darkIsCustom : plugin.settings.lightIsCustom

		if (isDarkMode) {
			return isCustom ? plugin.settings.darkCustomColors : THEMES[plugin.settings.darkPreset]!
		} else {
			return isCustom
				? plugin.settings.lightCustomColors
				: THEMES[plugin.settings.lightPreset]!
		}
	}

	public static getRenderOptions(plugin: BeautifulMermaidPlugin): RenderOptions {
		return plugin.settings.renderOptions
	}
}
