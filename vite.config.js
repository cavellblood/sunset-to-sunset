import legacy from '@vitejs/plugin-legacy'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';

// https://vitejs.dev/config/
export default ({ command }) => ({
  root: path.resolve(__dirname, "src"),
	build: {
		emptyOutDir: true,
		manifest: true,
		outDir: "../dist/",
		rollupOptions: {
			input: {
				"sunset-to-sunset": "./src/js/main.js",
        index: "./src/public/index.html"
			},
			output: {
				sourcemap: true,
			},
		},
	},
	publicDir: './src/public',
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    nodeResolve({
      moduleDirectories: [
        path.resolve('./node_modules'),
      ],
    }),
  ],
})