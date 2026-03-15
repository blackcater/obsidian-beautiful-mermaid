import { App, PluginSettingTab, Setting, TextComponent } from 'obsidian'
import { BeautifulMermaidPlugin } from './BeautifulMermaidPlugin'

export const PRESET_THEMES: Record<string, ThemeColors> = {
	'default-light': {},
	'default-dark': {
		bg: '#181818',
		fg: '#FAFAFA',
	},
	'zinc-dark': {
		bg: '#18181B',
		fg: '#FAFAFA',
	},
	'tokyo-night': {
		bg: '#1a1b26',
		fg: '#a9b1d6',
		line: '#3d59a1',
		accent: '#7aa2f7',
		muted: '#565f89',
	},
	'tokyo-night-storm': {
		bg: '#24283b',
		fg: '#a9b1d6',
		line: '#3d59a1',
		accent: '#7aa2f7',
		muted: '#565f89',
	},
	'tokyo-night-light': {
		bg: '#d5d6db',
		fg: '#343b58',
		line: '#34548a',
		accent: '#34548a',
		muted: '#9699a3',
	},
	'catppuccin-mocha': {
		bg: '#1e1e2e',
		fg: '#cdd6f4',
		line: '#585b70',
		accent: '#cba6f7',
		muted: '#6c7086',
	},
	'catppuccin-latte': {
		bg: '#eff1f5',
		fg: '#4c4f69',
		line: '#9ca0b0',
		accent: '#8839ef',
		muted: '#9ca0b0',
	},
	nord: {
		bg: '#2e3440',
		fg: '#d8dee9',
		line: '#4c566a',
		accent: '#88c0d0',
		muted: '#616e88',
	},
	'nord-light': {
		bg: '#eceff4',
		fg: '#2e3440',
		line: '#aab1c0',
		accent: '#5e81ac',
		muted: '#7b88a1',
	},
	dracula: {
		bg: '#282a36',
		fg: '#f8f8f2',
		line: '#6272a4',
		accent: '#bd93f9',
		muted: '#6272a4',
	},
	'github-light': {
		bg: '#ffffff',
		fg: '#1f2328',
		line: '#d1d9e0',
		accent: '#0969da',
		muted: '#59636e',
	},
	'github-dark': {
		bg: '#0d1117',
		fg: '#e6edf3',
		line: '#3d444d',
		accent: '#4493f8',
		muted: '#9198a1',
	},
	'solarized-light': {
		bg: '#fdf6e3',
		fg: '#657b83',
		line: '#93a1a1',
		accent: '#268bd2',
		muted: '#93a1a1',
	},
	'solarized-dark': {
		bg: '#002b36',
		fg: '#839496',
		line: '#586e75',
		accent: '#268bd2',
		muted: '#586e75',
	},
	'one-dark': {
		bg: '#282c34',
		fg: '#abb2bf',
		line: '#4b5263',
		accent: '#c678dd',
		muted: '#5c6370',
	},
}

export type ThemeName = keyof typeof PRESET_THEMES

export interface ThemeColors {
	/** Background color → CSS variable --bg. */
	bg?: string
	/** Foreground / primary text color → CSS variable --fg. */
	fg?: string
	/** Edge/connector color → CSS variable --line */
	line?: string
	/** Arrow heads, highlights → CSS variable --accent */
	accent?: string
	/** Secondary text, edge labels → CSS variable --muted */
	muted?: string
	/** Node/box fill tint → CSS variable --surface */
	surface?: string
	/** Node/group stroke color → CSS variable --border */
	border?: string
}

export interface RenderOptions {
	/** Font family for all text. Default: 'Inter' */
	font?: string
	/** Canvas padding in px. Default: 40 */
	padding?: number
	/** Horizontal spacing between sibling nodes. Default: 24 */
	nodeSpacing?: number
	/** Vertical spacing between layers. Default: 40 */
	layerSpacing?: number
	/** Spacing between disconnected components. Default: nodeSpacing (24) */
	componentSpacing?: number
	/** Render with transparent background (no background style on SVG). Default: false */
	transparent?: boolean
	/** Enable hover tooltips on chart data points (xychart only). Default: false */
	interactive?: boolean
}

export interface BeautifulMermaidSettings {
	lightPreset: ThemeName
	lightCustomColors: ThemeColors
	lightIsCustom: boolean
	darkPreset: ThemeName
	darkCustomColors: ThemeColors
	darkIsCustom: boolean
	renderOptions: RenderOptions
}

export const DEFAULT_SETTINGS: BeautifulMermaidSettings = {
	lightPreset: 'default-light',
	lightCustomColors: {},
	lightIsCustom: false,
	darkPreset: 'default-dark',
	darkCustomColors: {},
	darkIsCustom: false,
	renderOptions: {
		font: 'Inter',
		padding: 40,
		nodeSpacing: 24,
		layerSpacing: 40,
		componentSpacing: 24,
		transparent: true,
		interactive: false,
	},
}

