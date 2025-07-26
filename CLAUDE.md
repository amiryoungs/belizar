# `CLAUDE.md`

## The Golden Rule  
When unsure about implementation details, ALWAYS ask the developer.  

## Project Context  
This project is a simple AI-powered fortune app that gives users one fortune each day when they press a button. The fortune is generated to feel personal and meaningful, creating a small daily ritual.

### Anchor comments  

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.  

### Guidelines:  

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps prefix) for comments aimed at AI and developers.  
-**Important:** Before scanning files, always first try to **grep for existing anchors** `AIDEV-*` in relevant subdirectories.  
-**Update relevant anchors** when modifying associated code.  
-**Do not remove `AIDEV-NOTE`s** without explicit human instruction.  
- Make sure to add relevant anchor comments, whenever a file or piece of code is:  
  * too complex, or  
  * very important, or  
  * confusing, or  
  * could have a bug  

## Domain Glossary (Claude, learn these!)  

-**Agent**: AI entity with memory, tools, and defined behavior  
-**Task**: Workflow definition composed of steps (NOT a Celery task)  
-**Execution**: Running instance of a task  
-**Tool**: Function an agent can call (browser, API, etc.)  
-**Session**: Conversation context with memory  
-**Entry**: Single interaction within a session  

## What AI Must NEVER Do  

1.**Never commit secrets**- Use environment variables  
2.**Never assume business logic**- Always ask  
3.**Never remove AIDEV- comments**- They're there for a reason  

Remember: We optimize for maintainability over cleverness.  
When in doubt, choose the boring solution.

## MVP Implementation Tasks

### High Priority
- [x] Setup project dependencies and configurations
- [x] Create secure backend API endpoint for OpenAI integration

### Medium Priority  
- [x] Implement main app UI with image and button
- [x] Add fortune generation and display logic
- [x] Implement daily fortune tracking with local storage
- [x] Add fade animations for UI transitions

### Low Priority
- [x] Configure Vercel deployment for web
- [ ] Setup app store build configuration

## MVP Implementation Plan Details

### Phase 1: Project Setup & Dependencies
- Install required packages: `@react-native-async-storage/async-storage`, `react-native-reanimated`, `expo-image`
- Update app.json with proper app name, icons, and store configuration
- Setup TypeScript types for fortune data and app state

### Phase 2: Secure Backend API
- Create Vercel serverless function in `/api/generate-fortune.ts`
- Implement proper API key protection with rate limiting and request validation
- Add OpenAI integration with secure prompt engineering for personalized fortunes
- Setup environment variables for production deployment

### Phase 3: Core App Implementation
- Build main UI component with placeholder image and action button
- Implement fortune display component with proper typography
- Add fade animations using React Native Reanimated
- Create daily fortune logic with AsyncStorage for persistence

### Phase 4: State Management
- Implement fortune generation flow with loading states
- Add daily reset logic (check if new day since last fortune)
- Handle error states and network failures gracefully

### Phase 5: Deployment Configuration
- Configure Vercel deployment with proper environment variables
- Setup EAS Build for iOS/Android app store builds
- Add proper app metadata and store assets preparation

**Key Security Features:**
- Server-side API key protection
- Request validation and rate limiting
- No client-side OpenAI exposure
- Secure environment variable handling
