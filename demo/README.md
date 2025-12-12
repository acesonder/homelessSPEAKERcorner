# Demo Projects - Homeless Speaker Corner

This folder contains 7 interactive community voice platforms designed for homelessness advocacy, plus a comprehensive admin portal for managing all content.

## Demo Projects

### 1. THE RETRO TV DEBATE STATION
**File**: `retro-tv.html`

A crackling CRT television interface where community voices are broadcast. Features green phosphor text, scan lines, and a classic TV aesthetic. Perfect for weekly featured topics about housing barriers and policy changes.

**Topics**:
- Housing barriers
- Sleep deprivation effects
- Support services
- Policy changes
- Low-barrier options
- Stigma and recovery
- Safe sleep definition
- County improvements
- Addiction misconceptions

### 2. THE STREETLIGHT TOPIC LANTERN
**File**: `streetlight-lantern.html`

A glowing streetlamp that changes color based on topic category (blue for homelessness, red for crisis, green for recovery, yellow for community). Comments float upward like fireflies under the lamp's glow.

**Topics**:
- Sleep difficulties when unhoused
- Night outreach effectiveness
- Mental health supports
- Detox programs
- Warming room fears
- Winter challenges
- Emergency beds
- Shelter rules
- Resource wishes
- Exhaustion and trauma

### 3. THE GRAFFITI WALL OF TRUTH
**File**: `graffiti-wall.html`

A digital wall where users "tag" with different styles: spray paint, marker, chalk, stickers, or posters. Raw and authentic community voice with layered visual effects.

**Topics**:
- Personal stories
- Drugs and survival
- Messages to leaders
- Stuck cycles
- Moments of hope
- System failures
- Hardest night survival
- Misconceptions about homelessness
- Healing definition
- Warming room improvements

### 4. THE CAFÉ CHAT WINDOW
**File**: `cafe-chat.html`

A warm, cozy café interface with wood textures, a steaming coffee mug animation, and chalkboard menu. Designed for sensitive, emotional topics.

**Topics**:
- Exhaustion in crisis
- Who helped when invisible
- What Cobourg ignores
- Definition of stability
- Safety at night
- Kindness wished for
- System navigation
- Good day definition
- Sleep loss and mental health
- Recovery meaning

### 5. THE POLICE SCANNER FEED
**File**: `police-scanner.html`

Emergency radio dispatch theme with rolling message logs. Excellent for alert topics like shelter closures, overdose spikes, and weather emergencies.

**Topics**:
- Emergency resources needed
- Cold-weather response gaps
- Overdose alert distribution
- Risks sleeping outside
- Preventing winter deaths
- First responder understanding
- Warming room safety
- Safe-sleep locations
- Crisis response failures
- Proper overnight shelter

### 6. THE VOICE OF THE TOWN PODIUM
**File**: `town-podium.html`

A wooden podium with spotlight where users "step up" to speak. Comments are framed as community meeting statements.

**Topics**:
- What needs to be said
- Message to County Council
- Homelessness intersection
- Affordable housing definition
- Why avoid shelters
- Life-saving support
- Dignity definition
- Recovery complications
- Policy priorities
- Community responsibility

### 7. THE MIDNIGHT DOCUMENTARY ROOM
**File**: `documentary-room.html`

A darkened cinema with film projector and grainy overlays. Perfect for sharing documentary reflections and lived experience narratives.

**Topics**:
- Story impact
- Personal connections
- System changes needed
- Sources of hope
- Recovery unpredictability
- Trauma's path
- What films miss
- Missing services
- Prevention strategies
- Next documentary topics

## Admin Portal - "THE CONTROL ROOM"

**Access**: `/demo/admin/`  
**Passcode**: `079777`

### Features

#### Dashboard
- **Live Statistics**: Real-time counts of comments today, this hour, active topics, and flagged posts
- **Emergency Mode**: Toggle emergency alerts with persistent state
- **Recent Activity**: Timeline of all user actions across demos
- **Demo Status**: Individual statistics for each of the 7 projects
- **Quick Actions**: One-click access to all admin functions

#### Comment Moderation
- **Filter by Project**: View comments from specific demos
- **Search**: Find comments by keyword
- **Sort**: Newest or oldest first
- **Delete**: Remove inappropriate content
- **Real-time Updates**: Statistics refresh automatically

#### Security
- **Passcode Protection**: Secure login required (079777)
- **Session Management**: 24-hour auto-logout
- **Input Sanitization**: All user content is escaped to prevent XSS
- **State Persistence**: Settings saved in localStorage

## Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Animations, gradients, and responsive design
- **Vanilla JavaScript**: No frameworks required
- **LocalStorage**: Data persistence
- **Web Speech API**: Text-to-speech for accessibility

## Usage

### For Visitors
1. Open `/demo/index.html` in a web browser
2. Click any demo project card
3. Select a topic from the dropdown
4. Enter your name (optional) and comment
5. Submit to see your comment appear in real-time

### For Administrators
1. Go to `/demo/admin/`
2. Enter passcode: `079777`
3. View dashboard statistics
4. Access moderation tools to manage comments
5. Toggle emergency mode when needed

## File Structure

```
demo/
├── index.html                  # Demo projects landing page
├── README.md                   # This file
├── retro-tv.html              # Demo 1
├── streetlight-lantern.html   # Demo 2
├── graffiti-wall.html         # Demo 3
├── cafe-chat.html             # Demo 4
├── police-scanner.html        # Demo 5
├── town-podium.html           # Demo 6
├── documentary-room.html      # Demo 7
├── css/
│   ├── shared.css             # Common styles
│   ├── retro-tv.css           # Demo 1 styles
│   ├── streetlight-lantern.css # Demo 2 styles
│   ├── graffiti-wall.css      # Demo 3 styles
│   ├── cafe-chat.css          # Demo 4 styles
│   ├── police-scanner.css     # Demo 5 styles
│   ├── town-podium.css        # Demo 6 styles
│   └── documentary-room.css   # Demo 7 styles
├── js/
│   ├── shared.js              # Common utilities
│   ├── retro-tv.js            # Demo 1 logic
│   ├── streetlight-lantern.js # Demo 2 logic
│   ├── graffiti-wall.js       # Demo 3 logic
│   ├── cafe-chat.js           # Demo 4 logic
│   ├── police-scanner.js      # Demo 5 logic
│   ├── town-podium.js         # Demo 6 logic
│   └── documentary-room.js    # Demo 7 logic
└── admin/
    ├── index.html             # Login page
    ├── dashboard.html         # Admin dashboard
    ├── moderation.html        # Comment moderation
    ├── css/
    │   └── admin.css          # Admin styles
    └── js/
        ├── admin-auth.js      # Authentication
        └── dashboard.js       # Dashboard logic
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Data Storage

All data is stored locally in the browser using `localStorage`:
- Comments are stored per demo project
- Admin session state
- Emergency mode settings
- No server or database required

## Future Enhancements

The admin portal structure includes placeholders for:
- Topic Manager
- Broadcast Studio (Media Manager)
- Polls & Heat Checks
- User Management
- Resource Launcher
- Analytics & Insights
- Theme Designer
- Security & System Logs

These can be implemented as needed by adding corresponding HTML pages following the existing patterns.

## License

Part of the Homeless Speaker Corner project.

## Support

For issues or questions, please contact the repository maintainers.
