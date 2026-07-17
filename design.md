Immersive is an interactive, exhibit-style design system skill file that instructs AI coding assistants to generate interfaces that feel like digital installations rather than conventional web pages. Its aesthetic blends storytelling, motion, playful interaction, gamified progression, oversized condensed typography, crisp white cards, thick black outlines, and hard offset shadows on a single continuous deep green canvas.

Unlike section-based landing page systems that alternate between multiple background colors, Immersive keeps the entire app grounded on one uninterrupted brand-colored stage: deep green. Content appears as exhibit artifacts placed on top of that canvas — white cards, skewed buttons, poster-like panels, decorative geometric blocks, progress markers, interactive checkpoints, and animated story moments.

When you feed this skill file to an AI assistant, every generated component — buttons, cards, navigation, modals, forms, timelines, onboarding flows, quizzes, product tours, dashboards, and storytelling pages — should carry the same immersive visual logic: bold white foreground objects, thick black borders, hard block shadows, condensed Oswald typography, cobalt and hot-pink geometric accents, and interaction states that feel responsive and game-like.

The result is a UI system that feels playful, theatrical, high-contrast, and experience-driven. It should feel less like browsing a website and more like moving through a digital exhibit.

Design Tokens
Color Palette
Immersive uses a bold, high-contrast palette built around a deep green canvas, white foreground cards, black structural marks, cobalt blue decorative blocks, and hot pink accent geometry.

Token	Value	Purpose
Primary	#00592B	Continuous deep green app canvas, brand background, full-page stage
Secondary	#0023D1	Cobalt blue decorative blocks, graphic accents, secondary interactive highlights
Success	#16A34A	Positive feedback, completion states, successful checkpoints
Warning	#D97706	Caution states, attention prompts, incomplete steps
Danger	#DC2626	Errors, destructive actions, failed validation, blocked progress
Surface	#FFFFFF	Foreground cards, panels, buttons, modals, exhibit objects
Text	#111827	Default readable text on white foreground surfaces
The most important color rule is that primary is the canvas. The deep green #00592B should be used as the continuous page or app background. Do not alternate major sections between white, gray, cream, or other neutral backgrounds. Immersive depends on the feeling of one uninterrupted environment.

White surfaces sit on top of this canvas as objects. They should feel physical, crisp, and poster-like because of thick black borders and hard offset shadows.

Additional Structural Color Roles
The base token set does not explicitly include black or hot pink, but the brand requires both. Implementations should add semantic tokens rather than scattering raw values throughout the codebase.

Semantic Token	Recommended Value	Purpose
border-strong	#000000	Thick card borders, button outlines, poster frames, focus outlines
shadow-hard	#000000	Offset block shadows with no blur
brand-tertiary	#0023D1	Cobalt decorative blocks and secondary exhibit accents
brand-quaternary	#FF2E9F	Hot pink decorative blocks, playful highlights, rare gamified emphasis
canvas	#00592B	Continuous app background
object-surface	#FFFFFF	Cards, buttons, modals, panels, and foreground objects
These roles must remain semantic. For example, shadow-hard should be used for hard shadows instead of repeatedly writing box-shadow: 6px 6px 0 #000.

Color Usage Principles
Immersive color usage follows five rules:

Deep green is the environment — the whole app sits on the primary canvas.
White is the foreground object — cards, buttons, forms, and modals use surface.
Black defines structure — borders and shadows create the physical poster-object effect.
Cobalt and hot pink add depth — decorative blocks sit behind cards, never replacing the green canvas.
Semantic colors stay semantic — success, warning, and danger should only communicate state.
Do not turn the experience into a rainbow interface. The palette is bold, but disciplined.

Typography
Immersive uses Oswald for both primary and display typography. This gives the system its oversized, condensed, poster-like voice. The typography should feel like exhibit signage, arcade placards, wayfinding labels, and graphic campaign headlines.

