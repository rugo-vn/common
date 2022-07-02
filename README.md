# Rugo Common

Shareable constants, functions, classes, etc between Rugo packages.

_Note: Cannot be used in Rugo Pipeline._

## Constants

- `DEFAULT_LIMIT`

## Functions

- `generateId`
- `wrapComposer`

```js
const composer = {
  argsParser => (...validateArgs) => (...targetArgs) => { return finalArgs; },
  returnParser => result => (...targetArgs) => { return finalResult; }
}
```

## Objects

### EmptyCollection

```js
const EmptyCollection = {
  id(){ },
  create(){ },
  get(){ },
  count(){ },
  list(){ },
  patch(){ },
  remove(){ }
}
```

### BaseCollection

```js
const BaseCollection = {
  id(){ },
  create(data){ },
  get(data, id){ },
  count(data, query),,
  list(data, query, controls){ },
  patch(data, query, controls){ }i,
  remove(data, query){ }
}
```

### BasePlugin

```js
const BasePlugin = {
  name: 'name-of-plugin',
  depends: ['register-1', 'register-2', 'register-3'],
  priority: 1,
  async start(context){ },
  async close(context){ }
}
```


### Composers

- `BaseComposer`
- `KoaComposer`

## API

[Visit API documentation.](./docs/API.md)

## License

MIT