/* ============ helpers ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const labelize = key => key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();

/* ============ icon set (stroke-art, no emoji) ============ */
const ICONS = {
  aptitude: '<path d="M12 3 20 9 16 21 8 21 4 9Z"/><path d="M4 9h16M8 21 12 9 16 21"/>',
  personality: '<circle cx="12" cy="12" r="7"/><path d="M12 5v3M12 16v3M5 12h3M16 12h3M7.5 7.5l2 2M14.5 14.5l2 2M16.5 7.5l-2 2M9.5 14.5l-2 2"/>',
  interest: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5Z" fill="currentColor" stroke="none"/>',
  ei: '<path d="M12 19s-6.5-4-8.5-8.2C2.2 7.8 3.6 5 6.5 5c1.8 0 3.1 1 5.5 3.4C14.4 6 15.7 5 17.5 5c2.9 0 4.3 2.8 3 5.8C18.5 15 12 19 12 19Z"/><path d="M4.5 12h3l1.3-2.5L11 14l1.5-3.5L13.5 12h6"/>',
  approach: '<path d="M12 2c2.8 2 4.5 5.6 4.5 9.3 0 1.7-.4 3.4-.9 4.4l-3.6 2.7-3.6-2.7c-.5-1-.9-2.7-.9-4.4C7.5 7.6 9.2 4 12 2Z"/><circle cx="12" cy="9.3" r="1.4" fill="currentColor" stroke="none"/><path d="M7.8 15.6l-2.3 3.1M16.2 15.6l2.3 3.1"/>',
  vault: '<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="1.6" fill="currentColor" stroke="none"/><path d="M9 6.5V6a3 3 0 0 1 6 0v.5"/>',
  wordlock: '<path d="M7 8c-2 0-3 1.5-3 3.5S5 15 7 15v3c-3 0-6-2.5-6-6.5S4 5 7 5Z"/><path d="M17 8c-2 0-3 1.5-3 3.5S15 15 17 15v3c-3 0-6-2.5-6-6.5S14 5 17 5Z"/>',
  logic: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.8h4c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z"/>',
  trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5M12 12v3m-3 4h6m-3-4v4"/>',
  'avatar-comet': '<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" fill="currentColor" stroke="none"/>',
  'avatar-moon': '<path d="M15 3a9 9 0 1 0 6 15.5A9 9 0 0 1 15 3Z" fill="currentColor" stroke="none"/>',
  'avatar-flame': '<path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-.5-2-1-2 1 0 2 1.5 2 3.5A5.5 5.5 0 1 1 8 11.5c0-3.5 2.5-5 4-9.5Z" fill="currentColor" stroke="none"/>',
  'avatar-burst': '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>',
  'avatar-shard': '<path d="M12 2 18 9 12 22 6 9Z"/><path d="M6 9h12M9 9 12 2M15 9 12 2"/>',
  'avatar-sun': '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4"/>',
  guide: '<path d="M12 3 4 8v3c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V8Z"/><circle cx="12" cy="11" r="2.4"/>',
  person: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>',
};
const AVATARS = [
  { id: 'comet', label: 'Comet Scout', color: '#2fd8ff', iconId: 'avatar-comet' },
  { id: 'nightshade', label: 'Nightshade', color: '#8b7bff', iconId: 'avatar-moon' },
  { id: 'ember', label: 'Ember', color: '#ff9a52', iconId: 'avatar-flame' },
  { id: 'nova', label: 'Nova', color: '#ff4fc3', iconId: 'avatar-burst' },
  { id: 'glacier', label: 'Glacier', color: '#8fe9ff', iconId: 'avatar-shard' },
  { id: 'solstice', label: 'Solstice', color: '#ffd166', iconId: 'avatar-sun' },
];
function icon(id, size = '') {
  const paths = ICONS[id]; if (!paths) return '';
  return `<span class="icon ${size}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></span>`;
}