Font Families
Role	Font	Usage
Primary	Oswald, sans-serif	Body copy, labels, navigation, buttons, captions, UI text
Display	Oswald, sans-serif	Hero titles, exhibit headings, challenge titles, large numbers
Mono	JetBrains Mono	Code, technical metadata, system values, IDs, keyboard shortcuts
Oswald should be used confidently. Its condensed proportions make headings feel tall, punchy, and graphic. This supports the exhibit-poster feeling without requiring excessive decorative imagery.

JetBrains Mono should only be used for technical content, developer-facing UI, data values, and machine-readable strings. Do not use monospace as a general decorative style.

Type Scale
Immersive uses a compact, implementation-friendly type scale:

Size	Usage
12px	Captions, metadata, small labels, badges, progress annotations
14px	Secondary UI text, navigation items, compact descriptions
16px	Default body text, form inputs, standard buttons
20px	Card headings, step titles, compact exhibit labels
24px	Section headings, feature callouts, modal titles
32px	Hero headings, exhibit titles, major milestones, gamified score moments
Because Oswald is condensed, headings can become visually intense quickly. Use 32px for major moments and use spacing to keep the layout readable. Do not make every card title oversized.

Weight
The available weight range is 100 through 900, but Immersive should rely on a smaller practical set:

400 for body copy and standard interface text
500 for labels, buttons, tabs, and navigation
600 for card headings and step titles
700 for exhibit headings, milestones, and hero statements
800–900 only for rare oversized poster moments
Avoid mixing many weights inside one component. Immersive should feel energetic because of composition, borders, shadows, and interaction — not because every text element is fighting for attention.

Text Transform and Letter Spacing
Immersive may use uppercase typography for short labels, buttons, navigation, badges, and exhibit markers.

Recommended rules:

Use uppercase for short UI labels only.
Avoid uppercase for long paragraphs.
Add slight letter spacing for small uppercase labels.
Keep body copy sentence case for readability.
Ensure condensed text does not become too tight at small sizes.
Example:

