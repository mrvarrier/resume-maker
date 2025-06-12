# Contributing to ATS Resume Builder

Thank you for your interest in contributing to the ATS Resume Builder! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Use issue templates** when creating new issues
3. **Provide detailed information**:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. **Check the roadmap** in README.md
2. **Open a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach
   - Mockups or examples if relevant

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Git

### Local Development

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ats-resume-builder.git
   cd ats-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Testing Your Changes

1. **Type checking**
   ```bash
   npm run type-check
   ```

2. **Linting**
   ```bash
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

3. **Build test**
   ```bash
   npm run build
   ```

4. **Manual testing**
   - Test in both preview and PDF export
   - Verify ATS compatibility
   - Check responsiveness
   - Test auto-save functionality

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Follow existing naming conventions
- Add proper TypeScript types for props
- Use meaningful component and prop names

### CSS/Styling

- Use Tailwind CSS utility classes when possible
- Add custom CSS in `globals.css` for complex styles
- Maintain consistency with existing design
- Ensure responsive design

### File Organization

```
src/
├── app/              # Next.js pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── editor/      # Editor-specific components
│   ├── pdf/         # PDF-specific components
│   └── resume/      # Resume display components
├── lib/             # Utility functions
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

## 🎯 ATS Compatibility Guidelines

When making changes to resume formatting:

### HTML Structure
- Use semantic HTML elements
- Maintain proper heading hierarchy (H1 → H2 → H3)
- Use standard list elements for bullet points
- Keep linear content flow

### CSS Considerations
- Avoid complex positioning that breaks text parsing
- Use standard fonts (Times New Roman, Arial, Helvetica)
- Maintain readable font sizes
- Avoid excessive styling that confuses ATS systems

### Content Organization
- Keep clear section separation
- Use standard section headers
- Maintain consistent formatting
- Ensure contact information is clearly labeled

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure code quality**
   - All tests pass
   - No TypeScript errors
   - No linting errors
   - Code follows style guidelines

2. **Test thoroughly**
   - Test in multiple browsers
   - Verify PDF export works correctly
   - Check both web preview and PDF consistency
   - Test auto-save functionality

3. **Update documentation**
   - Update README.md if needed
   - Add comments for complex logic
   - Update type definitions if needed

### Pull Request Guidelines

1. **Use descriptive titles**
   - Good: "Add support for multiple resume templates"
   - Bad: "Update components"

2. **Provide detailed description**
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots if UI changes

3. **Keep PRs focused**
   - One feature or fix per PR
   - Avoid mixing unrelated changes
   - Keep changes as small as possible

4. **Link related issues**
   - Reference issues: "Fixes #123"
   - Link to feature requests

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** required before merge

## 🐛 Bug Reports

### Required Information

- **Environment**: Browser, OS, device
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console errors**: Browser console output

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Environment
- Browser: Chrome 119
- OS: macOS 14.0
- Device: MacBook Pro

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## Additional Context
Any other context about the problem
```

## 🚀 Feature Requests

### Guidelines

1. **Check existing features** and roadmap
2. **Provide clear use case**
3. **Consider ATS impact** for resume-related features
4. **Include mockups** if UI changes
5. **Suggest implementation** approach

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you considered

## Additional Context
Screenshots, mockups, examples
```

## 📚 Resources

### Technical Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React PDF Documentation](https://react-pdf.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### ATS Guidelines

- Focus on semantic HTML
- Maintain clean text extraction
- Use standard formatting
- Test with ATS scanners when possible

## 🎉 Recognition

Contributors will be:

- Added to the contributors list
- Mentioned in release notes for significant contributions
- Invited to join the maintainers team for exceptional contributions

## 📞 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Code Review**: For feedback on contributions

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). By participating, you are expected to uphold this code.

---

Thank you for contributing to ATS Resume Builder! 🎉