export const PRESET_THEME_OPTIONS = Object.keys(PRESET_THEMES).map((value) => {
	const label = value
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')
	return { value, label }
})

export class BeautifulMermaidSettingTab extends PluginSettingTab {
	plugin: BeautifulMermaidPlugin

	constructor(app: App, plugin: BeautifulMermaidPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		// Light Mode Theme
		containerEl.createEl('h2', { text: 'Light Mode Theme' })
		containerEl.createEl('p', {
			text: 'Configure the theme used when Obsidian is in light mode.',
			cls: 'setting-item-description',
		})

		new Setting(containerEl).setName('Preset Theme').addDropdown((dropdown) => {
			PRESET_THEME_OPTIONS.forEach(({ value, label }) => {
				dropdown.addOption(value, label)
			})
			dropdown.setValue(this.plugin.settings.lightPreset).onChange(async (value) => {
				this.plugin.settings.lightPreset = value
				this.plugin.settings.lightCustomColors = { ...PRESET_THEMES[value]! }
				await this.plugin.saveSettings()
				this.display()
			})
		})

		new Setting(containerEl)
			.setName('Customize Colors')
			.setDesc(
				'Enable to customize theme colors. Changes will persist for the selected preset.',
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.lightIsCustom).onChange(async (value) => {
					this.plugin.settings.lightIsCustom = value
					await this.plugin.saveSettings()
					this.display()
				}),
			)

		if (this.plugin.settings.lightIsCustom) {
			this.createThemeColorsSection(
				containerEl,
				this.plugin.settings.lightCustomColors,
				{ ...PRESET_THEMES[this.plugin.settings.lightPreset]! },
				async (colors) => {
					this.plugin.settings.lightCustomColors = colors
					await this.plugin.saveSettings()
				},
				async (colors) => {
					this.plugin.settings.lightCustomColors = colors
					await this.plugin.saveSettings()
					this.display()
				},
			)
		}

		containerEl.createEl('hr')

		// Dark Mode Theme
		containerEl.createEl('h2', { text: 'Dark Mode Theme' })
		containerEl.createEl('p', {
			text: 'Configure the theme used when Obsidian is in dark mode.',
			cls: 'setting-item-description',
		})

		new Setting(containerEl).setName('Preset Theme').addDropdown((dropdown) => {
			PRESET_THEME_OPTIONS.forEach(({ value, label }) => {
				dropdown.addOption(value, label)
			})
			dropdown.setValue(this.plugin.settings.darkPreset).onChange(async (value) => {
				this.plugin.settings.darkPreset = value
				this.plugin.settings.darkCustomColors = { ...PRESET_THEMES[value]! }
				await this.plugin.saveSettings()
			})
		})

