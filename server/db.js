import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'bcs_data.json');

// Default initial state
const defaultState = {
  users: [
    {
      id: 1,
      name: 'System Administrator',
      email: 'admin',
      department: 'Management',
      year: 'Admin',
      phone_whatsapp: '0000000000',
      csn_esn: 'ADMIN-001',
      password: 'admin@123',
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ],
  clubs: [
    {
      id: 1,
      name: "Tech Spectrum",
      easy_meaning: "Coding & Software Innovation",
      category: "Technical",
      description: "The premier technological wing of BC Creative Spectrum. Focuses on full-stack development, software engineering, algorithms, and real-world project development.",
      audition_process: "1. Short online logic & coding assessment.\n2. 10-minute technical interview discussing your project interest.",
      badge_color: "#3b82f6"
    },
    {
      id: 2,
      name: "Nexus Cultural",
      easy_meaning: "Dance, Drama & Stage Arts",
      category: "Cultural",
      description: "The beating heart of expression at BCS. Brings together dancers, actors, stage performers, and theatrical artists for major college events and national fests.",
      audition_process: "1. 1-to-2 minute live solo performance (Dance/Drama/Mono-act).\n2. Brief interaction with cultural leads.",
      badge_color: "#ec4899"
    },
    {
      id: 3,
      name: "Pixel Crafts",
      easy_meaning: "UI/UX, Visual Design & Video",
      category: "Creative",
      description: "Visual storytellers and digital creators. Mastering graphic design, UI/UX wireframing, motion graphics, video editing, and 3D artwork.",
      audition_process: "1. Showcase your portfolio or sample graphics/video reel.\n2. On-spot 20-minute design challenge based on a given prompt.",
      badge_color: "#a855f7"
    },
    {
      id: 4,
      name: "Code Catalyst",
      easy_meaning: "AI, Data Science & Cybersecurity",
      category: "Technical",
      description: "Delving into artificial intelligence, machine learning models, cloud computing, and ethical hacking through hands-on workshops and hackathons.",
      audition_process: "1. Quiz on Python/C++/Data Basics.\n2. Discussion on AI/ML or Security concepts you are passionate about.",
      badge_color: "#06b6d4"
    },
    {
      id: 5,
      name: "Innovators Club",
      easy_meaning: "Entrepreneurship & Leadership",
      category: "Non-Technical",
      description: "Cultivating business minds, startup founders, event organizers, and public relations managers for corporate outreach and fest execution.",
      audition_process: "1. Group discussion on a business case scenario.\n2. Personal interview focusing on leadership and management skills.",
      badge_color: "#eab308"
    },
    {
      id: 6,
      name: "Rhythm & Beats",
      easy_meaning: "Music Production & Vocals",
      category: "Cultural",
      description: "Vocalists, instrumentalists, beatmakers, and audio production enthusiasts organizing live acoustic sessions, bands, and college anthems.",
      audition_process: "1. Perform one song/instrumental piece of your choice (up to 2 mins).\n2. Scale check and pitch assessment.",
      badge_color: "#10b981"
    },
    {
      id: 7,
      name: "Cyber Esports",
      easy_meaning: "Competitive Gaming & Game Dev",
      category: "Gaming",
      description: "Bringing together competitive gamers, tournament shoutcasters, stream managers, and aspiring indie game developers.",
      audition_process: "1. 1v1 or team tactical match evaluation.\n2. Interview on game strategy or game engine knowledge (Unity/Unreal).",
      badge_color: "#f97316"
    },
    {
      id: 8,
      name: "Literary Wave",
      easy_meaning: "Debating, Writing & Journalism",
      category: "Literature",
      description: "The official editorial, debating, and creative writing guild. Editing college magazines, hosting MUNs, debates, and poetry slams.",
      audition_process: "1. 300-word written essay or poem submission.\n2. 2-minute impromptu speaking round (Extempore).",
      badge_color: "#6366f1"
    }
  ],
  registrations: [],
  announcements: [
    {
      id: 1,
      title: "Welcome to BC Creative Spectrum Auditions 2026!",
      description: "Auditions for all 8 clubs are officially open! Registered students can select up to 2 clubs to give auditions. Check the club notices for dates and audition guidelines.",
      image_url: null,
      created_at: new Date().toISOString()
    }
  ]
};

function loadData() {
  if (!fs.existsSync(jsonPath)) {
    saveData(defaultState);
    return defaultState;
  }
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultState;
  }
}

function saveData(data) {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
}

