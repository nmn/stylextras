type DialogCommand = 'request-close' | 'show-modal'

function getDialog(target: string) {
  const dialog = document.getElementById(target)
  return dialog instanceof HTMLDialogElement ? dialog : null
}

export function getDialogCommandInvoker(
  event: Event,
  target: string,
): { command: DialogCommand; invoker: HTMLButtonElement } | null {
  const eventTarget = event.target
  if (!(eventTarget instanceof Element)) return null
  const invoker = eventTarget.closest<HTMLButtonElement>('button[command][commandfor]')
  if (!invoker || invoker.disabled || invoker.getAttribute('commandfor') !== target) return null
  const command = invoker.getAttribute('command')
  if (command !== 'show-modal' && command !== 'request-close') return null
  return { command, invoker }
}

function dispatchCommand(dialog: HTMLDialogElement, invoker: HTMLButtonElement, command: DialogCommand) {
  const commandEvent = new Event('command', { cancelable: true })
  Object.defineProperties(commandEvent, {
    command: { value: command },
    source: { value: invoker },
  })
  return dialog.dispatchEvent(commandEvent)
}

export function invokeDialogCommandFallback(
  target: string,
  invoker: HTMLButtonElement,
  command: DialogCommand,
) {
  const dialog = getDialog(target)
  if (!dialog || !dispatchCommand(dialog, invoker, command)) return

  if (command === 'show-modal') {
    if (!dialog.open) dialog.showModal()
    return
  }
  if (!dialog.open) return

  const requestClose = (dialog as HTMLDialogElement & { requestClose?: () => void }).requestClose
  if (typeof requestClose === 'function') {
    requestClose.call(dialog)
    return
  }

  const cancelEvent = new Event('cancel', { cancelable: true })
  if (dialog.dispatchEvent(cancelEvent)) dialog.close()
}

/** Installs delegated dialog-command behavior for one target in browsers without invoker commands. */
export function installInvokerCommandFallback(target: string) {
  const handleClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return
    const request = getDialogCommandInvoker(event, target)
    if (!request) return
    event.preventDefault()
    invokeDialogCommandFallback(target, request.invoker, request.command)
  }

  document.addEventListener('click', handleClick)
  return () => document.removeEventListener('click', handleClick)
}
