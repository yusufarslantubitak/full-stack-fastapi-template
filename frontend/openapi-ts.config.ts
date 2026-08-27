import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.json',
  output: './src/client',

  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
    {
      name: '@hey-api/sdk',
      responseStyle: 'data',
    },
    {
      name: '@hey-api/schemas',
      type: 'json',
    },
  ],
})
