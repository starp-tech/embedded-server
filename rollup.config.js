import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json"
import nativePlugin from 'rollup-plugin-natives';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(), 
    commonjs(), 
    json(),
    nativePlugin({
        // Where we want to physically put the extracted .node files
        copyTo: 'output/libs',

        // Path to the same folder, relative to the output bundle js
        destDir: './libs',
        preferBuiltins: true,
        // Use `dlopen` instead of `require`/`import`.
        // This must be set to true if using a different file extension that '.node'
        dlopen: true,

        // Modify the final filename for specific modules
        // A function that receives a full path to the original file, and returns a desired filename
        // map: (modulePath) => 'filename.node',

        // Or a function that returns a desired file name and a specific destination to copy to
        // map: (modulePath) => { name: 'filename.node', copyTo: 'C:\\Dist\\libs\\filename.node' },

        // Generate sourcemap
        sourcemap: true,
        
        // If the target is ESM, so we can't use `require` (and .node is not supported in `import` anyway), we will need to use `createRequire` instead.
        targetEsm: false,
    })
  ]
};