import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS, BeautifulMermaidSettings, BeautifulMermaidSettingTab } from './settings'

export default class BeautifulMermaidPlugin extends Plugin {
	settings: BeautifulMermaidSettings

	async onload() {
		await this.loadSettings()

		this.addSettingTab(new BeautifulMermaidSettingTab(this.app, this))
	}

	onunload() {
		// Cleanup if necessary
	}

	async loadSettings() {
		this.settings = {
			...DEFAULT_SETTINGS,
			...((await this.loadData()) as Partial<BeautifulMermaidSettings>),
		}
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