/* ============ quest data (built from the domain PDF) ============ */
const QUEST = [
  {
    id: 'aptitude', title: 'Aptitude', tagline: 'Temple of Patterns', intro: 'Entering the Temple of Patterns…', guideName: 'The Temple Keeper', guideColor: '#8b7bff',
    steps: [
      {
        key: 'pattern-hunt', kicker: 'CHAPTER 1 · THE OLD MAP', title: 'Alien Pattern Hunt',
        prompt: "You've entered an ancient temple hunting for treasure. Trace the clues mentally, then choose where you end up.",
        type: 'choice', visualKind: 'map',
        clues: ['Move North', 'Turn Right', 'Walk two blocks', 'Turn Left'],
        options: [
          { label: 'Sundial Court', tags: { spatial: 1 } },
          { label: 'Treasure Chamber', tags: { spatial: 2, logicalReasoning: 1, sequentialProcessing: 2 }, correct: true },
          { label: 'Collapsed Passage', tags: { spatial: 1 } },
          { label: 'Guardian Statue', tags: { spatial: 1 } },
        ],
      },
      {
        key: 'escape-1', kicker: 'ROOM 1 OF 4 · NUMBER VAULT', title: 'Escape Room Challenge',
        prompt: 'Solve the sequence to earn a key.', type: 'choice', visualKind: 'vault', display: '3 → 6 → 12 → 24 → ?',
        options: [
          { label: '36', tags: { numericalAbility: 1 } },
          { label: '48', tags: { numericalAbility: 2, criticalThinking: 1 }, correct: true },
          { label: '30', tags: { numericalAbility: 1 } },
          { label: '42', tags: { numericalAbility: 1 } },
        ],
      },
      {
        key: 'escape-2', kicker: 'ROOM 2 OF 4 · WORD LOCK', title: 'Escape Room Challenge',
        prompt: 'Crack the analogy to earn a key.', type: 'choice', visualKind: 'wordlock', display: 'Book : Read :: Song : ?',
        options: [
          { label: 'Sing', tags: { verbalReasoning: 2, criticalThinking: 1 }, correct: true },
          { label: 'Dance', tags: { verbalReasoning: 1 } },
          { label: 'Write', tags: { verbalReasoning: 1 } },
          { label: 'Listen', tags: { verbalReasoning: 1 } },
        ],
      },
      {
        key: 'escape-3', kicker: 'ROOM 3 OF 4 · LOGIC CHAMBER', title: 'Escape Room Challenge',
        prompt: 'Reason it through to earn a key.', type: 'choice', visualKind: 'logic',
        display: 'All Zorbs are Blips. All Blips are Fribs. Is every Zorb a Frib?',
        options: [
          { label: 'Yes', tags: { logicalReasoning: 2, criticalThinking: 1 }, correct: true },
          { label: 'No', tags: { logicalReasoning: 1 } },
          { label: 'Cannot be determined', tags: { logicalReasoning: 1 } },
          { label: 'Only sometimes', tags: { logicalReasoning: 1 } },
        ],
      },
      {
        key: 'escape-4', kicker: 'ROOM 4 OF 4 · PATTERN PORTAL', title: 'Escape Room Challenge',
        prompt: 'Complete the pattern to unlock the final door.', type: 'choice', visualKind: 'pattern', sequence: ['△', '○', '△', '○', '?'],
        options: [
          { label: '△', tags: { abstractReasoning: 2, processingSpeed: 1, cognitiveFlexibility: 1 }, correct: true },
          { label: '○', tags: { abstractReasoning: 1 } },
          { label: '□', tags: { abstractReasoning: 1 } },
          { label: '✦', tags: { abstractReasoning: 1 } },
        ],
      },
    ],
  },
  {
    id: 'personality', title: 'Personality', tagline: 'Your creative hideout', intro: 'Stepping into your creative hideout…', guideName: 'The Architect', guideColor: '#ff4fc3',
    steps: [
      {
        key: 'workspace', kicker: 'CHAPTER 2 · MAKE IT YOURS', title: 'Design Your Dream Workspace',
        prompt: 'Choose 8 things you would love to have around you. There are no right or wrong answers.',
        type: 'multiselect', target: 8, visualKind: 'scene',
        options: [
          { label: 'Whiteboard', icon: '📋', tags: { planning: 2, leadership: 1, communication: 1 } },
          { label: 'Robotics Kit', icon: '🤖', tags: { learningAgility: 2, achievementOrientation: 1, creativity: 1 } },
          { label: 'Bean Bag Corner', icon: '🛋', tags: { adaptability: 2, creativity: 1 } },
          { label: 'Library Shelf', icon: '📚', tags: { learningAgility: 2, achievementOrientation: 1 } },
          { label: 'Plants', icon: '🌿', tags: { emotionalStability: 1, adaptability: 1, conscientiousness: 1 } },
          { label: 'Award Display', icon: '🏆', tags: { achievementOrientation: 2, leadership: 1 } },
          { label: 'Team Table', icon: '🧑‍🤝‍🧑', tags: { collaboration: 2, communicationStyle: 1, leadership: 1 } },
          { label: 'VR Station', icon: '🥽', tags: { creativity: 2, learningAgility: 1 } },
          { label: 'Music System', icon: '🎵', tags: { creativity: 2, adaptability: 1 } },
          { label: 'Drawing Tablet', icon: '🖊', tags: { creativity: 2, initiative: 1 } },
          { label: 'Coffee Corner', icon: '☕', tags: { collaboration: 2, communicationStyle: 1 } },
          { label: 'Meditation Space', icon: '🧘', tags: { adaptability: 2, emotionalRegulation: 1 } },
          { label: 'Planner Board', icon: '🗓', tags: { planning: 2, achievementOrientation: 1 } },
          { label: '3D Printer', icon: '🖨', tags: { creativity: 2, learningAgility: 1, innovation: 1 } },
          { label: 'Art Wall', icon: '🎨', tags: { creativity: 2, openness: 1 } },
        ],
      },
      {
        key: 'weekend', kicker: 'CHAPTER 2 · CONTINUED', title: 'Weekend Adventure',
        prompt: 'A whole weekend is free. Which activity would you genuinely enjoy the most?',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Organise a charity event', tags: { leadership: 2, initiative: 1, collaboration: 1 } },
          { label: 'Learn video editing', tags: { learningAgility: 2, creativity: 1 } },
          { label: 'Build a robot', tags: { achievementOrientation: 2, creativity: 1, problemSolving: 1 } },
          { label: 'Play sports all weekend', tags: { achievementOrientation: 2, teamwork: 1, resilience: 1 } },
          { label: 'Read an interesting book', tags: { learningAgility: 2, conscientiousness: 1 } },
          { label: 'Paint a mural', tags: { creativity: 2, adaptability: 1 } },
          { label: 'Volunteer at an animal shelter', tags: { collaboration: 2, empathy: 1, initiative: 1 } },
          { label: 'Sell handmade products online', tags: { initiative: 2, riskTolerance: 1, leadership: 1 } },
        ],
      },
    ],
  },
  {
    id: 'interest', title: 'Career Interest', tagline: 'Mystery Object Lab', intro: 'Arriving at the Mystery Object Lab…', guideName: 'The Cartographer', guideColor: '#2fd8ff',
    steps: [
      {
        key: 'object-microscope', kicker: 'OBJECT 1 OF 3 · MICROSCOPE', title: 'Mystery Object',
        prompt: 'A microscope appears on your bench. What would you most want to do with it?',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Discover new bacteria', career: { 'Medical Research': 2, Microbiology: 1, Biotechnology: 1 } },
          { label: 'Teach students how it works', career: { Education: 2 } },
          { label: 'Design a better microscope', career: { 'Biomedical Engineering': 2, 'Product Design': 1 } },
          { label: 'Write about the discovery', career: { Science: 1, Communication: 1, Journalism: 1 } },
        ],
      },
      {
        key: 'object-camera', kicker: 'OBJECT 2 OF 3 · CAMERA', title: 'Mystery Object',
        prompt: 'A camera appears on your bench. What would you most want to do with it?',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Shoot a documentary', career: { 'Film Making': 2, Media: 1 } },
          { label: 'Capture wildlife', career: { 'Wildlife Photography': 2, Conservation: 1 } },
          { label: 'Create advertisements', career: { Marketing: 2, Advertising: 1 } },
          { label: 'Record scientific experiments', career: { 'Scientific Research': 2, Education: 1 } },
        ],
      },
      {
        key: 'object-gavel', kicker: "OBJECT 3 OF 3 · JUDGE'S GAVEL", title: 'Mystery Object',
        prompt: "A judge's gavel appears on your bench. What would you most want to do with it?",
        type: 'choice', visualKind: 'scene',
        options: [
          { label: "Defend someone's rights", career: { Law: 2 } },
          { label: 'Create better laws', career: { 'Public Policy': 2 } },
          { label: 'Study crime patterns', career: { Criminology: 2 } },
          { label: 'Explain legal issues to the public', career: { 'Legal Journalism': 2 } },
        ],
      },
      {
        key: 'internship', kicker: 'FINAL MOMENT · INTERNSHIP QUEST', title: 'Choose Your Internship',
        prompt: 'You have offers from every internship below — but can accept only one.',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Space Research Centre', career: { STEM: 2, 'Aerospace Engineering': 1, Physics: 1 } },
          { label: 'Wildlife Rescue Camp', career: { 'Environment & Sustainability': 2, 'Veterinary Science': 1, Zoology: 1 } },
          { label: 'Animation Studio', career: { 'Design & Creative Arts': 2, Gaming: 1, 'Visual Effects': 1 } },
          { label: 'Hospital', career: { Healthcare: 2, Medicine: 1, Nursing: 1 } },
          { label: 'News Channel', career: { 'Media & Communication': 2, Journalism: 1, Broadcasting: 1 } },
          { label: 'Startup Incubator', career: { 'Business & Entrepreneurship': 2, Innovation: 1, 'Venture Creation': 1 } },
          { label: 'High Court', career: { 'Law & Public Policy': 2, 'Civil Services': 1, 'Legal Consulting': 1 } },
          { label: 'International NGO', career: { 'Social Sciences': 2, 'Public Policy': 1, 'Development Studies': 1 } },
          { label: 'School Innovation Lab', career: { Education: 2, 'Educational Technology': 1, 'Curriculum Design': 1 } },
          { label: 'Luxury Hotel', career: { 'Hospitality & Tourism': 2, 'Hotel Management': 1, 'Event Management': 1 } },
        ],
      },
    ],
  },
  {
    id: 'ei', title: 'Emotional Intelligence', tagline: 'People Signals', intro: 'Tuning in to People Signals…',
    steps: [
      {
        key: 'riya', kicker: 'CHAPTER 4 · READ THE MOMENT', title: 'Reading Between the Lines',
        prompt: 'A week before the exhibition, your teammate Riya goes quiet and starts making mistakes. She says "I\'m fine." What would you do?',
        type: 'choice', visualKind: 'people', themLabel: 'Riya', themLine: '"I\'m fine. Let\'s just finish the project."',
        options: [
          { label: 'Continue with the project since she said she is fine.', tags: { emotionalIntelligence: 1, respectForBoundaries: 1 } },
          { label: 'Ask if she needs help with the project work.', tags: { emotionalIntelligence: 2, empathy: 1, supportiveness: 1 } },
          { label: "Privately tell her you've noticed a change and you're here if she wants to talk.", tags: { emotionalIntelligence: 4, empathy: 2, emotionalAwareness: 2, respectForBoundaries: 1 } },
          { label: 'Inform a teacher immediately because something seems wrong.', tags: { emotionalIntelligence: 3, concernForWellbeing: 1 } },
        ],
      },
      {
        key: 'captain', kicker: 'CHAPTER 4 · CONTINUED', title: 'Hidden Feelings',
        prompt: 'You and your best friend both apply for cultural captain. You are selected — they congratulate you, then go quiet at lunch. What would you do?',
        type: 'choice', visualKind: 'people', themLabel: 'Your friend', themLine: '"Congrats! …" then quiet all through lunch.',
        options: [
          { label: 'Assume they need time and continue as usual.', tags: { emotionalIntelligence: 1 } },
          { label: "Message later saying you hope they're okay and you're around.", tags: { emotionalIntelligence: 2, empathy: 1, respectForBoundaries: 1 } },
          { label: 'Acknowledge it may have stung, and that the friendship matters to you.', tags: { emotionalIntelligence: 3, emotionalValidation: 2, empathy: 1 } },
          { label: 'Celebrate, and find a way to include them in what comes next.', tags: { emotionalIntelligence: 4, relationshipManagement: 2, socialAwareness: 1, leadership: 1 } },
        ],
      },
    ],
  },
  {
    id: 'approach', title: 'Career Approach', tagline: 'Mission Manager', intro: 'Launching Mission Manager…', guideName: 'Mission Commander', guideColor: '#ff9a52',
    steps: [
      {
        key: 'budget', kicker: 'STAGE 1 OF 3 · MISSION MANAGER', title: 'Allocate Your Budget',
        prompt: '₹20,000 · 10 volunteers · 5 days. Split the budget across your Community Science Exhibition.',
        type: 'budget', visualKind: 'scene',
        categories: [
          { label: 'Venue', tags: { planning: 1 } },
          { label: 'Publicity', tags: { initiative: 1 } },
          { label: 'Materials', tags: { resourcefulness: 1 } },
          { label: 'Refreshments', tags: { prioritisation: 1 } },
        ],
        tags: { planning: 2, prioritisation: 1 },
      },
      {
        key: 'volunteers', kicker: 'STAGE 2 OF 3', title: 'Three Volunteers Cancel', prompt: 'What is your first move?',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Recruit new volunteers', tags: { initiative: 2 } },
          { label: 'Reassign responsibilities', tags: { leadership: 2 } },
          { label: 'Reduce the event size', tags: { adaptability: 2 } },
          { label: 'Extend work hours', tags: { ownership: 2 } },
        ],
      },
      {
        key: 'sponsor', kicker: 'STAGE 3 OF 3', title: 'A Sponsor Makes an Offer',
        prompt: 'An extra ₹15,000 — if their ads go front and centre. What do you do?',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Accept immediately', tags: { decisionMaking: 2, businessOrientation: 1 } },
          { label: 'Negotiate the branding conditions', tags: { negotiation: 2, strategicThinking: 1 } },
          { label: 'Decline to stay neutral', tags: { ethicalDecisionMaking: 2 } },
          { label: 'Discuss with the committee first', tags: { collaborativeDecisionMaking: 2 } },
        ],
      },
      {
        key: 'venture-opportunity', kicker: 'STEP 1 OF 4 · STARTUP CHALLENGE', title: 'Identify the Opportunity',
        prompt: 'Choose the problem you would like to solve.', type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Students struggle to manage study schedules', tags: { opportunityRecognition: 2, problemSolving: 1 } },
          { label: 'Local businesses need better online visibility', tags: { businessOrientation: 2, opportunityRecognition: 1 } },
          { label: 'Households generate too much plastic waste', tags: { socialInnovation: 2, sustainabilityOrientation: 1 } },
          { label: 'Elderly people find technology difficult to use', tags: { empathy: 2, humanCentredInnovation: 1 } },
        ],
      },
      {
        key: 'venture-action', kicker: 'STEP 2 OF 4', title: 'Your First Action', prompt: 'What would you do first?',
        type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Speak to potential users about their needs', tags: { customerOrientation: 2, problemSolving: 1 } },
          { label: 'Research competitors and similar solutions', tags: { planning: 2, analyticalThinking: 1 } },
          { label: 'Build a quick prototype to test the idea', tags: { initiative: 2, innovation: 1 } },
          { label: 'Form a team with different skills', tags: { leadership: 2, collaboration: 1 } },
        ],
      },
      {
        key: 'venture-investor', kicker: 'STEP 3 OF 4', title: 'An Investor Makes an Offer',
        prompt: 'Funding is on the table — for 40% ownership. What do you do?', type: 'choice', visualKind: 'scene',
        options: [
          { label: 'Accept immediately to secure funding', tags: { riskOrientation: 2, decisionMaking: 1 } },
          { label: 'Negotiate for a smaller share', tags: { negotiation: 2, strategicThinking: 1 } },
          { label: 'Decline and look elsewhere', tags: { independence: 2, riskTolerance: 1 } },
          { label: 'Discuss it with mentors or your team', tags: { collaborativeDecisionMaking: 2, leadership: 1 } },
        ],
      },
      {
        key: 'venture-success', kicker: 'STEP 4 OF 4', title: 'Measuring Success',
        prompt: 'Six months in — which outcome would feel most successful to you?', type: 'choice', visualKind: 'scene',
        options: [
          { label: 'The highest number of satisfied users', tags: { customerOrientation: 2 } },
          { label: 'Generating consistent profits', tags: { businessOrientation: 2 } },
          { label: 'A solution that positively impacts society', tags: { purposeOrientation: 2, socialInnovation: 1 } },
          { label: 'A strong, motivated team', tags: { leadership: 2, peopleOrientation: 1 } },
        ],
      },
    ],
  },
];
const STEPS_TOTAL = QUEST.reduce((n, d) => n + d.steps.length, 0);

