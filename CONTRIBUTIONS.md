# Contributing to Canfield Solitaire

Thank you for your interest in contributing to Canfield Solitaire! We welcome contributions from the community and appreciate your help in making this game better.

## Community Standards

We are committed to providing a welcoming and inspiring community for all. We expect all contributors to:
- Be respectful and inclusive of others.
- Use welcoming and inclusive language.
- Be collaborative and open to feedback.
- Gracefully accept constructive criticism.

## How to Contribute

### Reporting Bugs
If you find a bug, please open an issue and include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Any relevant screenshots or error logs.

### Suggesting Features
We love new ideas! To suggest a feature:
- Open an issue with the "feature request" label.
- Describe the feature and why it would be useful.
- Provide examples of how it might work or look.

### Submitting Changes
1. Fork the repository and create your branch from `main`.
2. Install dependencies: `npm install`.
3. Make your changes, ensuring you follow the [Coding Standards](#coding-standards).
4. Run tests to ensure everything is working: `npm test`.
5. Ensure code coverage remains high: `npm run test:coverage`.
6. Submit a Pull Request with a clear description of the changes.

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) and `semantic-release` for automated versioning and changelog generation. **All commit messages must follow this format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Common Types:
- `feat`: A new feature (triggers a MINOR release).
- `fix`: A bug fix (triggers a PATCH release).
- `docs`: Documentation changes only.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries.

### Example:
`feat(engine): add auto-redeal logic to the stock pile`

## Coding Standards

- **TypeScript**: Use TypeScript for all logic. Ensure types are strictly defined.
- **Vue.js**: Follow the [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) patterns.
- **Linting & Formatting**: Run `npm run lint` and `npm run format` before committing. We use ESLint and Prettier to maintain a consistent style.
- **Testing**: We strive for >80% code coverage. Every new feature or fix should include corresponding unit tests in Vitest. E2E tests in Playwright are encouraged for UI-heavy changes.

## License
By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) (if applicable).
