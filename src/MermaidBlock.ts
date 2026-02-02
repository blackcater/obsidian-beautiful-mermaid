import { renderMermaid } from 'beautiful-mermaid'
import { MarkdownPostProcessorContext, MarkdownRenderChild } from 'obsidian'
import { BeautifulMermaidPlugin } from './BeautifulMermaidPlugin'
import { CommonUtils } from './CommonUtils'

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
		this.containerEl.style.overflow = 'auto'

		const svg = await renderMermaid(this.source, CommonUtils.getThemeColors(this.plugin))

		// Generate unique IDs for markers to avoid conflicts with Obsidian's sanitization
		const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`

		const modifiedSvg = svg
			.replace(/id="arrowhead"/g, `id="${uniqueId}-arrowhead"`)
			.replace(/id="arrowhead-start"/g, `id="${uniqueId}-arrowhead-start"`)
			.replace(/url\(#arrowhead\)/g, `url(#${uniqueId}-arrowhead)`)
			.replace(/url\(#arrowhead-start\)/g, `url(#${uniqueId}-arrowhead-start)`)

		this.containerEl.innerHTML = modifiedSvg
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