		new Setting(containerEl)
			.setName('Customize Colors')
			.setDesc(
				'Enable to customize theme colors. Changes will persist for the selected preset.',
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.darkIsCustom).onChange(async (value) => {
					this.plugin.settings.darkIsCustom = value
					await this.plugin.saveSettings()
					this.display()
				}),
			)

		if (this.plugin.settings.darkIsCustom) {
			this.createThemeColorsSection(
				containerEl,
				this.plugin.settings.darkCustomColors,
				{ ...PRESET_THEMES[this.plugin.settings.darkPreset]! },
				async (colors) => {
					this.plugin.settings.darkCustomColors = colors
					await this.plugin.saveSettings()
				},
				async (colors) => {
					this.plugin.settings.lightCustomColors = colors
					await this.plugin.saveSettings()
					this.display()
				},
			)
		}

		containerEl.createEl('hr')

		// Render Options
		containerEl.createEl('h2', { text: 'Render Options' })
		containerEl.createEl('p', {
			text: 'Configure rendering settings for mermaid diagrams.',
			cls: 'setting-item-description',
		})

		const renderOptions = this.plugin.settings.renderOptions

		new Setting(containerEl)
			.setName('Font Family')
			.setDesc('Font family for all text')
			.addText((text) =>
				text.setValue(renderOptions.font ?? 'Inter').onChange(async (value) => {
					this.plugin.settings.renderOptions.font = value || 'Inter'
					await this.plugin.saveSettings()
				}),
			)

		new Setting(containerEl)
			.setName('Padding')
			.setDesc('Canvas padding in px')
			.addText((text) =>
				text.setValue(String(renderOptions.padding)).onChange(async (value) => {
					const num = Number.parseInt(value, 10)
					if (!Number.isNaN(num)) {
						this.plugin.settings.renderOptions.padding = num
						await this.plugin.saveSettings()
					}
				}),
			)

		new Setting(containerEl)
			.setName('Node Spacing')
			.setDesc('Horizontal spacing between sibling nodes')
			.addText((text) =>
				text.setValue(String(renderOptions.nodeSpacing)).onChange(async (value) => {
					const num = Number.parseInt(value, 10)
					if (!Number.isNaN(num)) {
						this.plugin.settings.renderOptions.nodeSpacing = num
						await this.plugin.saveSettings()
					}
				}),
			)

		new Setting(containerEl)
			.setName('Layer Spacing')
			.setDesc('Vertical spacing between layers')
			.addText((text) =>
				text.setValue(String(renderOptions.layerSpacing)).onChange(async (value) => {
					const num = Number.parseInt(value, 10)
					if (!Number.isNaN(num)) {
						this.plugin.settings.renderOptions.layerSpacing = num
						await this.plugin.saveSettings()
					}
				}),
			)

		new Setting(containerEl)
			.setName('Component Spacing')
			.setDesc('Spacing between disconnected components')
			.addText((text) =>
				text.setValue(String(renderOptions.componentSpacing)).onChange(async (value) => {
					const num = Number.parseInt(value, 10)
					if (!Number.isNaN(num)) {
						this.plugin.settings.renderOptions.componentSpacing = num
						await this.plugin.saveSettings()
					}
				}),
			)

		new Setting(containerEl)
			.setName('Transparent Background')
			.setDesc('Render with transparent background')
			.addToggle((toggle) =>
				toggle.setValue(renderOptions.transparent ?? false).onChange(async (value) => {
					this.plugin.settings.renderOptions.transparent = value
					await this.plugin.saveSettings()
				}),
			)

		new Setting(containerEl)
			.setName('Interactive')
			.setDesc('Enable hover tooltips on chart data points (xychart only)')
			.addToggle((toggle) =>
				toggle.setValue(renderOptions.interactive ?? false).onChange(async (value) => {
					this.plugin.settings.renderOptions.interactive = value
					await this.plugin.saveSettings()
				}),
			)
	}

	private createThemeColorsSection(
		containerEl: HTMLElement,
		themeColors: ThemeColors,
		defaultColors: ThemeColors,
		onChange: (colors: ThemeColors) => void,
		onReset: (colors: ThemeColors) => void,
	): void {
		const section = containerEl.createEl('div', {
			cls: 'theme-colors-section',
		})

		const colors: { key: keyof ThemeColors; label: string; desc: string }[] = [
			{ key: 'bg', label: 'Background', desc: 'Diagram background color' },
			{ key: 'fg', label: 'Foreground', desc: 'Primary text and node content color' },
			{ key: 'line', label: 'Line', desc: 'Connection lines and edges color' },
			{ key: 'accent', label: 'Accent', desc: 'Arrow heads, highlights and emphasis' },
			{ key: 'muted', label: 'Muted', desc: 'Secondary text, labels and details' },
			{ key: 'surface', label: 'Surface', desc: 'Node fill color and backgrounds' },
			{ key: 'border', label: 'Border', desc: 'Node stroke and border color' },
		]

		colors.forEach(({ key, label, desc }) => {
			const value = themeColors[key]
			const defaultValue = defaultColors[key]
			this.createColorInput(section, label, desc, value, defaultValue, (newValue) => {
				themeColors = themeColors || { ...defaultColors }
				themeColors[key] = newValue || defaultValue
				onChange(themeColors)
			})
		})

		// Reset button
		new Setting(section)
			.setName('')
			.setDesc('Clear all custom colors and use preset defaults')
			.addButton((btn) =>
				btn.setButtonText('Reset to Default').onClick(async () => {
					onReset({ ...defaultColors })
				}),
			)
	}

	private createColorInput(
		container: HTMLElement,
		label: string,
		description: string,
		value: string | undefined,
		defaultValue: string | undefined,
		onChange: (value: string | undefined) => void,
	): TextComponent {
		const setting = new Setting(container).setName(label).setDesc(description)

		const wrapper = setting.controlEl.createEl('div')
		wrapper.style.display = 'flex'
		wrapper.style.alignItems = 'center'
		wrapper.style.gap = '8px'

		const colorPreview = wrapper.createEl('span')
		colorPreview.style.width = '24px'
		colorPreview.style.height = '24px'
		colorPreview.style.borderRadius = '50%'
		colorPreview.style.border = '2px solid var(--text-muted)'
		colorPreview.style.flexShrink = '0'

		// 空值时使用默认值
		const actualValue = value || defaultValue
		colorPreview.style.backgroundColor = actualValue || 'transparent'

		const text = new TextComponent(wrapper)
		text.setPlaceholder(defaultValue || '')
		text.setValue(value ?? '')
		text.onChange(onChange)
		text.inputEl.style.width = '100px'

		const updatePreview = (color: string | undefined) => {
			const actual = color || defaultValue
			colorPreview.style.backgroundColor = actual || 'transparent'
		}

		text.onChange((value) => {
			const trimmed = value.trim()
			updatePreview(trimmed || undefined)
			onChange(trimmed || undefined)
		})

		return text
	}
}
