import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { SyntaxNode } from '@lezer/common'
import { renderMermaid } from 'beautiful-mermaid'
import BeautifulMermaidPlugin from './main'
import { ThemeColors } from './settings'
import { getThemeColors } from './utils'

export function createMermaidPreviewPlugin(plugin: BeautifulMermaidPlugin) {
	return ViewPlugin.fromClass(
		class MermaidPreviewPlugin {
			decorations: DecorationSet
			cache: Map<string, MermaidWidget> = new Map()

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view)
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged) {
					this.decorations = this.buildDecorations(update.view)
				}
			}

			private buildDecorations(view: EditorView): DecorationSet {
				const builder = new RangeSetBuilder<Decoration>()
				let lang = ''
				let state: SyntaxNode[] = []

				syntaxTree(view.state).iterate({
					enter: (nodeRef) => {
						const node = nodeRef.node
						const props = new Set<string>(node.type.name?.split('_'))

						if (
							props.has('HyperMD-codeblock') &&
							!props.has('HyperMD-codeblock-begin') &&
							!props.has('HyperMD-codeblock-end')
						) {
							state.push(node)
							return
						}

						if (props.has('HyperMD-codeblock-begin')) {
							const content = view.state.sliceDoc(node.from, node.to)

							lang = /^```\s*(\S+)/.exec(content)?.[1] ?? ''
						}

						if (props.has('HyperMD-codeblock-end')) {
							if (lang !== 'mermaid') return

							const startPos = state.at(0)!.from
							const endPos = state.at(-1)!.to
							const code = view.state.sliceDoc(startPos, endPos)
							const themeColors = getThemeColors(plugin)
							const widget = this.getWidget(code, themeColors)

							builder.add(
								node.to,
								node.to,
								Decoration.widget({
									widget,
									side: 1,
								}),
							)
						}
					},
				})

				return builder.finish()
			}

			private getWidget(code: string, themeColors: ThemeColors): MermaidWidget {
				let widget = this.cache.get(code)
				if (!widget) {
					widget = new MermaidWidget(code, themeColors)
					this.cache.set(code, widget)
				}
				return widget
			}
		},
		{
			decorations: (v) => v.decorations,
		},
	)
}

class MermaidWidget extends WidgetType {
	constructor(
		private readonly code: string,
		private readonly themeColors: ThemeColors,
	) {
		super()
	}

	eq(other: MermaidWidget) {
		return other.code === this.code
	}

	toDOM() {
		const el = document.createElement('div')
		el.className = 'beautiful-mermaid'
		el.innerHTML = ''

		renderMermaid(this.code, this.themeColors).then((svg) => {
			el.innerHTML = svg
		})

		return el
	}

	ignoreEvent() {
		return true
	}
}
