/**
 * Setup for northstar/v0 packages (under packages/fluentui).
 * This is the bootstrap code that is run before any tests, utils, mocks.
 */

const { TextEncoder, TextDecoder } = require('node:util');

Object.assign(global, { TextDecoder, TextEncoder });

const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const enzyme = require('enzyme');

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
});
