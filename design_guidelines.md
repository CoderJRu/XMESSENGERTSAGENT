# Design Guidelines: Modern Messaging Application

## Design Approach
**Reference-Based Approach**: Telegram-inspired messaging interface
- Primary reference: Telegram's clean, minimalist aesthetic with focus on readability and efficiency
- Secondary influences: WhatsApp's conversation flow, Signal's privacy-focused simplicity
- Core principle: Content-first design where messages are the hero, UI elements recede into supporting roles

## Typography System
**Font Selection**: System font stack for optimal performance and native feel
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- Message text: 15px regular weight, 1.4 line-height for comfortable reading
- Sender names: 14px medium weight
- Timestamps: 12px regular, slightly muted
- Chat list names: 16px medium weight
- Chat list previews: 14px regular
- Input field: 15px regular

## Spacing & Layout System
**Tailwind Units**: Consistent spacing using 2, 3, 4, 6, 8, 12, 16 units
- Chat list padding: p-3 for individual items, gap-2 between elements
- Message bubbles: px-4 py-2, generous mb-2 between messages
- Container margins: mx-4 for mobile, mx-8 for desktop
- Section spacing: py-6 for major sections, py-3 for sub-sections

**Layout Structure**:
- Three-column desktop layout: Sidebar (320px fixed) | Chat List (400px fixed) | Chat View (flex-1)
- Mobile: Single column with slide-in navigation
- Max container width: Full viewport (messaging is full-bleed)
- Message bubbles: max-w-2xl for readability, never full width

## Core UI Components

### Navigation Sidebar (Desktop Only)
- Fixed 320px width, full viewport height
- Logo/brand at top (h-16 with p-4)
- Navigation items with icon + label pattern
- Items: Chats, Contacts, Settings, Profile
- Active state: Subtle left border (w-1) indicator
- Icons: 24px size, aligned left with 12px gap to text

### Chat List Panel
- Search bar at top: h-12, rounded-lg, px-4
- Search icon (20px) positioned left inside input
- Chat items: h-20 each with flex layout
- Avatar circle: w-12 h-12, left-aligned
- Content area: Three-line layout (name, preview, timestamp)
- Unread badge: Circular, positioned top-right, 20px diameter minimum
- Dividers: 1px lines between items
- Hover state: Subtle background shift, no borders
- Pinned chats: Appear at top with small pin icon (16px)

### Chat View Header
- Fixed h-16 header with flex layout
- Avatar (w-10 h-10) + Name + Status indicator
- Right-aligned utilities: Search, Call, Video, Menu icons (20px each)
- Icons spaced with gap-4
- Bottom border: 1px separator line

### Message Bubbles
- Asymmetric alignment: Sent (right), Received (left)
- Border radius: rounded-2xl (16px) with tail-like shape using rounded-tl-sm for received, rounded-tr-sm for sent
- Max width: 75% of chat area on desktop, 85% on mobile
- Internal padding: px-4 py-2.5
- Timestamp: 11px, positioned bottom-right inside bubble with opacity-70
- Read receipts: Double checkmark icon (14px) next to timestamp for sent messages
- Link previews: Card within bubble (pt-3, rounded-lg)
- Images/media: Rounded-lg within bubbles, max-h-96
- Spacing between consecutive messages from same sender: mb-1
- Spacing when sender changes: mb-4

### Message Input Bar
- Fixed height: h-16
- Attachment button (left): Paperclip icon 20px with p-3 clickable area
- Text input: flex-1, rounded-full, px-4
- Emoji button: 20px icon, positioned right inside input field
- Send button: w-10 h-10 circular, positioned right outside input, contains arrow icon
- Voice message button: Microphone icon appears when input is empty

### Additional Components
- **Date Separators**: Centered pill shape (px-4 py-1, rounded-full) appearing between message groups
- **Typing Indicator**: Three animated dots (8px each) in received bubble position
- **Context Menu**: Rounded-xl dropdown (min-w-48) with 8px items padding
- **Scroll-to-bottom Button**: Circular (w-12 h-12), fixed bottom-right with mb-20, contains down arrow
- **Media Viewer**: Full-screen overlay with navigation arrows, close button top-right

## Interaction Patterns
- **Long Press**: On mobile, long-press message bubbles for context menu (Reply, Forward, Delete, Copy)
- **Swipe Actions**: Swipe right on chat items reveals Archive action
- **Pull to Refresh**: In chat list, pulls down refreshes conversations
- **Infinite Scroll**: Both chat list and message history load more on scroll
- **Smart Grouping**: Messages from same sender within 1 minute group together (no repeated avatars/names)

## Animations (Minimal)
- Message send: Gentle slide-up + fade-in (150ms)
- New message receive: Subtle bounce effect (200ms)
- Menu transitions: Smooth fade + scale (150ms)
- Page transitions: Simple fade between views (200ms)
- Skeleton loading: Pulse animation for loading states
- **No** elaborate scroll animations or parallax effects

## Accessibility
- Focus indicators: 2px outline for keyboard navigation
- Icon buttons: Minimum 44px touch targets with semantic labels
- Color contrast: All text meets WCAG AA standards
- Screen reader: Proper ARIA labels for all interactive elements
- Keyboard shortcuts: Support Cmd/Ctrl+K for search, Escape to close modals

## Responsive Behavior
**Desktop (1024px+)**: Three-column layout with all panels visible
**Tablet (768px-1023px)**: Two-column (Chat List + Chat View), sidebar becomes drawer
**Mobile (<768px)**: Single column, navigation via overlays and back buttons

## Images
**No hero images** - This is a functional messaging application focused on conversations, not marketing content. All imagery is user-generated content within messages and avatars.

**Profile Avatars**: Circular, generated from user initials when no photo available, with varied background colors per user for visual distinction.

This design prioritizes **clarity, speed, and conversation flow** above all else, ensuring users can focus on communication without UI interference.