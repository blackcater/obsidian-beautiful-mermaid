import { renderMermaid } from 'beautiful-mermaid'
import BeautifulMermaidPlugin from 'main'
import { MarkdownPostProcessorContext, MarkdownRenderChild } from 'obsidian'
import { getThemeColors } from 'utils'

export class MermaidBlock extends MarkdownRenderChild {
	plugin: BeautifulMermaidPlugin
	source: string
	ctx: MarkdownPostProcessorContext

	constructor(
		plugin: BeautifulMermaidPlugin,
		containerEl: HTMLElement,
		source: string,
		ctx: MarkdownPostProcessorContext,
	) {
		super(containerEl)

		this.plugin = plugin
		this.source = source
		this.ctx = ctx
	}

	private async render(): Promise<void> {
		this.containerEl.empty()

		const svg = await renderMermaid(this.source, getThemeColors(this.plugin))

		this.containerEl.innerHTML = svg
	}

	public async forceRender(): Promise<void> {
		await this.render()
	}

	public onload(): void {
		super.onload()
		this.plugin.activedMermaidBlocks.add(this)
		this.render()
	}

	public onunload(): void {
		super.onunload()
		this.plugin.activedMermaidBlocks.delete(this)
		this.containerEl.empty()
	}
}
