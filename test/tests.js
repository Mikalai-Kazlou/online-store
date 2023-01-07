const assert = require('assert');
const helpers = require('../out-tsc/modules/helpers');

describe('helpers', () => {
  it('formatAmount should transform number to currency format: 12345 => $12,345.00', () => {
    assert.equal(helpers.formatAmount(0), '$0.00');
    assert.equal(helpers.formatAmount(12345), '$12,345.00');
    assert.equal(helpers.formatAmount(100.12345), '$100.12');
    assert.equal(helpers.formatAmount(100.12999), '$100.13');
  });
});  