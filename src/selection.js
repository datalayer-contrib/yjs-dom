/**
 * @module bindings/dom
 */

/* globals getSelection */

import * as Y from 'yjs'

let relativeSelection = null

/**
 * @private
 */
const _getCurrentRelativeSelection = domBinding => {
  const { baseNode, baseOffset, extentNode, extentOffset } = getSelection()
  const baseNodeType = domBinding.domToType.get(baseNode)
  const extentNodeType = domBinding.domToType.get(extentNode)
  if (baseNodeType !== undefined && extentNodeType !== undefined) {
    return {
      from: Y.getRelativePosition(baseNodeType, baseOffset),
      to: Y.getRelativePosition(extentNodeType, extentOffset)
    }
  }
  return null
}

/**
 * @private
 */
export const getCurrentRelativeSelection = typeof getSelection !== 'undefined' ? _getCurrentRelativeSelection : domBinding => null

/**
 * @private
 */
export const beforeTransactionSelectionFixer = domBinding => {
  relativeSelection = getCurrentRelativeSelection(domBinding)
}

/**
 * Reset the browser range after every transaction.
 * This prevents any collapsing issues with the local selection.
 *
 * @private
 */
export const afterTransactionSelectionFixer = domBinding => {
  if (relativeSelection !== null) {
    domBinding.restoreSelection(relativeSelection)
  }
}
