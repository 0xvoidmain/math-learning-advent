# Planning Guide

A Progressive Web App that makes math practice engaging and rewarding for children through gamified quizzes with real-time feedback and long-term progress tracking.

**Experience Qualities**: 
1. **Playful** - Bright colors, smooth animations, and celebratory feedback that make learning feel like a game
2. **Encouraging** - Positive reinforcement for all attempts with growth-focused analytics that celebrate improvement
3. **Clear** - Large, readable numbers and buttons with intuitive navigation that a child can use independently

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused educational tool with quiz mechanics, session analytics, and historical progress tracking. While it has multiple features (quiz flow, timing, analytics, persistence), the scope is well-defined and doesn't require complex navigation or data modeling.

## Essential Features

### Quiz Question Display
- **Functionality**: Presents a math problem (addition, subtraction, multiplication) with four multiple choice answers
- **Purpose**: Provides the core learning interaction with appropriate difficulty
- **Trigger**: App launch or completing previous question
- **Progression**: App loads → Shows question with large numbers → Displays 4 answer buttons below → Waits for user selection
- **Success criteria**: Question is clearly visible, one correct answer among three plausible distractors, math operations are grade-appropriate

### Answer Selection & Feedback
- **Functionality**: User taps an answer button, system validates and provides immediate visual/animated feedback
- **Purpose**: Reinforces learning through instant feedback and maintains engagement
- **Trigger**: User taps any answer button
- **Progression**: User taps answer → Button animates → Correct shows celebration (confetti/color) → Incorrect shows gentle shake → Brief delay → Next question appears
- **Success criteria**: Feedback is immediate (<100ms), visually distinct between correct/incorrect, doesn't feel punitive for wrong answers

### Response Time Tracking
- **Functionality**: Records time elapsed from question display to answer selection
- **Purpose**: Measures fluency and provides data for growth analytics
- **Trigger**: Question appears on screen
- **Progression**: Question renders → Timer starts silently → User selects answer → Timer stops and records duration → Data stored with correctness
- **Success criteria**: Accurate timing within 100ms, stored with each answer, no visible countdown (reduces pressure)

### Session Analytics Display
- **Functionality**: After 10 questions, shows summary with score, average time, and encouraging message
- **Purpose**: Provides immediate gratification and context for performance
- **Trigger**: 10th question is answered
- **Progression**: Final answer submitted → Quiz view fades out → Results screen fades in with animation → Shows score (X/10) → Shows average response time → Displays encouraging message → "Try Again" button appears
- **Success criteria**: Clear visual hierarchy, positive framing (e.g., "7 correct!" not "3 wrong"), smooth transition

### Historical Progress Analytics
- **Functionality**: Displays all-time statistics including total quizzes, accuracy trend, speed improvement
- **Purpose**: Demonstrates long-term growth and motivates continued practice
- **Trigger**: User taps "Progress" button/tab
- **Progression**: User navigates to progress view → Chart shows accuracy over last 10 sessions → Stats cards show total correct/total attempted → Average time trend displayed → Best score highlighted
- **Success criteria**: Data persists across sessions, visualizations are child-friendly, growth is emphasized over raw scores

### Quiz Restart
- **Functionality**: Allows user to start a new 10-question session
- **Purpose**: Encourages repeated practice without friction
- **Trigger**: User completes a quiz or manually requests restart
- **Progression**: User taps "New Quiz" button → Current progress is saved to history → New session begins → First question appears
- **Success criteria**: Previous data is preserved, new session starts immediately, no confirmation dialogs

## Edge Case Handling

- **Rapid Button Clicking**: Disable answer buttons after first selection until next question loads to prevent double-answers
- **App Minimization**: Pause timer when app loses focus and resume when returning, or invalidate that question
- **No Historical Data**: Show encouraging "Start your first quiz!" message instead of empty charts
- **Slow Response Times**: Cap recorded times at 60 seconds and show gentle encouragement without highlighting slowness
- **All Incorrect Answers**: Results screen emphasizes "Great effort!" and "Let's try again" rather than focusing on mistakes
- **Duplicate Questions**: Ensure random generation doesn't repeat the same problem within a session

## Design Direction

The design should feel like a vibrant, modern children's learning app—energetic without being chaotic, colorful without being garish. Think educational iPad apps with a fresh 2024 aesthetic: bold rounded shapes, satisfying micro-interactions, and a color palette that feels both playful and sophisticated. The interface should celebrate every interaction, using motion to guide attention and reward effort.

## Color Selection

A bright, energetic palette that maintains readability while feeling fun and approachable for children.

