const EventRegister = require('../').EventRegister

describe('EventRegister', () => {
  let eventRegister
  let listener
  let custom_type
  beforeEach(() => {
    listener = jest.fn()
    custom_type = 'some-custom-event'
    eventRegister = new EventRegister()
  })

  test('should add new event types', () => {
    const another_custom_type = 'another-custom-event'

    eventRegister.add({
      type: custom_type,
      listener
    })
    eventRegister.add({
      type: another_custom_type,
      listener
    })

    const eventTypes = Object.keys(eventRegister.events)
    expect(eventTypes).toEqual([custom_type, another_custom_type])
  })

  test('should remove all listeners by type', () => {
    const new_listener = jest.fn()

    eventRegister.add({
      type: custom_type,
      listener
    })
    eventRegister.add({
      type: custom_type,
      listener: new_listener
    })

    expect(eventRegister.events[custom_type].length).toEqual(2)

    eventRegister.removeAllListenersByType(custom_type)

    expect(eventRegister.events[custom_type]).toBeUndefined()
  })

  test('should remove first listeners by type', () => {
    const new_listener = jest.fn()

    eventRegister.add({
      type: custom_type,
      listener
    })
    eventRegister.add({
      type: custom_type,
      listener: new_listener
    })

    expect(eventRegister.events[custom_type].length).toEqual(2)

    eventRegister.remove({
      type: custom_type,
      listener
    })

    expect(eventRegister.events[custom_type].length).toEqual(1)
    expect(eventRegister.events[custom_type][0].listener).toEqual(new_listener)
  })

  test('should trigger listener', () => {
    eventRegister.add({
      type: custom_type,
      listener
    })
    eventRegister.dispatch(custom_type)

    expect(listener).toHaveBeenCalled()
  })

  test('should trigger all listeners by type', () => {
    const new_listener = jest.fn()

    eventRegister.add({
      type: custom_type,
      listener
    })
    eventRegister.add({
      type: custom_type,
      listener: new_listener
    })

    eventRegister.dispatch(custom_type)

    expect(listener).toHaveBeenCalled()
    expect(new_listener).toHaveBeenCalled()
  })

  test('should trigger listener with custom params', () => {
    eventRegister.add({
      type: custom_type,
      listener
    })
    eventRegister.dispatch({
      type: custom_type,
      options: {
        detail: 'Custom Params'
      }
    })

    const evt = new CustomEvent(custom_type, { detail: 'Custom Params' })
    expect(listener).toHaveBeenCalledWith(evt)
  })

  test("should throw error if event type doesn't exist", () => {
    eventRegister.add({
      type: custom_type,
      listener
    })
    expect(eventRegister.dispatch.bind(eventRegister, 'wrong-custom-event')).toThrow(
      new Error(
        `Custom event "wrong-custom-event" doesn\'t exist. You can\'t dispatch it.\n\tAllowed custom events:\n\t\t1) some-custom-event\n`
      )
    )

    expect(
      eventRegister.remove.bind(eventRegister, {
        type: 'wrong-custom-event'
      })
    ).toThrow(
      new Error(
        `Custom event "wrong-custom-event" doesn\'t exist. You can\'t remove it.\n\tAllowed custom events:\n\t\t1) some-custom-event\n`
      )
    )

    expect(
      eventRegister.removeAllListenersByType.bind(eventRegister, 'wrong-custom-event')
    ).toThrow(
      new Error(
        `Custom event "wrong-custom-event" doesn\'t exist. You can\'t removeAllListenersByType it.\n\tAllowed custom events:\n\t\t1) some-custom-event\n`
      )
    )
  })
})