.exhibit-label {
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
Spacing
Immersive uses a 4px-based spacing scale:

Token	Value	Usage
space-1	4px	Small icon gaps, decorative offsets, tight inline spacing
space-2	8px	Badge padding, compact stacks, small label gaps
space-3	12px	Button padding, form micro-layout, compact card internals
space-4	16px	Default component padding, card content spacing
space-6	24px	Card groups, exhibit clusters, step spacing
space-8	32px	Major sections, scene breaks, page-level layout rhythm
Spacing must preserve the feeling of a physical exhibit. Cards and panels need room for their thick borders, hard shadows, and decorative blocks. If spacing is too tight, the interface becomes visually noisy and the layered-object effect collapses.

Use larger gaps around:

Skewed buttons
Offset shadows
Decorative blocks behind cards
Animated checkpoints
Large display headings
Interactive story panels
Remember that a hard shadow visually increases the footprint of a component. A card with an 8px offset shadow needs additional spacing so the shadow does not collide with nearby content.

The Immersive Look
Immersive has a highly specific visual identity. It should feel like an interactive exhibit, not a neutral dashboard.

One Continuous Deep Green Canvas
The entire app must sit on the deep green primary background. This is the most important brand constraint.

Do:

Use #00592B as the page background.
Let all major sections live on the same canvas.
Use cards, panels, and objects to create contrast.
Use spacing, scroll rhythm, animation, and object placement to separate scenes.
Do not:

Alternate major page sections between white and green.
Use gray app shells.
Create isolated white full-width sections.
Break the canvas with unrelated background colors.
Treat deep green as only a header or footer color.
The user should feel like they are traveling through one continuous environment.

White Exhibit Objects
Content should appear on crisp white foreground objects. These objects behave like posters, signs, placards, tickets, cards, panels, or exhibit labels.

White objects should usually include:

surface fill
Thick black border
Hard black offset shadow
Clear typographic hierarchy
Slightly playful geometry or placement
Optional cobalt or hot-pink block behind them
The white object is where most readable content lives. This keeps text accessible while allowing the app to remain visually immersive.

Thick Black Borders
Borders are structural. They define the physicality of cards, buttons, modals, and panels.

Recommended border rules:

Use 2px minimum for small controls.
Use 3px for standard cards and buttons.
Use 4px for major exhibit panels or hero cards.
Use solid black or border-strong.
Avoid low-contrast gray borders.
Avoid thin 1px borders on primary objects.
Borders should feel intentional and graphic, like printed signage.

Hard Offset Block Shadows
Immersive uses hard shadows, not soft elevation. Shadows should have no blur and should be offset like a block print.

Recommended shadows:

--shadow-sm: 3px 3px 0 var(--shadow-hard);
--shadow-md: 6px 6px 0 var(--shadow-hard);
--shadow-lg: 10px 10px 0 var(--shadow-hard);
Use shadows to create depth and physicality. Do not use blurred shadows, ambient elevation, translucent glows, or glassmorphism.

Decorative Geometric Blocks
Cobalt blue and hot pink blocks should sit behind foreground objects to add depth. They should feel like layered cut-paper shapes, not separate background sections.

Use decorative blocks for:

Hero card backplates
Feature card accents
Step markers
Interactive hotspots
Gamified milestone panels
Empty-state illustrations
Scene transitions
Rules:

Blocks must not replace the deep green canvas.
Blocks should sit behind white cards or near key objects.
Blocks should not interfere with text readability.
Blocks should not carry important content unless contrast is verified.
Blocks should use simple geometry: rectangles, strips, circles, stars, arrows, blocks, or skewed panels.
Skewed Arcade-Sign Buttons
Buttons are one of the signature elements of Immersive. They should feel like interactive signs reacting to the player.

Primary buttons should be white, skewed, bordered, and shadowed. On hover, the shadow should grow or shift. On active, the button should compress.

Recommended button behavior:

.button-primary {
  transform: skew(-6deg);
  background: var(--surface);
  border: 3px solid var(--border-strong);
  box-shadow: 6px 6px 0 var(--shadow-hard);
}

.button-primary:hover {
  box-shadow: 9px 9px 0 var(--shadow-hard);
  transform: skew(-6deg) translate(-2px, -2px);
}

.button-primary:active {
  box-shadow: 3px 3px 0 var(--shadow-hard);
  transform: skew(-6deg) translate(3px, 3px);
}
Text inside a skewed button should remain visually readable. If the outer button is skewed, apply an inverse skew to the inner label when needed.

.button-primary > span {
  display: inline-block;
  transform: skew(6deg);
}
Motion and Interaction
Immersive should use animation as part of the experience. Motion can support storytelling, reveal progression, create game-like feedback, and help users understand the journey.

Use motion for:

Scene entrances
Card reveals
Step completion
Hover reactions
Progression markers
Decorative block movement
Gamified scoring or unlock moments
Timeline transitions
Exhibit-style wayfinding
Motion should be playful but controlled. It must never block core usability.

Recommended motion durations:

Motion Type	Duration	Purpose
Micro-interaction	100–180ms	Button hover, active press, toggle feedback
Component transition	180–280ms	Card reveal, tooltip, popover, modal entrance
Scene transition	300–500ms	Story section reveal, milestone change, exhibit transition
Decorative loop	2–8s	Ambient geometric motion, only when non-disruptive
All meaningful motion must respect reduced-motion preferences.

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    transition-duration: 0.01ms;
    scroll-behavior: auto;
  }
}
Component Coverage
The Immersive skill file should guide complete interface generation across product, marketing, storytelling, onboarding, and interactive experiences.

Buttons
Buttons should feel tactile, playful, and responsive. They should look like arcade signs or exhibit controls.

Button variants:

Variant	Usage
Primary	Main actions, story progression, start buttons, next steps
Secondary	Supporting actions, alternative paths, optional choices
Tertiary	Text links, inline actions, low-emphasis navigation
Destructive	Delete, reset, remove, irreversible actions
Disabled	Unavailable actions or locked steps
Loading	Actions currently processing
Primary button rules:

Use white surface fill.
Use thick black border.
Use hard black offset shadow.
Use slight skew for signature shape.
Use Oswald at 16px or larger.
Use clear action text.
Increase or shift shadow on hover.
Compress shadow on active.
Show visible focus state.
Preserve readable label alignment.
Button state requirements:

State	Required Behavior
Default	White fill, black border, hard shadow, readable label
Hover	Shadow grows or object lifts slightly
Focus-visible	High-contrast outline in addition to border or shadow
Active	Button compresses; shadow reduces or shifts inward
Disabled	Reduced contrast but still readable; no hover lift
Loading	Maintains width; shows spinner or progress label
Error	Uses danger styling with text explanation when action fails
Avoid vague labels like Submit, Click here, or Go. Use labels that describe the next story or task step.

Good labels:

Context	Recommended Label
Start experience	Enter the exhibit
Continue	Continue journey
Quiz	Lock in answer
Onboarding	Start mission
Next scene	Reveal next stop
Save	Save progress
Cards
Cards are exhibit placards. They should look like physical objects placed on the deep green canvas.

Card rules:

Use white surface fill.
Use 3px or 4px black border.
Use hard offset shadow.
Keep padding on the spacing scale.
Use Oswald headings.
Use decorative cobalt or hot-pink block behind important cards.
Avoid soft shadows.
Avoid thin gray borders.
Ensure long content wraps cleanly.
Keep interactive cards keyboard accessible.
Card variants:

Variant	Usage
Standard card	General content, summaries, feature blocks
Exhibit card	Story panels, educational content, scene objects
Challenge card	Quizzes, choices, gamified prompts
Reward card	Completion, unlocks, achievements
Data card	Metrics, scores, progress summaries
Modal card	Dialog content and focused decisions
Interactive cards should have clear hover, focus-visible, and active states. A hover state may lift the card or increase its shadow. An active state may compress the shadow like a button.

Story Sections
Story sections are the primary layout unit. Even though the canvas remains continuous, content can be organized into scenes.

Story section rules:

Keep the deep green background continuous.
Use spacing and object placement to create scene breaks.
Introduce each scene with a strong Oswald heading.
Use white cards for readable content.
Add geometric backplates behind key objects.
Use progress markers when the journey has steps.
Avoid full-width white background bands.
Make scroll progression feel intentional.
Story sections should feel like stations in an exhibit. Each section should answer: “Where am I, what can I interact with, and what happens next?”

Navigation
Navigation should feel like wayfinding inside an exhibit. It should be clear, bold, and contextual.

Navigation patterns may include:

Top navigation as a signboard
Sticky progress markers
Step-based journey navigation
Map-style section links
Anchor navigation as exhibit stops
Breadcrumbs for nested experiences
Navigation rules:

Use Oswald for labels.
Use high-contrast text.
Show active state with more than color.
Preserve keyboard navigation.
Keep focus-visible states obvious.
Avoid tiny subtle links on the green canvas.
Use white signboard surfaces when navigation needs high readability.
Active states can use:

Thick underline
Black border
Shadowed white pill or block
Cobalt or hot-pink marker
Step number or icon
Forms
Forms must remain clear even inside the playful visual system. The exhibit style should not make forms feel like puzzles unless the form is intentionally gamified.

Form rules:

Labels must always be visible.
Placeholder text must not replace labels.
Inputs should use white fill, black border, and readable text.
Focus-visible states must be obvious.
Error messages must be linked to fields programmatically.
Required fields must be indicated accessibly.
Disabled fields must remain understandable.
Long labels and helper text must wrap cleanly.
Validation must not rely on color alone.
Form fields may use hard shadows sparingly. For dense forms, reduce shadow size so the layout does not become cluttered.

Recommended input styling:

.input {
  background: var(--surface);
  color: var(--text);
  border: 3px solid var(--border-strong);
  padding: 12px 16px;
  font-family: var(--font-primary);
  font-size: 16px;
}

