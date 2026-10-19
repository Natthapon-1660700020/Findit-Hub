import { useState } from 'react';
import { Icon } from '../components/Icon';
import type { TeamMember } from '../types/item';
const TEAM_MEMBERS: TeamMember[] = [{
  id: '1',
  fullNameTh: 'นายณัฐพล โพธินาม',
  fullNameEn: 'Natthapon Potinam',
  nickname: 'First',
  studentId: '1660700020',
  role: 'Architect & State Management',
  responsibilities: ['Client-side routing with React Router', 'Dynamic Route for Item Details Page', 'Saved Items Collection Page', 'Zustand Store with Persist Middleware (LocalStorage)'],
  avatarUrl: '/picture/First.webp'
}, {
  id: '2',
  fullNameTh: 'นายกฤษภา อินทร์เปื่อย',
  fullNameEn: 'Kitsapa Ainpueai',
  nickname: 'Aon',
  studentId: '1660701507',
  role: 'UI/UX Designer & Frontend Engineer',
  responsibilities: ['UI/UX Design System with Tailwind CSS & DaisyUI', 'Explore Items Page (Search, Filters, Layout)', 'Responsive Design across Mobile, Tablet, and Desktop', 'Category Icon System & Empty States'],
  avatarUrl: '/picture/Aon.webp'
}, {
  id: '3',
  fullNameTh: 'นายชิษณุพงศ์ อินลิน',
  fullNameEn: 'Chisanupong Inlin',
  nickname: 'Que',
  studentId: '1660707629',
  role: 'Server State & Custom Page Engineer',
  responsibilities: ['Mock REST API Data Design (25+ Items in db.json)', 'TanStack Query v5 Server State & Cache Configuration', 'Custom Extended Page: Report Item Form Validation', 'Resolve Item Mutation & Deployment Pipeline'],
  avatarUrl: '/picture/que.webp'
}];
function TeamAvatar({
  member
}: {
  member: TeamMember;
}) {
  const [failed, setFailed] = useState(false);
  return <div className="team-avatar">
    {!failed ? <img src={member.avatarUrl} alt={member.fullNameEn} onError={() => setFailed(true)} /> : <span aria-label={member.fullNameEn}>
      {member.fullNameEn.split(' ').map(p => p[0]).join('')}
    </span>}
  </div>;
}
export function AboutPage() {
  return <div className="page about-page">
    <section className="about-intro">
      <div className="about-mark">
        <Icon name="layers" size={45} />
      </div>
      <div>
        <span className="eyebrow">Our campus. Our community.</span>
        <h1>About FindIt</h1>
        <p>A familiar place for things that went missing. FindIt connects the Bangkok University community, helping students and staff reunite with their belongings — one small act of kindness at a time.</p>
      </div>
    </section>
    <section aria-labelledby="team-title">
      <div className="section-title">
        <Icon name="users" size={27} />
        <h2 id="team-title">Meet the team</h2>
        <p>Three people. One shared purpose.</p>
      </div>
      <div className="team-grid">
        {TEAM_MEMBERS.map(member => <article className="team-card" key={member.id}>
          <TeamAvatar member={member} />
          <h3>
            {member.fullNameEn}
          </h3>
          <p className="team-nickname">{member.nickname} · Student ID {member.studentId}</p>
          <p className="team-role">
            {member.role}
          </p>
          <ul className="team-responsibilities">
            {member.responsibilities.map(r => <li key={r}>
              <Icon name="check" size={13} />
              <span>
                {r}
              </span>
            </li>)}
          </ul>
        </article>)}
      </div>
    </section>
    <section className="attribution" aria-labelledby="api-title">
      <Icon name="code" size={37} />
      <div>
        <h2 id="api-title">Behind the scenes</h2>
        <p>Built for CS319 Internet Programming I, Mini Project 2. Our mock REST API is powered by <a href="https://github.com/typicode/json-server" target="_blank" rel="noopener noreferrer">JSON Server</a>, with sample item photography from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>.</p>
        <div className="attribution-links">
          <a href="https://github.com/typicode/json-server" target="_blank" rel="noopener noreferrer">JSON Server<Icon name="external" size={12} /></a>
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash<Icon name="external" size={12} /></a>
        </div>
      </div>
    </section>
  </div>;
}
