# Install Dependencies

Run this command in your project directory to install all required dependencies:

```bash
npm install
```

This will install:
- React and React DOM
- Firebase
- Tailwind CSS
- PostCSS and Autoprefixer
- TypeScript
- Vite

After installation, you can run:

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Troubleshooting

If you get any errors during installation:

1. **Clear npm cache**: `npm cache clean --force`
2. **Delete node_modules**: `rm -rf node_modules` (or `rmdir /s node_modules` on Windows)
3. **Delete package-lock.json**: `rm package-lock.json` (or `del package-lock.json` on Windows)
4. **Reinstall**: `npm install`

## Alternative: Use Yarn

If npm doesn't work, you can use Yarn:

```bash
# Install Yarn (if not installed)
npm install -g yarn

# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```
