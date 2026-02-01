import { MarkdownPostProcessorContext, Plugin } from 'obsidian'
import { BeautifulMermaidSettings, BeautifulMermaidSettingTab, DEFAULT_SETTINGS } from './settings'
import { MermaidBlock } from 'MermaidBlock'

export default class BeautifulMermaidPlugin extends Plugin {
	settings: BeautifulMermaidSettings
	activedMermaidBlocks: Set<MermaidBlock>

	async onload() {
		await this.loadSettings()

		this.activedMermaidBlocks = new Set()

		this.addSettingTab(new BeautifulMermaidSettingTab(this.app, this))

		// Reading Mode
		this.registerMarkdownCodeBlockProcessor('mermaid', this.mermaidPostProcessor.bind(this))

		this.registerEvent(
			this.app.workspace.on('css-change', () => {
				for (const block of this.activedMermaidBlocks) {
					block.forceRender()
				}
			}),
		)
	}

	// Reading Mode Mermaid Processor
	async mermaidPostProcessor(
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
	): Promise<any> {
		ctx.addChild(new MermaidBlock(this, el, source, ctx))
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
