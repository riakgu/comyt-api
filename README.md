# Comyt API


## Overview
Comyt API is an AI-powered Git commit message generator that analyzes git diffs and produces clean, conventional commit messages.
It supports single and split commit strategies, multiple languages, and optional git command generation.

### Built With
[![Node.js][Node.js]][Node-url] [![Express][Express.js]][Express-url] [![TypeScript][TypeScript]][TypeScript-url]


## Features

- **AI-Powered** - Uses LLM to generate professional commit messages
- **Conventional Commits** - Follows conventional commit format
- **Single/Split Mode** - Generate one commit or split into multiple logical commits
- **Multi-language** - Support for English and Indonesian
- **Git Commands** - Optional git command generation


## Getting Started

### Prerequisites
* Node.js >= v24.11.1

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/riakgu/comyt-api.git
   cd comyt-api
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Set up environment variables
   ```sh
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # App
   PORT=3000
   NODE_ENV=development

   # LLM
   LLM_BASE_URL=https://api.deepinfra.com/v1/openai
   LLM_API_KEY=your-api-key
   LLM_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo
   ```

4. Start the application
   ```sh
   # Development
   npm run dev
   ```
   ```sh
   # Production
   npm run build
   npm start
   ```


## API Reference

### Generate Commit

```
POST /api/commits/generate
```

**Request Body:**
```json
{
  "diff": "git diff content...",
  "options": {
    "format": "conventional",
    "language": "en",
    "commit_strategy": "single",
    "generate_git_command": true
  }
}
```

**Response:**
```json
{
  "data": {
    "mode": "single",
    "commit": {
      "message": "feat(auth): add token validation",
      "type": "feat",
      "scope": "auth",
      "confidence": 0.93
    },
    "git_commands": [
      "git add .",
      "git commit -m \"feat(auth): add token validation\""
    ]
  }
}
```


## Running Tests

```sh
npm test
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