const PROFILES = {
  analytical: { name: 'Focused Analyst', summary: 'You like breaking problems into pieces, spotting patterns, and reasoning your way to a solid answer.', next: 'Try a coding project, a math olympiad, or a research-based competition.' },
  creative: { name: 'Curious Creator', summary: "You enjoy exploring ideas, remixing them, and making things that didn't exist before.", next: 'Try a design club, an invention challenge, or a personal creative project.' },
  people: { name: 'Thoughtful Connector', summary: 'You notice how people are feeling and naturally bring different voices together.', next: 'Try peer mentoring, a debate club, or a community initiative.' },
  leadership: { name: 'Decisive Leader', summary: 'You step up when plans change, make calls under pressure, and take ownership of outcomes.', next: 'Try running a school event, a student council role, or leading a group project.' },
  purpose: { name: 'Purpose-Driven Builder', summary: 'You want your work to matter — solving real problems for real people, not just winning.', next: 'Try a social enterprise project, a sustainability initiative, or volunteering.' },
  steady: { name: 'Grounded Planner', summary: 'You bring calm, structure, and adaptability to whatever you are working on.', next: 'Try event planning, running a school club, or a long-term personal project.' },
};
const PROFILE_GROUPS = {
  analytical: ['numericalAbility', 'logicalReasoning', 'criticalThinking', 'planning', 'analyticalThinking'],
  creative: ['creativity', 'innovation', 'openness', 'cognitiveFlexibility'],
  people: ['collaboration', 'empathy', 'communication', 'communicationStyle', 'socialAwareness', 'relationshipManagement', 'peopleOrientation'],
  leadership: ['leadership', 'initiative', 'ownership', 'decisionMaking', 'negotiation'],
  purpose: ['purposeOrientation', 'socialInnovation', 'sustainabilityOrientation', 'humanCentredInnovation'],
  steady: ['conscientiousness', 'adaptability', 'emotionalRegulation', 'riskTolerance', 'independence'],
};

