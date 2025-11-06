import React from "react";

const NavToggler = ({ targetId }) => {
  return (
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={`#${targetId}`}
      aria-controls={targetId}
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
  );
};

export default NavToggler;


