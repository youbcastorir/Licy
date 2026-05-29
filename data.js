// ============================================================
// data.js — Seed data & constants for StudySphere
// ============================================================

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', emoji: '📐' },
  { id: 'physics', name: 'Physics', emoji: '⚛️' },
  { id: 'chemistry', name: 'Chemistry', emoji: '🧪' },
  { id: 'biology', name: 'Biology', emoji: '🧬' },
  { id: 'cs', name: 'Computer Science', emoji: '💻' },
  { id: 'languages', name: 'Languages', emoji: '🌍' },
  { id: 'economics', name: 'Economics', emoji: '📊' },
  { id: 'history', name: 'History', emoji: '📜' }
];

const MOTIVATIONAL_QUOTES = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Study hard, for the well is deep and our brains are shallow.", author: "Richard Baxter" },
  { text: "A mind once stretched by a new idea never returns to its original dimensions.", author: "Ralph Emerson" }
];

const SAMPLE_POSTS = [
  {
    id: 1, type: 'note', subject: 'Mathematics',
    author: 'Amara K.', country: '🇳🇬',
    title: 'Calculus Derivatives — Quick Reference',
    body: 'Here are the most important derivative rules for your exams: Power rule, Chain rule, Product rule, and Quotient rule with worked examples. Saved me 2 hours of revision!',
    likes: 42, comments: [], date: '2 hours ago', avatar: 'A'
  },
  {
    id: 2, type: 'question', subject: 'Physics',
    author: 'Luca M.', country: '🇮🇹',
    title: "Why does time slow down near massive objects?",
    body: "I'm studying Einstein's General Relativity and I can't wrap my head around gravitational time dilation. Can anyone explain it simply?",
    likes: 28, comments: [
      { author: 'Sara T.', text: 'Think of spacetime as a fabric — heavy objects curve it, and that curvature affects how time flows!' }
    ], date: '4 hours ago', avatar: 'L'
  },
  {
    id: 3, type: 'tip', subject: 'Chemistry',
    author: 'Yuki T.', country: '🇯🇵',
    title: 'Organic Chemistry Exam Tips 🔥',
    body: 'Top 5 tricks for Organic Chem finals: 1) Learn reaction mechanisms, not just products. 2) Draw every structure. 3) Use arrow-pushing. 4) Practice retrosynthesis daily. 5) Group reactions by functional group.',
    likes: 87, comments: [], date: '1 day ago', avatar: 'Y'
  },
  {
    id: 4, type: 'advice', subject: 'Computer Science',
    author: 'Dev P.', country: '🇮🇳',
    title: 'From High School Coder to CS Student — My Journey',
    body: 'Just finished my first year at IIT. Here\'s what I wish I knew: data structures matter more than any framework, contribute to open source early, and don\'t skip math — Linear Algebra will save you in ML.',
    likes: 134, comments: [
      { author: 'Maria G.', text: 'This is gold! Starting CS next year and this is exactly what I needed.' }
    ], date: '2 days ago', avatar: 'D'
  },
  {
    id: 5, type: 'note', subject: 'Biology',
    author: 'Fatima A.', country: '🇸🇦',
    title: 'Cell Division — Mitosis vs Meiosis Summary',
    body: 'Complete comparison table of Mitosis and Meiosis including stages, chromosome count, outcomes, and where each occurs in the body. Great for AP Biology.',
    likes: 56, comments: [], date: '3 days ago', avatar: 'F'
  }
];

const SAMPLE_NOTES = [
  { id: 1, subject: 'Mathematics', title: 'Linear Algebra Cheat Sheet', preview: 'Vectors, matrices, eigenvalues, eigenvectors, dot products, and cross products — all on one page.', author: 'Amara K.', likes: 102, featured: true, date: '1 day ago' },
  { id: 2, subject: 'Physics', title: 'Quantum Mechanics Basics', preview: 'Wave-particle duality, uncertainty principle, Schrödinger equation explained for undergrads.', author: 'Luca M.', likes: 78, featured: false, date: '2 days ago' },
  { id: 3, subject: 'Chemistry', title: 'Periodic Table Patterns', preview: 'Electronegativity, ionization energy, atomic radius trends explained with memory tricks.', author: 'Yuki T.', likes: 65, featured: true, date: '3 days ago' },
  { id: 4, subject: 'Computer Science', title: 'Big O Notation Guide', preview: 'O(1), O(log n), O(n), O(n²) — when to use what, with real code examples in Python.', author: 'Dev P.', likes: 143, featured: false, date: '4 days ago' },
  { id: 5, subject: 'Biology', title: 'DNA Replication Steps', preview: 'Step-by-step breakdown of DNA replication with enzyme names, directions, and common exam questions.', author: 'Fatima A.', likes: 54, featured: false, date: '5 days ago' },
  { id: 6, subject: 'Economics', title: 'Micro vs Macro Concepts', preview: 'Supply & demand, elasticity, GDP, inflation, monetary policy — all core concepts with diagrams.', author: 'Carlos R.', likes: 89, featured: true, date: '1 week ago' }
];