/* ============ state ============ */
const state = {
  view: 'welcome', currentDomain: null, stepInDomain: 0, avatar: AVATARS[0],
  traitScores: {}, careerScores: {}, xp: 0, keys: new Set(), completedSteps: new Set(),
  soundOn: true, audioCtx: null, introTimer: null,
};
function currentStepObj() { return QUEST[state.currentDomain].steps[state.stepInDomain]; }
function isDomainDone(di) { return QUEST[di].steps.every(s => state.completedSteps.has(s.key)); }
function domainStepsDone(di) { return QUEST[di].steps.filter(s => state.completedSteps.has(s.key)).length; }
function allDomainsDone() { return QUEST.every((d, i) => isDomainDone(i)); }
function rankForXp(xp) { return xp >= 240 ? 'Master Explorer' : xp >= 160 ? 'Expert Explorer' : xp >= 80 ? 'Skilled Explorer' : 'Novice Explorer'; }

/* ============ audio + fx ============ */
function playTone(freq = 440, duration = .15, type = 'sine') {
  if (!state.soundOn) return;
  state.audioCtx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const osc = state.audioCtx.createOscillator(), gain = state.audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(.08, state.audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, state.audioCtx.currentTime + duration);
  osc.connect(gain); gain.connect(state.audioCtx.destination);
  osc.start(); osc.stop(state.audioCtx.currentTime + duration);
}
function gainXp(amount) {
  state.xp += amount;
  $('#xp').textContent = state.xp;
  const pill = $('#xpPill');
  pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
}
function toast(title, subtitle, type = '') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type === 'badge' ? '✦' : '+'}</span><span>${title}<small>${subtitle}</small></span>`;
  $('#toastStack').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}
function confettiBurst() {
  const colors = ['#2fd8ff', '#8b7bff', '#ff4fc3', '#ff9a52', '#f5f6fb'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3600);
  }
}

/* ============ motion: card tilt, drag-to-confirm, fly-to-tray ============ */
function wireTilt(el) {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg) translateY(-2px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}

function flyToTray(sourceEl, targetEl, html) {
  const start = sourceEl.getBoundingClientRect();
  const end = targetEl.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'fly-ghost';
  ghost.innerHTML = html;
  ghost.style.left = `${start.left + start.width / 2 - 14}px`;
  ghost.style.top = `${start.top + start.height / 2 - 14}px`;
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    ghost.style.left = `${end.left + end.width / 2 - 14}px`;
    ghost.style.top = `${end.top + end.height / 2 - 14}px`;
    ghost.style.transform = 'scale(.4)';
    ghost.style.opacity = '.2';
  });
  setTimeout(() => ghost.remove(), 480);
}

/* ============ scoring ============ */
function recordTags(tags = {}) {
  Object.entries(tags).forEach(([k, v]) => { state.traitScores[k] = (state.traitScores[k] || 0) + v; });
}
function recordCareer(career = {}) {
  Object.entries(career).forEach(([k, v]) => { state.careerScores[k] = (state.careerScores[k] || 0) + v; });
}
function topEntries(dict, n) {
  return Object.entries(dict).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0).slice(0, n);
}

/* ============ visuals per step kind ============ */
function stepVisual(step) {
  if (step.visualKind === 'map') {
    return `<div class="scene-card map-card">
      <svg viewBox="0 0 200 200" class="map-svg">
        <circle cx="20" cy="180" r="4" class="map-dot start"/>
        <polyline points="20,180 20,140 100,140" class="map-path"/>
        <circle cx="100" cy="140" r="5" class="map-dot end"/>
      </svg>
      <ol class="clue-list">${step.clues.map(c => `<li>${c}</li>`).join('')}</ol>
    </div>`;
  }
  if (step.visualKind === 'vault' || step.visualKind === 'wordlock' || step.visualKind === 'logic') {
    return `<div class="scene-card puzzle-card ${step.visualKind}">${icon(step.visualKind, 'xl')}<p class="puzzle-display">${step.display}</p></div>`;
  }
  if (step.visualKind === 'pattern') {
    return `<div class="scene-card puzzle-card pattern"><div class="sequence">${step.sequence.map(s => `<i>${s}</i>`).join('')}</div></div>`;
  }
  if (step.visualKind === 'people') {
    return `<div class="scene-card people-card">
      <div class="people-row">
        <div class="avatar-face you" style="--pc:${state.avatar.color}">${icon(state.avatar.iconId, 'md')}<small>You</small></div>
        <div class="avatar-face them">${icon('ei', 'md')}<small>${step.themLabel}</small></div>
      </div>
      <div class="speech-bubble">${step.themLine}</div>
    </div>`;
  }
  const domain = QUEST[state.currentDomain];
  return `<div class="scene-card icon-card">${icon(domain.id, 'xl')}<p>${domain.tagline}</p></div>`;
}

/* ============ dialogue: speaker portraits + typewriter ============ */
function speakerFor(step) {
  if (step.speaker === 'riya') return { name: 'Riya', iconId: 'person', color: '#ff9a52' };
  if (step.speaker === 'friend') return { name: 'Your Friend', iconId: 'person', color: '#2fd8ff' };
  const domain = QUEST[state.currentDomain];
  return { name: domain.guideName || 'The Guide', iconId: 'guide', color: domain.guideColor || '#8b7bff' };
}

let activeKeyHandler = null;
function clearActiveKeyHandler() {
  if (activeKeyHandler) { document.removeEventListener('keydown', activeKeyHandler); activeKeyHandler = null; }
}

function typewriter(el, text, onDone) {
  let i = 0;
  el.textContent = '';
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) { clearInterval(timer); onDone && onDone(); }
  }, 16);
  return () => { clearInterval(timer); el.textContent = text; onDone && onDone(); };
}

/* ============ constellation (hybrid HTML + line-svg, no more invisible icons) ============ */
function constellation(nodes, opts = {}) {
  const { decorative = false } = opts;
  if (!nodes.length) nodes = [{ label: 'Explorer', value: 1 }];
  const cx = 50, cy = 50, r = 38;
  const items = nodes.map((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const lines = items.map(n => `<line x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}" class="const-line"/>`).join('');
  const nodeEls = items.map(n => `
    <div class="const-node" style="left:${n.x}%;top:${n.y}%">
      <div class="const-dot">${n.iconId ? icon(n.iconId, 'md') : `<b>${n.value || ''}</b>`}</div>
      <small>${n.label}</small>
    </div>`).join('');
  return `<div class="constellation-wrap">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="const-lines">${lines}</svg>
    <div class="const-core" style="left:${cx}%;top:${cy}%">${decorative ? '✦' : 'YOU'}</div>
    ${nodeEls}
  </div>`;
}

