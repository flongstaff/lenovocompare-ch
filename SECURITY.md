# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.2.x   | Yes       |
| < 0.2   | No        |

## Reporting a Vulnerability

If you discover a security issue, please report it responsibly:

1. **Do not** open a public GitHub issue.
2. Contact the maintainer privately via GitHub ([@flongstaff](https://github.com/flongstaff)).
3. Include a description of the issue, steps to reproduce, and any potential impact.

You can expect an initial response within **72 hours**. We will work with you to understand and address the issue before any public disclosure.

## Scope

This is a static, client-side application with no server, no database, no authentication, and no user accounts. All data is stored in the browser's localStorage. The primary security considerations are:

- **No sensitive data**: The app stores only laptop comparison preferences and user-contributed prices locally.
- **No external API calls**: All data is hardcoded at build time.
- **Dependencies**: We use Dependabot for automated dependency updates and CodeQL for static analysis.
- **Content Security**: All external links open in new tabs with `rel="noopener noreferrer"`.

## Acknowledgments

We appreciate responsible disclosure and will credit reporters (with permission) in release notes.
