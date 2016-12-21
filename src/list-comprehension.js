import {
  isArray,
  isDefined,
  isObject,
  objectsAreEqual,
  requireArgument,
  isFunction,
  requireCondition,
} from './utils'

export function contains(list, suspect) {
  requireArgument(list, 'contains(list, suspect): list is undefined')
  requireArgument(suspect, 'contains(list, suspect): suspect is undefined')

  return reduce(list, (accumulator, item) => {
    let containsItem = accumulator
    if (!containsItem) {
      if (isObject(suspect)) {
        containsItem = objectsAreEqual(suspect, item)
      } else {
        containsItem = item == suspect // eslint-disable-line eqeqeq
      }
    }

    return containsItem // eslint-disable-line newline-before-return
  }, false)
}

export function compact(list) {
  requireArgument(list, 'compact(list): list is undefined')

  return reduce(list, (accumulator, item) => {
    if (isDefined(item)) {
      accumulator.push(item)
    }

    return accumulator
  }, [])
}

export function filter(list, iterator) {
  requireArgument(list, 'filter(list, iterator): list is undefined')
  requireCondition(isArray(list), 'filter(list, iterator): list is not an Array')
  requireArgument(iterator, 'filter(list, iterator): iterator is undefined')
  requireCondition(typeof iterator === 'function', 'filter(list, iterator): iterator is not a function')

  return reduce(list, (accumulator, item) => {
    if (iterator(item)) accumulator.push(item)

    return accumulator
  }, [])
}

export function reduce(collection, iterator, accumulator) {
  requireArgument(collection, 'reduce(collection, iterator, accumulator): collection is undefined')
  requireArgument(iterator, 'reduce(collection, iterator, accumulator): iterator is undefined')
  requireCondition(typeof iterator === 'function', 'reduce(collection, iterator, accumulator): iterator is not a function')

  let returnValue = accumulator

  if (isArray(collection)) {
    let list = collection
    list.forEach(item => {
      returnValue = iterator(returnValue, item)
    })
  } else {
    const object = collection
    Object.keys(object).forEach(key => {
      const value = object[key]
      returnValue = iterator.call(object, value, key, object)
    })
  }

  return returnValue
}

export function reject(list, iterator) {
  requireArgument(list, 'reject(list, iterator): list is undefined')
  requireCondition(isArray(list), 'reject(list, iterator): list is not an Array')
  requireArgument(iterator, 'reject(list, iterator): iterator is undefined')
  requireCondition(typeof iterator === 'function', 'reject(list, iterator): iterator is not a function')

  return reduce(list, (accumulator, item) => {
    if (!iterator(item)) accumulator.push(item)

    return accumulator
  }, [])
}

export function tail(list) {
  requireArgument(list, 'tail(list): list is undefined')

  return list.slice(1)
}

export function some(list, iterator) {
  requireArgument(list, 'some(list, iterator): list is undefined')
  requireArgument(iterator, 'some(list, iterator): iterator is undefined')

  return list.reduce((memo, item) => {
    if (!memo) return iterator(item)
    return memo
  }, false)
}

export function none(list, iterator) {
  requireArgument(list, 'none(list, iterator): list is undefined')
  requireArgument(iterator, 'none(list, iterator): iterator is undefined')

  return list.reduce((memo, item) => {
    if (memo) return !iterator(item)
    return memo
  }, true)
}

export function any(list) {
  return some.apply(list, arguments)
}

export function first(list) {
  requireArgument(list, 'first(list): list is undefined')

  let nothing
  return list.length ? list[0] : nothing
}

export function last(list) {
  requireArgument(list, 'last(list): list is undefined')

  let nothing
  return list.length ? list.reverse()[0] : nothing
}

export function each(collection, iterator) {
  requireArgument(collection, 'each(collection, iterator): collection is undefined')
  requireArgument(iterator, 'each(collection, iterator): iterator is undefined')

  if (isArray(collection)) {
    const list = collection
    list.forEach(iterator)
  } else {
    const object = collection
    Object.keys(object).forEach(key => {
      const value = object[key]
      iterator.call(object, value, key, object)
    })
  }
}

export function includes(list, value) {
  requireArgument(list, 'includes(list, value): list is undefined')

  return some(list, item => item === value)
}

export function flatten(list) {
  requireArgument(list, 'flatten(list): list is undefined')

  return list.reduce((memo, item) => {
    isArray(item) ? memo.push(...flatten(item)) : memo.push(item)
    return memo
  }, [])
}

export function mapObject(object, iterator) {
  requireArgument(object, 'mapObject(object, iterator): object is undefined')
  requireArgument(iterator, 'mapObject(object, iterator): iterator is undefined')

  return Object.keys(object).map(key => iterator(object[key], key))
}

export function functions(collection) {
  requireArgument(collection, 'functions(collection): collection is undefined')

  if (isArray(collection)) {
    const list = collection
    return filter(list, item => isFunction(item))
  }

  const object = collection

  return Object.keys(object).reduce((memo, key) => {
    if (typeof object[key] === 'function') memo.push(key)
    return memo
  }, [])
}