/* ============ render: welcome ============ */
function renderWelcome() {
  return `<section class="step welcome-step">
    <div class="welcome-copy">
      <p class="eyebrow">CAREER EXPLORER ADVENTURE</p>
      <h1>A quest to discover <em>what lights you up.</em></h1>
      <p>Five worlds, twenty small moments — puzzles, choices, and scenarios that mirror real academic and workplace decisions. No marks, no right career, no pressure.</p>
      <button class="primary" id="begin">Begin my quest <span>→</span></button>
      <p class="helper">About 20–25 minutes · play the worlds in any order</p>
    </div>
    <div class="welcome-scene">
      ${constellation(QUEST.map(d => ({ label: d.title, iconId: d.id })), { decorative: true })}
    </div>
  </section>`;
}

/* ============ render: avatar picker ============ */
function renderAvatarPicker() {
  return `<section class="step avatar-step">
    <p class="eyebrow">CHOOSE YOUR EMBLEM</p>
    <h2>Who are you <em>becoming</em>?</h2>
    <p class="step-copy">Pick an emblem to carry with you across the journey. Purely cosmetic — it just makes this adventure feel like yours.</p>
    <div class="avatar-grid">
      ${AVATARS.map(a => `<button class="avatar-choice" data-id="${a.id}" style="--pc:${a.color}">
        <span class="avatar-choice-icon">${icon(a.iconId, 'lg')}</span>
        <b>${a.label}</b>
      </button>`).join('')}
    </div>
  </section>`;
}

