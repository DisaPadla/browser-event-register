# browser-event-register
[![codecov](https://codecov.io/gh/DisaPadla/browser-event-register/branch/master/graph/badge.svg)](https://codecov.io/gh/DisaPadla/browser-event-register)
[![Build Status](https://travis-ci.com/DisaPadla/browser-event-register.svg?branch=master)](https://travis-ci.com/DisaPadla/browser-event-register)  

If you are not familiar with Custom Event click [here](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event) and [here](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)  

## Usage
Basic case:
```js
window.eventRegister = new EventRegister();
/* index.js in EntryPoint repo */
function updateCount() {
  // --------- some code ---------
}

window.eventRegister.add({
  type: 'update-count',
  listener: updateCount,
});

/* some-another-file.js in sub-applicaction */

window.eventRegister.dispatch('update-count');
```
Pass own params on ```dispatch```:
```js
window.eventRegister = new EventRegister();

function setData(e) {
  console.log(e.detail) // <-- your data is here
}

window.eventRegister.add({
  type: 'set-own-data',
  listener: setData,
});

window.eventRegister.dispatch({
  type: 'set-own-data',
  options: {
    detail: { customData: 'customData' } // <-- it's necessary to pass "options.detail" property
  }
});
```
Pass optional Event fields (like "bubbles", "cancelable", "composed"):
```js
window.eventRegister = new EventRegister();

function setData(e) {
  // --------- some code ---------
}

window.eventRegister.add({
  type: 'set-own-data',
  listener: setData,
});

window.eventRegister.dispatch({
  type: 'set-own-data',
  options: {
    bubbles: true,
    cancelable: true,
    composed: false,
  }
});
```  
Full Example:
```js
window.eventRegister = new EventRegister();

/* App.container.js in Entry Point  */
class App extends Component {
  state = { title: '' }

  componentDidMount() {
    window.eventRegister.add({
      type: 'ep-set-title',
      listener: this.setTitle,
    });
  }

  componentWillUnmount() {
    window.eventRegister.remove({
      type: 'ep-set-title',
      listener: this.setTitle,
    });
  }

  setTitle = e => this.setState({ title: e.detail })

  render() {
    return (
      <Template>
        <Title title={ this.state.title } />
        <Content />
      </Template>
    )
  }
}
```

```js
/* CRM.container.js in CRM app  */

class CRM extends Component {
  componentDidMount() {
    window.eventRegister.dispatch({
      type: 'ep-set-title',
      options: {
        detail: 'CRM title',
      }
    });
  }

  render() {
    return (
      /* ------ some code ------ */
    )
  }
}
```

## eventRegister API
### ```eventRegister.add({ type, listener, node?, options? })```
Add new listener for custom event
 * ```type: string``` Required
 * ```listener```: function Required
 * ```node```: Node Optional (```document``` by default)
 * ```options```: object Optional  

### ``` eventRegister.dispatch(type | { type, options? })```  
Dispatching an existing event type
  * ```type```: string Required
  * ```options```: object Optional  

### ```eventRegister.remove({ type, listener, options? })```
Removing an existing event type
  * ```type```: string Required
  * ```listener```: function Required
  * ```node```: Node Optional (```document``` by default)
  * ```options```: object Optional  

### ```eventRegister.removeAllListenersByType(type)```
Removing all existing event types
  * ```type```: string Required


