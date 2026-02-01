import { MarkdownPostProcessorContext, Plugin } from 'obsidian'
import { MermaidBlock } from './MermaidBlock'
import { BeautifulMermaidSettings, BeautifulMermaidSettingTab, DEFAULT_SETTINGS } from './settings'

export default class BeautifulMermaidPlugin extends Plugin {
	settings: BeautifulMermaidSettings
	activedMermaidBlocks: Set<MermaidBlock>

	async onload() {
		await this.loadSettings()

		this.activedMermaidBlocks = new Set()

		this.addSettingTab(new BeautifulMermaidSettingTab(this.app, this))

		this.registerEvent(
			this.app.workspace.on('css-change', () => {
				for (const block of this.activedMermaidBlocks) {
					block.forceRender()
				}
			}),
		)

		// Reading Mode
		this.registerMarkdownCodeBlockProcessor(
			'beautiful-mermaid',
			this.mermaidPostProcessor.bind(this),
		)

		// Living Mode
		this.registerMarkdownPostProcessor((el, ctx) => {
			console.log('Living Mode Post Processor', el, ctx)
		})
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