/* ============ render: world-entry intro card ============ */
function renderIntro(domain) {
  return `<section class="step intro-step" style="--pc:${state.avatar.color}">
    <div class="intro-icon">${icon(domain.id, 'xl')}</div>
    <p class="intro-line">${domain.intro}</p>
    <div class="intro-bar"><b></b></div>
    <p class="helper">tap to skip</p>
  </section>`;
}

/* ============ overworld: a real drivable 3D career-exploration world ============ */
function stopOverworld() { window.QuestWorld3D?.unmount(); }

function renderOverworld() {
  const remaining = QUEST.filter((d, i) => !isDomainDone(i)).length;
  return `<section class="overworld-screen">
    <p class="eyebrow">EXPLORE YOUR CAREER GALAXY</p>
    <h2>Drive to a world <em>to start exploring.</em></h2>
    <p class="step-copy">${allDomainsDone() ? 'Every world explored — your report is ready.' : `${remaining} world${remaining === 1 ? '' : 's'} left. Arrow keys / WASD to drive, Enter to go in.`}</p>
    <div class="overworld3d" id="overworld3d"><p class="w3d-loading">Loading 3D world…</p></div>
    <div class="owp-controls" id="owpControls">
      <button type="button" data-dir="up">▲</button>
      <div class="owp-controls-row">
        <button type="button" data-dir="left">◀</button>
        <button type="button" data-dir="down">▼</button>
        <button type="button" data-dir="right">▶</button>
      </div>
    </div>
    ${allDomainsDone() ? `<button class="primary" id="see-report">See your explorer report <span>→</span></button>` : ''}
  </section>`;
}

function mountWorld3D(attemptsLeft = 40) {
  const container = $('#overworld3d');
  if (!container || state.view !== 'hub') return;
  if (!window.QuestWorld3D) {
    if (attemptsLeft <= 0) { container.innerHTML = '<p class="w3d-loading">3D world failed to load — check your connection and refresh.</p>'; return; }
    setTimeout(() => mountWorld3D(attemptsLeft - 1), 150);
    return;
  }
  container.innerHTML = '';
  const domainColors = { aptitude: '#8b7bff', personality: '#ff4fc3', interest: '#2fd8ff', ei: '#ff6f91', approach: '#ff9a52' };
  const domains = QUEST.map((d, i) => ({ title: d.title, done: isDomainDone(i), colorHex: domainColors[d.id] }));
  window.QuestWorld3D.mount(container, {
    avatarColorHex: state.avatar.color,
    domains,
    onEnter: i => enterDomain(i),
  });
}

/* ============ render: a quest step ============ */
function renderStep(step) {
  let body = '';
  if (step.type === 'choice') {
    body = `<ul class="rpg-menu" id="rpgMenu">${step.options.map((o, i) => `<li class="rpg-item" data-i="${i}"><span class="cursor">▶</span>${o.label}</li>`).join('')}</ul>`;
  } else if (step.type === 'multiselect') {
    body = `<div class="tile-grid">${step.options.map((o, i) => `<button class="tile" data-i="${i}"><em>${o.icon}</em><b>${o.label}</b></button>`).join('')}</div>
    <div class="tray" id="tray">${Array.from({ length: step.target }).map(() => '<i class="tray-slot"></i>').join('')}</div>
    <div class="choice-footer"><span><b id="count">0</b> of ${step.target} chosen</span><button class="primary" id="ms-continue" disabled>Lock it in →</button></div>`;
  } else if (step.type === 'budget') {
    body = `<div class="budget-rows">${step.categories.map((c, i) => `
      <div class="budget-row">
        <div class="budget-row-head"><span>${c.label}</span><b class="budget-value" data-i="${i}">₹0</b></div>
        <input type="range" class="budget-slider" min="0" max="20000" step="500" value="0" data-i="${i}">
      </div>`).join('')}</div>
      <div class="budget-total"><span>Remaining</span><b id="budget-remaining">₹20,000</b></div>
      <button class="primary" id="budget-continue" disabled>Confirm allocation →</button>`;
  }
  const keysHud = step.key.startsWith('escape-')
    ? `<div class="keys-hud">${[0, 1, 2, 3].map(i => `<i class="${state.keys.has(i) ? 'won' : ''}">🔑</i>`).join('')}</div>` : '';
  const speaker = speakerFor(step);
  return `<section class="step chapter-step">
    ${stepVisual(step)}
    <div class="step-body">
      <p class="eyebrow">${step.kicker}</p>
      ${keysHud}
      <h2>${step.title}</h2>
      <div class="dialogue-box rpg-panel" id="dialogueBox">
        <div class="dlg-portrait" style="--pc:${speaker.color}">${icon(speaker.iconId, 'lg')}</div>
        <div class="dlg-text">
          <b class="dlg-name" style="color:${speaker.color}">${speaker.name}</b>
          <p class="dlg-line" id="dlgLine"></p>
          <span class="dlg-next" id="dlgNext">▼</span>
        </div>
      </div>
      <div class="action-area rpg-panel" id="actionArea" hidden>${body}</div>
    </div>
  </section>`;
}

