# Quiz Master Visualizer - Design Document

## 1. Project Overview

**Project Name**: Quiz Master Visualizer  
**Type**: Standalone HTML/CSS/JS application  
**Core Functionality**: A fullscreen quiz display tool for quiz masters to present questions and answers on a public screen, with three distinct views (main menu, question, answer).  
**Target Users**: Quiz masters running public quiz events

---

## 2. Technical Constraints

| Constraint | Implementation |
|------------|----------------|
| No frameworks | Vanilla HTML/CSS/JS only |
| No remote libraries | All assets bundled locally |
| Portable | Single directory, no server required |
| Offline capable | Zero network dependencies |
| Fullscreen | Uses 100vw × 100vh, CSS viewport units |

---

## 3. Data Format

**File**: `quiz-data.json`

```json
{
  "categories": [
    {
      "name": "Category Name",
      "questions": [
        {
          "id": "q1",
          "difficulty": 1,
          "question": {
            "text": "Question text here?",
            "image": "optional-question-image.jpg"
          },
          "answer": {
            "text": "Answer text here",
            "image": "optional-answer-image.jpg"
          }
        }
      ]
    }
  ]
}
```

**Difficulty Levels**: Integer 1–5 (displayed as visual indicators, e.g., dots, stars, or bars)

---

## 4. Views & Navigation

```
┌─────────────────┐     click      ┌─────────────────┐     click      ┌─────────────────┐
│   MAIN VIEW     │ ────────────▶  │ QUESTION VIEW   │ ────────────▶  │  ANSWER VIEW    │
│                 │                │                 │                │                 │
│ [Category 1]     │                │  Question text  │                │   Answer text   │
│  ● ○ ○ ○ ○ (Q1) │                │  in HUGE font   │                │  in HUGE font   │
│  ●● ○ ○ ○ (Q2)  │                │                 │                │                 │
│                 │                │  [image if any] │                │  [image if any] │
│ [Category 2]     │                │                 │                │                 │
│  ●○○○○ (Q3)     │                │                 │                │                 │
└─────────────────┘  ◀──────────── └─────────────────┘  ◀──────────── └─────────────────┘
         ↑                                                           │
         └──────────────────── any click ────────────────────────────┘
```

**Navigation Flow**:
- Main → Question: Click on question panel
- Question → Answer: Click anywhere
- Answer → Main: Click anywhere

---

## 5. View Specifications

### 5.1 Main View
- **Layout**: CSS Grid with categories as sections
- **Category Header**: Large, bold text, distinct styling
- **Question Panels**: 
  - Display difficulty indicator only (e.g., `●●●○○`)
  - No question text visible
  - Fixed card size for visual consistency
- **Completed Questions**: 
  - Grey background
  - `pointer-events: none` (unclickable)
  - Visual distinction (opacity, strikethrough, or muted colors)
- **Theme Toggle**: Small button to switch modes

### 5.2 Question View
- **Question Text**: 10–15vw font size, centered
- **Image**: Centered below text, max 60vh height, auto width
- **Background**: Solid color or subtle gradient
- **Behavior**: Any click advances to answer

### 5.3 Answer View
- **Answer Text**: 10–15vw font size, centered
- **Image**: Centered below text, max 60vh height
- **Behavior**: Any click returns to main view
- **Post-return**: Question marked as completed

---

## 6. Theme System

| Theme | Background | Text | Accent | Use Case |
|-------|------------|------|--------|----------|
| Light | `#f5f5f5` | `#222` | `#3b82f6` | Indoor/daylight |
| Dark | `#1a1a1a` | `#f0f0f0` | `#60a5fa` | Projection/dim rooms |
| High Contrast | `#000` | `#fff` | `#ff0` | Accessibility/major venues |

- Toggle button in corner (keyboard shortcut: `T`)
- Theme persisted in localStorage
- System preference detection on first load

---

## 7. File Structure

```
quiz-visualizer/
├── index.html          # Single page app
├── styles.css          # All styling + themes
├── script.js           # Minimal vanilla JS
├── quiz-data.json      # Quiz content (user-provided)
└── README.md           # Setup instructions (optional)
```

---

## 8. Browser Compatibility

- Target: Modern browsers (Chrome, Firefox, Safari, Edge)
- No polyfills required
- CSS features: Grid, Flexbox, CSS Variables, Viewport units

---

## 9. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Toggle theme |
| `Esc` | Return to main view |
| `Space` | Advance (question → answer) |
| `F` | Toggle fullscreen (F11 alternative) |

---

## 10. Responsive Behavior

- All views use `100vw` × `100vh`
- Font sizes in `vw`/`vh` units for scaling
- Images constrained by container, never overflow
- Tested targets: 1920×1080, 1366×768, 4K displays

---

## 11. Implementation Tasks

### Phase 1: Project Setup
1. ✅ Create directory structure (`index.html`, `styles.css`, `script.js`)
2. ✅ Create `quiz-data.json` with sample data (3 categories, 3 questions each)

### Phase 2: Core HTML
3. ✅ Build main view with category grid layout
4. ✅ Build question view container
5. ✅ Build answer view container
6. ✅ Add theme toggle button

### Phase 3: Styling
7. ✅ Implement CSS variables for themes (light/dark/high-contrast)
8. ✅ Build main view styles (category headers, difficulty indicators)
9. ✅ Build question/answer view styles (large typography, centered layout)
10. ✅ Add completed-question greyed-out state

### Phase 4: JavaScript Logic
11. ✅ Load and parse JSON data
12. ✅ Render main view from JSON
13. ✅ Implement view navigation (main → question → answer → main)
14. ✅ Track completed questions in state
15. ✅ Persist completed state in localStorage

### Phase 5: Polish
16. ✅ Add keyboard shortcuts (T for theme, Esc to return, Space to advance)
17. ✅ Add fullscreen toggle
18. ✅ Detect system theme preference on first load

### Phase 6: Testing
19. ⏳ Test all three views with sample data
20. ⏳ Test theme switching
21. ⏳ Test completed question persistence
22. ⏳ Verify offline/file:// operation

---

## 12. Acceptance Criteria

- [ ] Single HTML file loads without server
- [ ] JSON data loads and displays correctly
- [ ] Three views cycle correctly
- [ ] Completed questions are greyed and unclickable
- [ ] All three themes work and switch instantly
- [ ] Zero console errors
- [ ] Works offline (file:// protocol)
- [ ] Fullscreen on any resolution
