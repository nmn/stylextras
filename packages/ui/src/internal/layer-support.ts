export function supportsInvokerCommands() {
  if (typeof document === 'undefined') return true
  const button = document.createElement('button') as HTMLButtonElement & {
    command?: unknown
    commandForElement?: unknown
  }
  return typeof button.command === 'string' && button.commandForElement === null
}

export function supportsDialogClosedBy() {
  return typeof HTMLDialogElement === 'undefined' || 'closedBy' in HTMLDialogElement.prototype
}
