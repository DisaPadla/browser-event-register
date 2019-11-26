export class EventRegister {
  constructor() {
    if (!Event && !CustomEvent) {
      console.warn("Event constructor doesn't support in your browser.")
    }
  }

  private noop = () => {}

  private events: Object = {}

  public add({ node = document, type, listener, options }) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push({ node, options, listener })
    node.addEventListener(type, listener, options)
  }

  public dispatch(params) {
    let node
    let type
    let options
    if (typeof params === 'string') {
      node = document
      type = params
    } else {
      node = params.node || document
      type = params.type
      options = params.options
    }

    this.isTypeExist('dispatch', type)

    const evt = CustomEvent ? new CustomEvent(type, options) : new Event(type, options)
    node.dispatchEvent(evt)
  }

  public remove({ node = document, type, listener, options }) {
    this.isTypeExist('remove', type)
    node.removeEventListener(type, listener, options)
    const index = this.events[type].findIndex(item => item.listener === listener)

    if (index !== -1) {
      this.events[type].splice(index, 1)
    }
  }

  public removeAllListeners(type) {
    this.isTypeExist('removeAllListeners', type)
    for (let i = 0; i < this.events[type].length; i++) {
      this.events[type][i].node.removeEventListener(
        type,
        this.events[type][i].listener,
        this.events[type][i].options
      )
    }
    delete this.events[type]
  }

  private isTypeExist(methodName, type) {
    if (!this.events[type]) {
      throw new Error(
        `Custom event "${type}" doesn't exist. You can't ${methodName} it.${this.allowedEvents()}`
      )
    }
  }

  private allowedEvents() {
    return Object.keys(this.events).reduce(
      (str, evName, i) => `${str}\t\t${i + 1}) ${evName}\n`,
      '\n\tAllowed custom events:\n'
    )
  }
}
