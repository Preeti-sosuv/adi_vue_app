# nuxt-vue-pinia-app

## Project Overview
This project is a frontend application built using Vue 3, Nuxt 3, and Pinia. It provides functionality to manage a prompt list with the ability to bookmark items and display them in a popover.

## Features
- Bookmark items by clicking on the bookmark icon.
- Display bookmarked items in a popover.
- Reactive state management using Pinia.
- TypeScript support for type safety.

## Project Structure
```
nuxt-vue-pinia-app
├── src
│   ├── components
│   │   ├── BookmarkIcon.vue
│   │   └── Popover.vue
│   ├── pages
│   │   └── index.vue
│   ├── stores
│   │   └── promptList.ts
│   ├── composables
│   │   └── usePromptList.ts
│   └── types
│       └── index.ts
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd nuxt-vue-pinia-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## Usage
- Navigate to the main page to view the bookmark icon.
- Click the bookmark icon to add an item to the prompt list.
- The popover will display the current prompt list.

## API
The application interacts with the following API endpoint:
- `http://0.0.0.0:8040/proxy/add_to_prompt_list`: This endpoint is called when the bookmark icon is clicked to add an item to the prompt list.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.