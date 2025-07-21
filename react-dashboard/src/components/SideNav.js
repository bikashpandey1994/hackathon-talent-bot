import React from 'react';

const SideNav = ({
  navOpen,
  setNavOpen,
  setShowUploader,
  setShowCustomList,
}) => (
  <nav className={`dashboard-sidenav${navOpen ? ' open' : ''}`}>
    <button
      onClick={() => setNavOpen(false)}
      className="dashboard-sidenav-close"
      aria-label="Close navigation"
    >
      &times;
    </button>
    <ul className="dashboard-sidenav-list">
      <li>
        <a
          href="#"
          onClick={() => {
            setShowUploader(false);
            setNavOpen(false);
            setShowCustomList(false);
          }}
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => {
            setShowUploader(true);
            setNavOpen(false);
            setShowCustomList(false);
          }}
        >
          Upload
        </a>
      </li>
      <li><a href="#">Profile</a></li>
      <li><a href="#">Settings</a></li>
    </ul>
  </nav>
);

export default SideNav;