/* ============ render: report ============ */
function renderReport() {
  const traitTop = topEntries(state.traitScores, 6).filter(([k]) => k !== 'emotionalIntelligence');
  const maxTraitVal = traitTop.length ? traitTop[0][1] : 1;
  const careerTop = topEntries(state.careerScores, 4);
  const eiRaw = state.traitScores.emotionalIntelligence || 0;
  const eiAvg = eiRaw / 2;
  const eiLabel = eiAvg >= 3.5 ? 'High Emotional Intelligence' : eiAvg >= 2.5 ? 'Growing Emotional Intelligence' : eiAvg >= 1.5 ? 'Developing Emotional Intelligence' : 'Early Emotional Awareness';

  let bestGroup = 'analytical', bestScore = -1;
  Object.entries(PROFILE_GROUPS).forEach(([group, keys]) => {
    const score = keys.reduce((sum, k) => sum + (state.traitScores[k] || 0), 0);
    if (score > bestScore) { bestScore = score; bestGroup = group; }
  });
  const profile = PROFILES[bestGroup];
  const strengthLabel = traitTop.slice(0, 2).map(([k]) => labelize(k)).join(' and ') || 'Curiosity and effort';

  return `<section class="report">
    <div class="report-header">
      <p class="eyebrow">YOUR EXPLORER REPORT</p>
      <h2>You are a <em>${profile.name}</em></h2>
      <p class="report-summary">${profile.summary} ${strengthLabel} showed up again and again in your choices.</p>
      <div class="rank-pill">${icon('trophy', 'sm')}<span>${rankForXp(state.xp)} · ${state.xp} XP</span></div>
      <div class="rank-pill avatar-pill" style="--pc:${state.avatar.color}">${icon(state.avatar.iconId, 'sm')}<span>${state.avatar.label}</span></div>
    </div>

    <div class="badge-gallery">${QUEST.map(d => `<div class="badge-earned"><span class="badge-icon">${icon(d.id, 'md')}</span><small>${d.title}</small></div>`).join('')}</div>

    <div class="report-grid">
      <div class="report-card stat-card">
        <b>Stat sheet</b>
        ${traitTop.length ? traitTop.map(([k, v]) => `<div class="stat-row"><span>${labelize(k)}</span><i><b style="width:${Math.round(v / maxTraitVal * 100)}%"></b></i><em>${v}</em></div>`).join('') : '<p class="muted-note">Keep playing to fill in your stats.</p>'}
      </div>
      <div class="report-card ei-card">
        <b>Emotional intelligence</b>
        <div class="ei-gauge">${[1, 2, 3, 4].map(n => `<i class="${eiAvg >= n - 0.5 ? 'lit' : ''}"></i>`).join('')}</div>
        <p>${eiLabel} — based on how you responded to teammates under pressure.</p>
      </div>
      <div class="report-card career-card">
        <b>Career directions to explore</b>
        <div class="career-list">${careerTop.length ? careerTop.map(([k]) => `<span class="career-chip">${k}</span>`).join('') : '<p class="muted-note">Play the Career Interest world to unlock this.</p>'}</div>
      </div>
      <div class="report-card next-card">
        <b>A good next quest</b>
        <p>${profile.next}</p>
      </div>
    </div>

    <div class="report-footer"><button class="text-button" id="back-hub">← Back to worlds</button><button class="text-button" id="restart">Play again from the start</button></div>
  </section>`;
}

/* ============ navigation / engine ============ */
function updateNav() {
  $$('.level-map i').forEach((node, i) => {
    node.classList.toggle('done', isDomainDone(i));
    node.classList.toggle('current', state.view === 'step' && state.currentDomain === i);
  });
  $('#chapter').textContent =
    state.view === 'welcome' ? 'Your adventure awaits' :
    state.view === 'avatar' ? 'Choose your emblem' :
    state.view === 'hub' ? 'Exploring the galaxy' :
    state.view === 'intro' ? `Entering ${QUEST[state.currentDomain].title}` :
    state.view === 'report' ? 'Adventure complete' :
    `${QUEST[state.currentDomain].title} · ${state.stepInDomain + 1} of ${QUEST[state.currentDomain].steps.length}`;
  const doneSteps = state.completedSteps.size;
  $('#completed-count').textContent = `${doneSteps} of ${STEPS_TOTAL}`;
  $('#dash-bar').style.width = `${(doneSteps / STEPS_TOTAL) * 100}%`;
  $('#status').textContent = allDomainsDone() ? 'Completed' : 'In progress';
}

