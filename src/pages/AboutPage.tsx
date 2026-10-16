import React from 'react';
import { TeamMember } from '../types/item';

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    fullNameTh: 'นายณัฐพล โพธินาม',
    fullNameEn: 'Natthapon Potinam',
    nickname: 'First',
    studentId: '1660700020',
    role: 'Architect & State Management',
    responsibilities: [
      'Client-Side Routing with React Router v7',
      'Dynamic Route for Item Details Page',
      'Saved Items Collection Page',
      'Zustand Store with Persist Middleware (LocalStorage)',
    ],
    avatarUrl: 'https://media.discordapp.net/attachments/1412324425507799091/1533532226908586326/myprofile.jpg?ex=6ad3b52e&is=6ad263ae&hm=a7df43842fd0683ac85124b5187c13a148b1e87495987975828086f8a9ae1f3a&=&format=webp',
  },
  {
    id: '2',
    fullNameTh: 'นายกฤษภา อินทร์เปื่อย',
    fullNameEn: 'Kitsapa Inpueay',
    nickname: 'Aon',
    studentId: '1660701507',
    role: 'UI/UX Designer & Frontend Engineer',
    responsibilities: [
      'UI/UX Design System with Tailwind CSS & DaisyUI',
      'Explore Items Page (Search, Filters, Layout)',
      'Responsive Design across Mobile, Tablet, and Desktop',
      'Category Icon System & Empty States',
    ],
    avatarUrl: 'https://media.discordapp.net/attachments/1412324425507799091/1560726184541552740/Aon.webp?ex=6ad3c307&is=6ad27187&hm=9b77468cc8644e8904d07eb88d8a6e9dcb6e7bfa5ffd00dbe1b05fee27868d92&=&format=webp',
  },
  {
    id: '3',
    fullNameTh: 'นายชิษณุพงศ์ อินลิน',
    fullNameEn: 'Chidsanupong Inlin',
    nickname: 'Que',
    studentId: '1660707629',
    role: 'Server State & Custom Page Engineer',
    responsibilities: [
      'Mock REST API Data Design (25+ Items in db.json)',
      'TanStack Query v5 Server State & Cache Configuration',
      'Custom Extended Page: Report Item Form Validation',
      'Resolve Item Mutation & Deployment Pipeline',
    ],
    avatarUrl: 'https://media.discordapp.net/attachments/1412324425507799091/1560726190346600568/que.webp?ex=6ad3c308&is=6ad27188&hm=00f32169dce95b882237f6db460ea4f7108d234fdf2afd6a7a8aadf97a57e6c8&=&format=webp',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Project Vision */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="badge badge-primary font-bold uppercase text-xs mb-2">CS319 Project</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content">About FINDIT</h1>
        <p className="text-base text-base-content/75 mt-3 leading-relaxed">
          FINDIT (Smart Lost & Found Hub) is an intelligent platform dedicated to reuniting university students
          and staff with their lost belongings. Engineered with a Modern Decoupled SPA Architecture separating
          Client State from Server State.
        </p>
      </div>

      {/* Team Members Section */}
      <div>
        <h2 className="text-2xl font-black text-center text-base-content mb-8">
          Development Team Members
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="card bg-base-100 shadow-md border border-base-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <figure className="h-56 bg-base-200 overflow-hidden">
                <img
                  src={member.avatarUrl}
                  alt={member.fullNameEn}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body p-6">
                <div className="badge badge-primary badge-outline text-xs font-bold mb-1">
                  ID: {member.studentId}
                </div>
                <h3 className="card-title text-lg font-bold text-base-content">
                  {member.fullNameEn}
                </h3>
                <p className="text-xs text-base-content/70 -mt-1 font-medium">
                  {member.fullNameTh} (Nickname: <span className="font-bold text-primary">{member.nickname}</span>)
                </p>
                <div className="text-xs font-semibold text-secondary mt-1">
                  {member.role}
                </div>

                <div className="divider my-2" />

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                    Responsibilities:
                  </span>
                  <ul className="text-xs text-base-content/80 space-y-1 list-disc list-inside">
                    {member.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Attribution Section */}
      <div className="bg-base-100 p-8 rounded-3xl border border-base-200 shadow-md max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary text-xl">🌐</div>
          <div>
            <h3 className="text-xl font-bold text-base-content">API Attribution & Data Sources</h3>
            <p className="text-xs text-base-content/60">External dependencies and documentation reference</p>
          </div>
        </div>

        <p className="text-sm text-base-content/80 leading-relaxed mb-4">
          This web application operates with a Mock RESTful API built on <strong>JSON Server</strong> adhering to standard HTTP REST guidelines (GET, POST, PATCH). Stock imagery assets are served via the <strong>Unsplash Photography API</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://github.com/typicode/json-server"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-base-200 bg-base-200/40 hover:bg-base-200 transition-colors flex justify-between items-center group"
          >
            <div>
              <div className="font-bold text-sm text-base-content group-hover:text-primary">
                JSON Server Repository
              </div>
              <div className="text-xs text-base-content/60">github.com/typicode/json-server</div>
            </div>
            <span>↗</span>
          </a>

          <a
            href="https://unsplash.com/developers"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-base-200 bg-base-200/40 hover:bg-base-200 transition-colors flex justify-between items-center group"
          >
            <div>
              <div className="font-bold text-sm text-base-content group-hover:text-primary">
                Unsplash Developer API Docs
              </div>
              <div className="text-xs text-base-content/60">unsplash.com/developers</div>
            </div>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};