.input:focus-visible {
  outline: 3px solid var(--brand-tertiary);
  outline-offset: 3px;
}
Quizzes, Challenges, and Gamified Choices
Immersive is well suited to interactive journeys, quizzes, missions, challenges, and guided exploration.

Choice component rules:

Each option must be reachable by keyboard.
Selected state must use more than color.
Correct and incorrect states must include text or icon cues.
Locked states must be clearly identified.
Progress must be visible when the flow has multiple steps.
Animations should reinforce feedback but not replace it.
Users must be able to recover from mistakes when appropriate.
Choice cards can use strong visual states:

State	Treatment
Default	White card, black border, hard shadow
Hover	Shadow grows or card lifts
Focus-visible	High-contrast outline
Selected	Extra border weight, marker, or cobalt block
Correct	Success label plus visual cue
Incorrect	Danger label plus explanation
Disabled	Reduced contrast and no interaction lift
Progress and Journey Indicators
Progress indicators should feel like exhibit maps or game checkpoints.

Patterns may include:

Numbered stops
Timeline markers
Mission progress bars
Badge unlocks
Scene maps
Completion stamps
Score counters
Progress rules:

Use clear labels, not only visual icons.
Show current, completed, and upcoming states.
Use semantic success for completed states where appropriate.
Avoid relying on cobalt or hot pink alone.
Keep progress readable on small screens.
Make step navigation accessible if steps are clickable.
Example labels:

State	Recommended Copy
Current	Stop 2 of 5: Build your profile
Complete	Completed: Choose your path
Locked	Locked until previous stop is complete
Error	Step incomplete: Add your email address
Modals and Overlays
Modals should feel like exhibit panels layered above the canvas. They should be bold, contained, and easy to dismiss when appropriate.

Modal rules:

Use white surface.
Use thick black border.
Use hard offset shadow.
Use clear title and action buttons.
Trap focus inside the dialog.
Close on Escape unless the flow requires explicit confirmation.
Return focus to the triggering element after close.
Avoid excessive motion during modal entrance.
Respect reduced-motion preferences.
Destructive modals must use danger language and explain consequences clearly.

Alerts and Feedback
Feedback should be immediate, playful where appropriate, and unambiguous.

Alert rules:

Use semantic colors for success, warning, and danger.
Include text labels and recovery guidance.
Do not rely on color alone.
Keep alerts visually consistent with the white-card object system.
Use thick borders and clear icons or labels.
Make dismiss controls keyboard accessible.
Example feedback copy:

State	Recommended Copy
Success	Progress saved.
Completion	Checkpoint unlocked.
Warning	Finish this step before moving on.
Error	The answer could not be submitted. Try again.
Destructive	Reset this journey? Your progress will be lost.
Empty States
Empty states should feel like exhibit moments, not blank utility screens.

Empty state rules:

Use a white exhibit card.
Include a strong Oswald heading.
Explain what is missing.
Provide one clear next action.
Use a decorative geometric block or simple illustration if helpful.
Avoid vague copy like Nothing here.
Examples:

Weak Copy	Better Copy
No data	No artifacts collected yet.
Nothing here	Your exhibit is empty. Add the first item to begin.
No results	No matches found. Try a different search term.
Tables and Data
Immersive can support data displays, but dense data should not become visually chaotic.

Table rules:

Use white table surfaces on the green canvas.
Use black borders and strong headers.
Use JetBrains Mono for technical values.
Use restrained shadows for large data containers.
Avoid decorative blocks behind dense tables.
Preserve readable row spacing.
Provide horizontal scroll or responsive card transformation on small screens.
Use semantic colors only for meaningful states.
Data-heavy screens should still feel like exhibit panels, but clarity must come first.

Accessibility
Immersive enforces WCAG 2.2 AA as a baseline. Because the visual style is bold, animated, and playful, accessibility must be treated as a core implementation requirement rather than a final check.

