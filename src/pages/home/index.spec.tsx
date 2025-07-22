import { describe, expect, it } from 'vitest'

import { composeStories } from '@storybook/react'

import { customRender } from '@hn/test/customRender'

import * as stories from './index.stories'

describe('HomePage', () => {
  const { FirstStory } = composeStories(stories)

  it('Render thành công', () => {
    customRender(<FirstStory />)
    expect(true).toBeTruthy()
  })
})
