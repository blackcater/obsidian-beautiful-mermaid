import { MarkdownPostProcessorContext, Plugin } from 'obsidian'
import {
	BeautifulMermaidSettings,
	BeautifulMermaidSettingTab,
	DEFAULT_SETTINGS,
} from './BeautifulMermaidSettingTab'
import { MermaidBlock } from './MermaidBlock'

export class BeautifulMermaidPlugin extends Plugin {
	settings: BeautifulMermaidSettings
	activedMermaidBlocks: Set<MermaidBlock>

	async onload() {
		await this.loadSettings()

		this.activedMermaidBlocks = new Set()

		this.addSettingTab(new BeautifulMermaidSettingTab(this.app, this))

		this.registerEvent(
			this.app.workspace.on('css-change', () => {
				this.forceUpdate()
			}),
		)

		// Reading Mode
		this.registerMarkdownCodeBlockProcessor(
			'beautiful-mermaid',
			this.mermaidPostProcessor.bind(this),
		)
	}

	forceUpdate() {
		for (const block of this.activedMermaidBlocks) {
			block.forceRender()
		}
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
		this.forceUpdate()
	}
}