Core Accessibility Requirements
Text must meet WCAG 2.2 AA contrast against its background.
All interactive elements must be reachable and operable by keyboard.
Every interactive element must have a visible focus-visible state.
Motion must respect prefers-reduced-motion.
Color must never be the only indicator of state.
Form errors must be visually and programmatically associated with fields.
Semantic HTML must be used before ARIA.
Touch targets should be large enough for comfortable interaction.
Decorative elements must not interfere with reading order.
Decorative blocks should be hidden from assistive technologies when they carry no meaning.
Contrast Requirements
The deep green canvas creates strong contrast with white cards, but text directly on the green must be handled carefully.

Rules:

Body text should usually sit on white surfaces.
Text directly on the green canvas must use a tested high-contrast color.
Small text should not sit on cobalt or hot-pink decorative blocks unless contrast is verified.
Black text should be used on white surfaces.
White text on deep green can be used for large headings and navigation only when contrast passes.
Semantic red, amber, and green states must be checked against their surfaces.
Do not assume that bold color equals accessible contrast. Test every foreground/background pair.

Keyboard Interaction
Immersive components must feel playful for pointer users and fully usable for keyboard users.

Keyboard rules:

Tab order must match the visual journey order.
Focus states must be visible even on shadowed or skewed elements.
Buttons must activate with Enter and Space.
Interactive cards must use proper button or link semantics.
Modals must trap focus and return focus after closing.
Carousels, timelines, and maps must provide keyboard controls.
Gamified choices must be selectable without a mouse.
Drag-and-drop interactions must provide keyboard alternatives.
Motion Accessibility
Motion is part of the Immersive identity, but it must not create barriers.

Motion rules:

Respect prefers-reduced-motion.
Do not use flashing or rapid repeated animation.
Avoid motion that causes layout shifts during reading.
Do not animate essential instructions away before users can read them.
Provide non-motion feedback for completion, errors, and selected states.
Use transitions to clarify state changes, not to delay interaction.
Reduced-motion mode should preserve the experience through static states, instant transitions, and clear visual feedback.

Focus States
Focus states should be bold enough to stand out against thick borders and hard shadows.

Preferred focus treatments:

3px or thicker high-contrast outline
Offset outline outside the black border
Cobalt outline on white components
White outline plus black shadow on green canvas
Underline plus outline for text links
Avoid faint glows, subtle opacity changes, or focus states that are hidden by the component’s existing shadow.

Decorative Elements
Decorative cobalt and hot-pink blocks must not confuse assistive technology users.

Rules:

Decorative shapes should use aria-hidden="true" when rendered as elements.
Decorative images should use empty alt="".
Do not place important text inside decorative blocks unless they are treated as real content containers.
Ensure decorative elements do not cover focus outlines.
Ensure decorative elements do not intercept pointer events unless intentionally interactive.
Content and Tone
Immersive uses concise, confident, helpful copy with a playful sense of journey. The tone should feel inviting and energetic, but still clear.

Voice Principles
Immersive copy should be:

Clear
Playful
Action-oriented
Confident
Short
Journey-aware
Easy to scan
The system can use exhibit and game metaphors, but it should not sacrifice clarity. A user should always understand what an action does.

Good Examples
Context	Recommended Copy
Primary CTA	Enter the exhibit
Continue action	Continue journey
Quiz action	Lock in answer
Progress save	Save progress
Empty state	No artifacts collected yet.
Loading state	Preparing the next stop…
Error message	The answer could not be submitted. Try again.
Destructive confirmation	Reset this journey? Your progress will be lost.
Avoid
Weak Copy	Better Copy
Submit	Lock in answer
Click here	Open the next stop
Continue	Continue journey
Oops!	The request failed.
No data	No artifacts collected yet.
Are you sure?	Reset this journey?
Copy can be playful, but it must remain specific. Avoid vague CTAs that sound fun but do not explain the result.

Storytelling Standards
When the interface includes a narrative journey, each scene should include:

A clear title
A short orientation sentence
One primary action
A visible progress cue when part of a sequence
Clear completion feedback
Recovery guidance if the user cannot continue
Example scene structure:

