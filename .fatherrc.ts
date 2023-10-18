import { defineConfig } from 'father';

const pkg = require('./package.json');

export default defineConfig({
  cjs: {
    output: 'out'
  },
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  }
});