const SAMPLE_GROUPS = [
  { id: 1, name: 'Calculus Crew', subject: 'Mathematics', emoji: '📐', members: 24, desc: 'Daily problem sets and exam prep.' },
  { id: 2, name: 'Quantum Explorers', subject: 'Physics', emoji: '⚛️', members: 18, desc: 'Discussing modern physics concepts together.' },
  { id: 3, name: 'Code & Coffee', subject: 'Computer Science', emoji: '💻', members: 47, desc: 'Algorithms, projects, and interview prep.' },
  { id: 4, name: 'Bio Nerds 🧬', subject: 'Biology', emoji: '🧬', members: 31, desc: 'Pre-med students sharing resources.' },
  { id: 5, name: 'Polyglot Hub', subject: 'Languages', emoji: '🌍', members: 52, desc: 'Language exchange and grammar help.' },
  { id: 6, name: 'History Buffs', subject: 'History', emoji: '📜', members: 15, desc: 'Analysing historical events and essays.' }
];

const SAMPLE_QA = [
  {
    id: 1, status: 'answered', subject: 'Mathematics',
    author: 'Mei L.', avatar: 'M',
    title: "What's the difference between a derivative and an integral?",
    body: "I always confuse these two. Can someone explain with a real-world example?",
    date: '3 hours ago',
    answers: [
      { author: 'Amara K.', text: 'A derivative measures rate of change (like speed), while an integral measures accumulation (like total distance). Speed vs. odometer reading — that\'s the intuition!' }
    ]
  },
  {
    id: 2, status: 'open', subject: 'Chemistry',
    author: 'Omar B.', avatar: 'O',
    title: "How do I balance complex redox reactions?",
    body: "I understand simple ones but get lost with half-reaction methods in acidic vs basic solutions.",
    date: '5 hours ago', answers: []
  },
  {
    id: 3, status: 'answered', subject: 'Computer Science',
    author: 'Sofia K.', avatar: 'S',
    title: "Recursion vs iteration — when to use which?",
    body: "My professor says recursion is elegant but slow. When should I actually use it?",
    date: '1 day ago',
    answers: [
      { author: 'Dev P.', text: 'Use recursion when the problem is naturally recursive (trees, graphs, divide-and-conquer). Use iteration for performance-critical loops. Tail-call optimization can help too!' }
    ]
  }
];

const SAMPLE_LEADERBOARD = [
  { name: 'Dev P.', country: '🇮🇳', xp: 3400, streak: 45, posts: 67, badge: '🏆', subject: 'CS' },
  { name: 'Amara K.', country: '🇳🇬', xp: 2900, streak: 38, posts: 54, badge: '🥈', subject: 'Math' },
  { name: 'Yuki T.', country: '🇯🇵', xp: 2600, streak: 31, posts: 48, badge: '🥉', subject: 'Chem' },
  { name: 'Fatima A.', country: '🇸🇦', xp: 2200, streak: 28, posts: 41, badge: '⭐', subject: 'Bio' },
  { name: 'Luca M.', country: '🇮🇹', xp: 1900, streak: 22, posts: 36, badge: '⭐', subject: 'Physics' },
  { name: 'Sofia K.', country: '🇷🇺', xp: 1600, streak: 19, posts: 29, badge: '⭐', subject: 'CS' },
  { name: 'Carlos R.', country: '🇧🇷', xp: 1400, streak: 15, posts: 24, badge: '🌟', subject: 'Econ' },
  { name: 'Mei L.', country: '🇨🇳', xp: 1200, streak: 12, posts: 18, badge: '🌟', subject: 'Math' }
];

const SAMPLE_FLASHCARDS = [
  { front: "What is Newton's Second Law?", back: "F = ma (Force = mass × acceleration)" },
  { front: "Define DNA", back: "Deoxyribonucleic acid — the molecule carrying genetic instructions" },
  { front: "What is Big O notation?", back: "A way to describe algorithm efficiency as input size grows" },
  { front: "What is supply and demand?", back: "Price of a good is determined by how much is available vs. how much is wanted" },
  { front: "What is the Pythagorean theorem?", back: "a² + b² = c² for right triangles" }
];

const SAMPLE_QUIZ = [
  {
    q: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    answer: 0
  },
  {
    q: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    answer: 1
  },
  {
    q: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: 2
  },
  {
    q: "What does DNA stand for?",
    options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Dynamic Nucleic Acid", "Digital Network Acid"],
    answer: 0
  },
  {
    q: "Who wrote 'The Wealth of Nations'?",
    options: ["Karl Marx", "John Maynard Keynes", "Adam Smith", "David Ricardo"],
    answer: 2
  }
];

const BADGES = [
  { id: 'first_post', icon: '✍️', name: 'First Post', desc: 'Published your first post' },
  { id: 'streak_7', icon: '🔥', name: 'Week Streak', desc: '7-day study streak' },
  { id: 'streak_30', icon: '💎', name: 'Month Streak', desc: '30-day study streak' },
  { id: 'helper', icon: '🤝', name: 'Helper', desc: 'Answered 5 questions' },
  { id: 'scholar', icon: '🎓', name: 'Scholar', desc: 'Reached 1000 XP' },
  { id: 'note_master', icon: '📚', name: 'Note Master', desc: 'Uploaded 10 notes' },
  { id: 'popular', icon: '⭐', name: 'Popular', desc: 'Got 50 likes total' },
  { id: 'early_bird', icon: '🌅', name: 'Early Bird', desc: 'Studied before 7 AM' }
];