Stop 3: Build Your Signal

Choose the traits that best describe your project. Your selections will shape the final recommendation.

[Choose traits]
How to Use with AI Tools
Cursor and Claude Code
Add the Immersive skill file to your project so the assistant can use it as design-system context while generating UI code.

npx typeui.sh immersive
The skill file should be saved as SKILL.md or another project-level instruction file. Once present, ask the assistant to generate pages, flows, components, or refactors using the Immersive design system.

Example prompts:

Create an interactive onboarding journey using the Immersive design system.
Build a card grid that feels like exhibit placards on a continuous deep green canvas.
Refactor this landing page into an immersive digital exhibit with skewed buttons, thick borders, hard shadows, and animated checkpoints.
Create a quiz flow with accessible gamified choice cards and reduced-motion support.
Claude
Use the design skill directly in Claude by adding the markdown file as project knowledge or pasting it into the beginning of a conversation.

Then ask for implementation-specific output:

Generate React components for Immersive buttons, cards, and progress indicators.
Create component rules for exhibit cards, story sections, and gamified choices using this skill.
Audit this UI against the Immersive design rules and list required changes.
ChatGPT, Windsurf, Copilot, v0, and Other AI Tools
The file is standard markdown, so it can be used with any AI assistant that accepts context, prompt instructions, or project-level rules.

Useful workflows include:

Paste the skill into the chat before requesting UI code.
Add it to a repository-level instruction file.
Use it as context for landing pages, onboarding flows, or interactive experiences.
Use it to define component variants and states.
Use it as a QA checklist during code review.
Ask the assistant to migrate an existing static UI into the Immersive exhibit-style system.
The best results come from prompting for both visual style and behavior: canvas rules, card treatment, button motion, decorative blocks, keyboard interaction, reduced-motion support, and accessibility acceptance criteria.

Design Philosophy
Immersive is governed by a few core principles.

1. The Canvas Is the World
The deep green background is not a section color. It is the environment. Every scene, card, button, and decorative element exists inside that single continuous world.

2. Components Are Exhibit Objects
Cards, buttons, modals, and panels should feel like physical objects placed into the exhibit. Thick borders, white surfaces, and hard shadows give them presence.

3. Interaction Should Feel Tactile
Hover, focus, active, loading, selected, and completed states should feel responsive. Buttons compress. Cards lift. Progress unlocks. The interface should react like a playful system, not a static brochure.

4. Motion Supports Story
Animation should help users understand movement, sequence, cause, and progress. It should not exist only as decoration. Every motion pattern should have a purpose.

5. Playfulness Requires Discipline
Immersive is playful, but it is not random. The system uses strict tokens, repeated geometry, consistent typography, and explicit states so that the experience remains coherent.

6. Accessibility Is Part of the Experience
A digital exhibit must be explorable by keyboard, screen reader, touch, and pointer users. Reduced-motion mode, visible focus states, semantic markup, and clear copy are non-negotiable.

Anti-Patterns
Avoid these implementations when generating Immersive-style interfaces:

Alternating major page sections between white, gray, cream, and green
Using the deep green brand color only as a header or footer
Soft blurred shadows instead of hard offset block shadows
Thin gray borders on cards or buttons
White full-width sections that break the continuous canvas
Decorative cobalt or hot-pink shapes that cover text
Random bright colors outside the defined palette
Overuse of motion that delays interaction
Animations that ignore prefers-reduced-motion
Skewed text that becomes hard to read
Placeholder-only form labels
Interactive cards without button or link semantics
Gamified choices that cannot be selected by keyboard
Focus states hidden by shadows or decorative blocks
Color-only selected, success, warning, or error states
Dense layouts where shadows and borders collide
Vague labels like Submit, Click here, or Go
Decorative elements exposed unnecessarily to screen readers
Components missing hover, focus-visible, active, disabled, loading, or error states
Immersive should feel playful and experiential, but never inaccessible, chaotic, or unclear.

