const { test } = require('node:test')
const assert = require('node:assert')
const listhelper = require('../utils/list_helper')

test('dummy return one', () => {
  const blogs =[]
  const result = listhelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