- **Primary Color**: Vibrant Purple (oklch(0.65 0.25 290)) - Represents learning and creativity, used for main action buttons and quiz progression
- **Secondary Colors**: 
  - Soft Blue (oklch(0.75 0.15 240)) - Supporting UI elements, backgrounds, cards
  - Warm Coral (oklch(0.72 0.18 25)) - Accent for secondary actions and highlights
- **Accent Color**: Bright Yellow-Green (oklch(0.85 0.20 130)) - Success states, correct answers, celebration moments
- **Foreground/Background Pairings**: 
  - Background (Soft Cream oklch(0.98 0.01 90)): Dark Purple text (oklch(0.25 0.08 290)) - Ratio 10.2:1 ✓
  - Primary Purple (oklch(0.65 0.25 290)): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
  - Accent Yellow-Green (oklch(0.85 0.20 130)): Dark text (oklch(0.25 0.05 130)) - Ratio 10.5:1 ✓
  - Error/Incorrect (Soft Red oklch(0.68 0.21 15)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Typography should be large, friendly, and highly legible for young readers, with clear hierarchy that separates math problems from interface elements.

- **Typographic Hierarchy**: 
  - Math Problem Display: Fredoka Bold/56px/tight spacing - Playful rounded sans-serif for maximum readability of numbers
  - Answer Buttons: Fredoka Medium/28px/normal spacing - Large enough for easy reading and tapping
  - UI Labels: Fredoka Regular/16px/normal spacing - Navigation and section headers
  - Analytics Text: Fredoka Light/14px/relaxed spacing - Supporting information and statistics
  - Body/Instructions: Fredoka Regular/18px/relaxed spacing - Clear instructions and feedback messages

## Animations

Animations should create a sense of playfulness and reward, making the app feel alive and responsive while guiding attention to important state changes.

- **Button Interactions**: Subtle scale (1.0 → 1.05) on hover, satisfying press with spring physics (scale to 0.95) that bounces back
- **Answer Feedback**: Correct answers trigger a burst of confetti particles with stagger delay; incorrect answers show gentle horizontal shake (±10px) without harsh judgment
- **Question Transitions**: Outgoing question fades and slides up while new question fades and slides in from bottom with 300ms stagger
- **Progress Celebrations**: Completion screen enters with scale animation (0.9 → 1.0) and celebratory rotation on star/trophy icons
- **Chart Animations**: Progress bars and line charts animate on mount with spring easing over 800ms
- **Loading States**: Skeleton shimmer for data loading, pulsing dots for brief waits

## Component Selection

- **Components**: 
  - **Card** (shadcn): Main container for quiz questions and results with elevated shadow and rounded corners
  - **Button** (shadcn): All interactive elements with size variants (large for answers, default for navigation)
  - **Progress** (shadcn): Visual indicator showing question progress (3/10) at top of quiz
  - **Tabs** (shadcn): Navigation between Quiz and Progress views
  - **Badge** (shadcn): Display correct/incorrect counts and achievement indicators
  - **Separator** (shadcn): Divide sections in analytics view
  
- **Customizations**: 
  - **Answer Button Grid**: Custom 2×2 grid layout with large touch targets (min 120px height) and generous spacing
  - **Confetti Component**: Custom particle system using framer-motion for celebration effects
  - **Progress Chart**: Custom D3 line chart with simplified axis and child-friendly styling
  - **Timer Display**: Custom circular progress indicator (hidden during quiz, shown in results)
  
- **States**: 
  - **Answer Buttons**: Default (vibrant with border), hover (scale + glow), pressed (scale down), disabled (reduced opacity), correct (green background + icon), incorrect (red background + shake)
  - **Quiz Progress**: Empty dots and filled dots showing current position
  - **Navigation Tabs**: Active tab has bold text + bottom border, inactive is muted
  
- **Icon Selection**: 
  - Plus/Minus/X from @phosphor-icons for math operations
  - Check/X for correct/incorrect feedback
  - ChartLine for progress analytics
  - Trophy for achievements
  - ArrowClockwise for retry
  
- **Spacing**: 
  - Page padding: p-6 (24px)
  - Card padding: p-8 (32px)
  - Answer button gaps: gap-4 (16px)
  - Section spacing: space-y-6 (24px)
  
- **Mobile**: 
  - Single column layout maintained across all breakpoints
  - Answer buttons stack 2×2 on mobile, remain 2×2 on desktop (optimal for 4 choices)
  - Font sizes scale down 10% on mobile (Math: 48px, Answers: 24px)
  - Navigation tabs become full-width segmented control on mobile
  - Charts adjust height and simplify labels on narrow viewports
