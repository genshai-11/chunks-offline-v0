import type { Preview } from '@storybook/react-vite'

import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'todo',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'bauhaus'
      return (
        <div data-theme={theme} className="min-h-screen bg-chunks-canvas p-6 text-chunks-ink">
          <Story />
        </div>
      )
    },
  ],
  globalTypes: {
    theme: {
      description: 'CHUNKS visual theme',
      defaultValue: 'bauhaus',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'calm', title: 'Theme 1 — Calm' },
          { value: 'bauhaus', title: 'Theme 2 — Bauhaus' },
          { value: 'modular', title: 'Theme 3 — Modular' },
          { value: 'craft', title: 'Theme 4 — Craft' },
        ],
      },
    },
  },
}

export default preview