const db = {
  serialize: (cb) => cb && cb(),
  
  get: (query, params, callback) => {
    const data = loadData();
    if (query.includes('FROM users WHERE email = ? AND password = ?')) {
      const user = data.users.find(u => u.email === params[0] && u.password === params[1]);
      callback(null, user);
    } else if (query.includes('FROM users WHERE email = ?')) {
      const user = data.users.find(u => u.email === params[0]);
      callback(null, user);
    } else if (query.includes('COUNT(*) as count FROM clubs')) {
      callback(null, { count: data.clubs.length });
    } else if (query.includes('COUNT(*) as count FROM announcements')) {
      callback(null, { count: data.announcements.length });
    } else if (query.includes('FROM announcements WHERE id = ?')) {
      const ann = data.announcements.find(a => a.id === params[0]);
      callback(null, ann);
    } else if (query.includes('FROM users WHERE role = \'student\'')) {
      const count = data.users.filter(u => u.role === 'student').length;
      callback(null, { studentCount: count });
    } else if (query.includes('FROM registrations')) {
      callback(null, { regCount: data.registrations.length });
    } else {
      callback(null, null);
    }
  },

  all: (query, params, callback) => {
    const data = loadData();
    if (query.includes('FROM clubs ORDER BY id ASC')) {
      callback(null, data.clubs);
    } else if (query.includes('SELECT club_id FROM registrations WHERE user_id = ?')) {
      const regs = data.registrations.filter(r => r.user_id === Number(params[0]));
      callback(null, regs);
    } else if (query.includes('FROM announcements ORDER BY created_at DESC')) {
      const sorted = [...data.announcements].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      callback(null, sorted);
    } else if (query.includes('SELECT c.*, r.created_at as registered_at')) {
      const userId = Number(params[0]);
      const userRegs = data.registrations.filter(r => r.user_id === userId);
      const result = userRegs.map(r => {
        const club = data.clubs.find(c => c.id === r.club_id);
        return { ...club, registered_at: r.created_at };
      });
      callback(null, result);
    } else if (query.includes('GROUP BY c.id')) {
      const breakdown = data.clubs.map(c => {
        const count = data.registrations.filter(r => r.club_id === c.id).length;
        return { name: c.name, count };
      });
      callback(null, breakdown);
    } else if (query.includes('FROM users u') || query.includes('SELECT u.id as')) {
      const result = data.users.filter(u => u.role === 'student').map(u => {
        const userRegs = data.registrations.filter(r => r.user_id === u.id);
        const clubNames = userRegs.map(r => {
          const club = data.clubs.find(c => c.id === r.club_id);
          return club ? club.name : '';
        }).filter(Boolean);

        return {
          "Student ID": u.id,
          "Full Name": u.name,
          "Mail ID": u.email,
          "Department": u.department,
          "Academic Year": u.year,
          "Phone Number (WhatsApp)": u.phone_whatsapp,
          "CSN / ESN": u.csn_esn,
          "Registered Clubs": clubNames.join(', ') || 'None',
          "Account Created Date": u.created_at,
          id: u.id,
          name: u.name,
          email: u.email,
          department: u.department,
          year: u.year,
          phone_whatsapp: u.phone_whatsapp,
          csn_esn: u.csn_esn,
          registered_clubs: clubNames.join(', ') || null,
          created_at: u.created_at
        };
      });
      callback(null, result);
    } else {
      callback(null, []);
    }
  },

  run: function (query, params, callback) {
    const data = loadData();
    let lastID = 0;

    if (query.includes('INSERT INTO users')) {
      const newId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        name: params[0],
        email: params[1],
        department: params[2],
        year: params[3],
        phone_whatsapp: params[4],
        csn_esn: params[5],
        password: params[6],
        role: params[7] || 'student',
        created_at: new Date().toISOString()
      };
      data.users.push(newUser);
      saveData(data);
      lastID = newId;
    } else if (query.includes('INSERT INTO registrations')) {
      const newId = data.registrations.length > 0 ? Math.max(...data.registrations.map(r => r.id)) + 1 : 1;
      const newReg = {
        id: newId,
        user_id: Number(params[0]),
        club_id: Number(params[1]),
        created_at: new Date().toISOString()
      };
      data.registrations.push(newReg);
      saveData(data);
      lastID = newId;
    } else if (query.includes('INSERT INTO announcements')) {
      const newId = data.announcements.length > 0 ? Math.max(...data.announcements.map(a => a.id)) + 1 : 1;
      const newAnn = {
        id: newId,
        title: params[0],
        description: params[1],
        image_url: params[2],
        created_at: new Date().toISOString()
      };
      data.announcements.push(newAnn);
      saveData(data);
      lastID = newId;
    }

    if (callback) {
      callback.call({ lastID }, null);
    }
  },

  prepare: () => ({
    run: () => {},
    finalize: () => {}
  })
};

console.log('BC Creative Spectrum Database Initialized (bcs_data.json)');
export default db;
