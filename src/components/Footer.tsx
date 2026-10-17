import { Link } from 'react-router';
export function Footer() {
  return <footer className="site-footer">
    <Link to="/about" className="footer-brand"><span className="footer-dot" />A little help. A happy reunion.</Link>
    <p>FindIt · Bangkok University · CS319 Project</p>
    <p>Made for our campus community</p>
  </footer>;
}
