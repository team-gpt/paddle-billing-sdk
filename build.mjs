import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist/bun',
  minify: true,
  plugins: [dts()],
})