function transitionTo(renderFn) {
  const app = $('#app');
  clearActiveKeyHandler();
  stopOverworld();
  app.classList.add('portal-out');
  setTimeout(() => {
    app.innerHTML = renderFn();
    bindEvents();
    app.classList.remove('portal-out');
    app.classList.add('portal-in');
    app.addEventListener('animationend', () => app.classList.remove('portal-in'), { once: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNav();
  }, 220);
}

function showWelcome() { state.view = 'welcome'; transitionTo(renderWelcome); }
function showAvatarPicker() { state.view = 'avatar'; transitionTo(renderAvatarPicker); }
function showHub() { state.view = 'hub'; state.currentDomain = null; transitionTo(renderOverworld); }
function enterDomain(di) {
  if (isDomainDone(di)) return;
  state.currentDomain = di; state.stepInDomain = 0; state.view = 'intro';
  transitionTo(() => renderIntro(QUEST[di]));
  state.introTimer = setTimeout(skipIntro, 1500);
}
function skipIntro() {
  if (state.view !== 'intro') return;
  clearTimeout(state.introTimer);
  state.view = 'step';
  transitionTo(() => renderStep(currentStepObj()));
}
function showReport(fanfare) {
  state.view = 'report';
  transitionTo(renderReport);
  if (fanfare) {
    setTimeout(() => { confettiBurst(); playTone(523, .15); setTimeout(() => playTone(659, .15), 150); setTimeout(() => playTone(784, .3), 300); }, 480);
  }
}

function advanceStep() {
  state.stepInDomain++;
  const domain = QUEST[state.currentDomain];
  if (state.stepInDomain >= domain.steps.length) {
    toast('Badge unlocked', domain.title + ' complete', 'badge');
    playTone(990, .22, 'triangle');
    const node = $$('.level-map i')[state.currentDomain];
    node?.classList.add('ping');
    setTimeout(() => node?.classList.remove('ping'), 800);
    if (allDomainsDone()) showReport(true); else showHub();
  } else {
    transitionTo(() => renderStep(currentStepObj()));
  }
}
function finishStep(xp, subtitle) {
  state.completedSteps.add(currentStepObj().key);
  gainXp(xp);
  toast(`+${xp} XP`, subtitle, 'xp');
  playTone(660, .12);
  advanceStep();
}

function bindEvents() {
  if (state.view === 'welcome') { $('#begin')?.addEventListener('click', showAvatarPicker); return; }
  if (state.view === 'avatar') { bindAvatarEvents(); return; }
  if (state.view === 'hub') { bindOverworldEvents(); return; }
  if (state.view === 'intro') { $('.intro-step')?.addEventListener('click', skipIntro); return; }
  if (state.view === 'report') { bindReportEvents(); return; }
  bindStepEvents(currentStepObj());
}

function bindAvatarEvents() {
  $$('.avatar-choice').forEach((btn, i) => {
    wireTilt(btn);
    btn.addEventListener('click', () => {
      state.avatar = AVATARS[i];
      const badge = $('#avatarBadge');
      if (badge) { badge.innerHTML = icon(state.avatar.iconId, 'sm'); badge.style.color = state.avatar.color; badge.style.display = 'grid'; }
      showHub();
    });
  });
}

function bindOverworldEvents() {
  mountWorld3D();
  $$('#owpControls button').forEach(btn => {
    const dir = btn.dataset.dir;
    const on = ev => { ev.preventDefault(); window.QuestWorld3D?.setMove(dir, true); };
    const off = () => { window.QuestWorld3D?.setMove(dir, false); };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('pointercancel', off);
  });
  $('#see-report')?.addEventListener('click', () => showReport(false));
}
function bindReportEvents() {
  $('#restart')?.addEventListener('click', () => location.reload());
  $('#back-hub')?.addEventListener('click', showHub);
}

function bindStepEvents(step) {
  const box = $('#dialogueBox');
  const lineEl = $('#dlgLine');
  const nextEl = $('#dlgNext');
  const actionArea = $('#actionArea');
  let typing = true, advanced = false;
  nextEl.style.opacity = '0';
  const skip = typewriter(lineEl, step.prompt, () => { typing = false; nextEl.style.opacity = '1'; });
  box.addEventListener('click', () => {
    if (typing) { skip(); return; }
    if (advanced) return;
    advanced = true;
    box.classList.add('done');
    actionArea.hidden = false;
    actionArea.classList.add('reveal-in');
    bindActionEvents(step);
  });
}

function bindActionEvents(step) {
  if (step.type === 'choice') {
    const items = $$('.rpg-item');
    let sel = 0, locked = false;
    const highlight = () => items.forEach((li, i) => li.classList.toggle('active', i === sel));
    highlight();
    const confirm = i => {
      if (locked) return;
      locked = true;
      const option = step.options[i];
      recordTags(option.tags); recordCareer(option.career);
      if (step.key.startsWith('escape-')) {
        const roomIdx = ['escape-1', 'escape-2', 'escape-3', 'escape-4'].indexOf(step.key);
        if (option.correct) state.keys.add(roomIdx);
      }
      items[i].classList.add('confirmed');
      playTone(880, .1);
      setTimeout(() => finishStep(10, option.correct === true ? 'Nailed it!' : option.correct === false ? 'Nice try!' : 'Choice recorded'), 200);
    };
    items.forEach((li, i) => {
      li.addEventListener('mouseenter', () => { sel = i; highlight(); });
      li.addEventListener('click', () => confirm(i));
    });
    activeKeyHandler = e => {
      if (e.key === 'ArrowDown') { sel = (sel + 1) % items.length; highlight(); playTone(740, .03); }
      else if (e.key === 'ArrowUp') { sel = (sel - 1 + items.length) % items.length; highlight(); playTone(740, .03); }
      else if (e.key === 'Enter' || e.key === ' ') { confirm(sel); }
    };
    document.addEventListener('keydown', activeKeyHandler);
  }
  if (step.type === 'multiselect') {
    const selected = [];
    const renderTray = () => {
      $$('.tray-slot').forEach((slot, i) => {
        const idx = selected[i];
        slot.className = 'tray-slot' + (idx !== undefined ? ' filled' : '');
        slot.textContent = idx !== undefined ? step.options[idx].icon : '';
      });
    };
    $$('.tile').forEach(btn => btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      const pos = selected.indexOf(i);
      if (pos > -1) {
        selected.splice(pos, 1); btn.classList.remove('selected'); renderTray();
      } else if (selected.length < step.target) {
        selected.push(i); btn.classList.add('selected'); playTone(520, .08);
        renderTray();
        const slot = $$('.tray-slot')[selected.length - 1];
        if (slot) { flyToTray(btn, slot, step.options[i].icon); slot.classList.add('pop'); setTimeout(() => slot.classList.remove('pop'), 350); }
      }
      $('#count').textContent = selected.length;
      $('#ms-continue').disabled = selected.length !== step.target;
    }));
    $('#ms-continue').addEventListener('click', () => {
      selected.forEach(i => recordTags(step.options[i].tags));
      finishStep(15, 'Space designed!');
    });
  }
  if (step.type === 'budget') {
    const sliders = $$('.budget-slider');
    const paint = inp => {
      const pct = (inp.value / inp.max) * 100;
      inp.style.background = `linear-gradient(90deg, var(--accent) ${pct}%, var(--surface2) ${pct}%)`;
    };
    const updateAll = () => {
      const total = sliders.reduce((sum, inp) => sum + (+inp.value || 0), 0);
      sliders.forEach(inp => {
        $(`.budget-value[data-i="${inp.dataset.i}"]`).textContent = `₹${(+inp.value).toLocaleString('en-IN')}`;
        paint(inp);
      });
      $('#budget-remaining').textContent = `₹${(20000 - total).toLocaleString('en-IN')}`;
      $('#budget-continue').disabled = total !== 20000;
    };
    sliders.forEach(inp => inp.addEventListener('input', updateAll));
    updateAll();
    $('#budget-continue').addEventListener('click', () => {
      recordTags(step.tags);
      finishStep(20, 'Budget locked in!');
    });
  }
}

/* ============ moving starfield background ============ */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const STAR_COUNT = 170;
  let w, h, dpr, stars = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function makeStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.4,
      vx: (Math.random() - 0.5) * 0.05,
      vy: Math.random() * 0.045 + 0.015,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() < 0.16 ? (Math.random() < 0.5 ? '47,216,255' : '139,123,255') : '245,246,251',
    }));
  }
  resize(); makeStars();
  window.addEventListener('resize', () => { resize(); makeStars(); });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      if (s.x < -2) s.x = w + 2; else if (s.x > w + 2) s.x = -2;
      if (s.y < -2) s.y = h + 2; else if (s.y > h + 2) s.y = -2;
      const twinkle = 0.5 + Math.sin(t * 0.02 + s.phase) * 0.45;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.tint},${twinkle.toFixed(2)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    t++;
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
}
initStarfield();

/* ============ boot ============ */
$$('.level-map i').forEach((node, i) => {
  node.innerHTML = icon(QUEST[i].id);
  node.addEventListener('click', () => { if (!isDomainDone(i)) enterDomain(i); });
});
document.querySelector('#sound').addEventListener('click', event => {
  state.soundOn = !state.soundOn;
  event.currentTarget.textContent = state.soundOn ? '♫' : '♪';
});
transitionTo(renderWelcome);
