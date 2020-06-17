import isKeyHotkey, {toKeyName} from 'is-hotkey'
import {SlateEditor} from '../typeDefs'

type Options = {
  decorators?: string[]
}

// This plugin makes keyboard shortcuts for decorators

const isStrongHotkey = isKeyHotkey('mod+b')
const isEmphasisHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotKey = isKeyHotkey("mod+'")

const modKeyPlatformName = toKeyName('mod')

export const keyMaps = {
  strong: `${modKeyPlatformName} + b`,
  em: `${modKeyPlatformName} + i`,
  underline: `${modKeyPlatformName} + u`,
  code: `${modKeyPlatformName} + '`
}

export default function SetMarksOnKeyComboPlugin(options: Options = {}) {
  const decorators = options.decorators || []
  return {
    onKeyDown(event: React.KeyboardEvent<any>, editor: SlateEditor, next: (arg0: void) => void) {
      let mark
      if (isStrongHotkey(event as any)) {
        mark = 'strong'
      } else if (isEmphasisHotkey(event as any)) {
        mark = 'em'
      } else if (isUnderlinedHotkey(event as any)) {
        mark = 'underline'
      } else if (isCodeHotKey(event as any)) {
        mark = 'code'
      } else {
        return next()
      }
      // Return if not supported by schema
      if (!decorators.includes(mark)) {
        return next()
      }
      event.preventDefault()
      return editor.toggleMark(mark)
    }
  }
}
