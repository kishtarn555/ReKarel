import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
export default {
    input: 'dist/webapp/ts/index.js',
    external: ['bootstrap'],
    output: {
      file: 'webapp/js/cindex.js',
      format: 'iife',
      globals: {
        "bootstrap":"bootstrap"
      },
      name:"karel"
    },
    
    plugins: [
        commonjs(),
        nodeResolve()
    ]
  };