Migration Notes
When adapting an existing interface to Immersive, migrate in this order:

Replace the app background with the continuous deep green canvas.
Remove alternating full-width section backgrounds that break the canvas.
Convert content containers into white exhibit objects.
Add thick black borders to cards, buttons, modals, and panels.
Replace soft shadows with hard offset block shadows.
Introduce Oswald for primary and display typography.
Normalize spacing to the 4 / 8 / 12 / 16 / 24 / 32px scale.
Add cobalt and hot-pink decorative blocks behind key objects.
Convert generic buttons into skewed, tactile sign-like buttons.
Define explicit hover, focus-visible, active, disabled, loading, and error states.
Add journey markers, progress indicators, or exhibit labels where the experience has sequence.
Review motion and add prefers-reduced-motion support.
Test keyboard navigation and screen reader order.
Replace vague labels with journey-aware action copy.
Run the QA checklist before shipping.
Do not migrate by simply turning the page background green. Immersive depends on the full object system: white cards, thick black borders, hard shadows, condensed typography, geometric accents, interaction states, and continuous-canvas storytelling.

QA Checklist
Use this checklist when reviewing generated UI against the Immersive design skill.

Visual System
The entire app sits on one continuous deep green #00592B canvas.
Major sections do not alternate to white, gray, cream, or unrelated backgrounds.
Foreground objects use white surface fills.
Cards and panels use thick black borders.
Shadows are hard, offset, and blur-free.
Buttons use the skewed sign-like treatment where appropriate.
Decorative cobalt blue blocks use #0023D1.
Hot-pink accents are used sparingly as decorative geometry.
Decorative blocks sit behind objects and do not reduce readability.
The interface feels like an exhibit or interactive journey, not a generic landing page.
Typography
Oswald is used for primary and display typography.
JetBrains Mono is reserved for code, metadata, and technical values.
Type sizes come from the 12 / 14 / 16 / 20 / 24 / 32px scale.
Display headings are bold and condensed without overwhelming every component.
Uppercase labels remain short and readable.
Long headings wrap cleanly.
Body copy remains readable on white surfaces.
Components
Buttons include default, hover, focus-visible, active, disabled, loading, and error states.
Button hover states grow or shift the hard shadow.
Button active states compress the shadow.
Cards behave like exhibit placards.
Interactive cards are keyboard accessible.
Forms use visible labels and accessible error messaging.
Navigation communicates active state with more than color.
Modals trap focus and return focus after closing.
Progress indicators show current, completed, and upcoming states.
Quizzes and choices support keyboard selection.
Empty states include useful copy and one clear action.
Motion and Interaction
Motion supports storytelling, feedback, or progression.
Hover and active states feel tactile.
Scene transitions do not block usability.
Animations do not create layout shifts during reading.
Reduced-motion mode is implemented.
Completion and error feedback do not rely on animation alone.
Decorative loops are subtle and non-essential.
Accessibility
Text contrast meets WCAG 2.2 AA.
Text on deep green, cobalt, hot pink, and semantic colors has been tested.
Keyboard navigation works across all interactive elements.
Focus-visible states are obvious and not hidden by shadows.
Color is never the only state indicator.
Form errors are linked to fields programmatically.
Semantic HTML is used before ARIA.
Touch targets are large enough for comfortable interaction.
Decorative elements are hidden from assistive technologies when appropriate.
Drag, map, carousel, or game-like interactions have keyboard alternatives.
Reduced-motion preferences are respected.
Content
CTA labels are specific and journey-aware.
Error messages explain what happened and how to recover.
Empty states explain what is missing and what to do next.
Progress labels identify where the user is in the journey.
Destructive actions clearly state consequences.
Copy is playful but still clear.
Vague labels like Submit, Click here, and Go are avoided.
Immersive is a disciplined design system for interfaces that should feel like interactive digital exhibits. Its strength comes from one continuous deep green canvas, bold foreground objects, tactile motion, playful geometry, and accessible storytelling.