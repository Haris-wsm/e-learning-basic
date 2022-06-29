import React from 'react';
import { NavLink as NavLinkBase } from 'react-router-dom';

export const NavLink = React.forwardRef((props, ref) => {
  return (
    <NavLinkBase
      ref={ref}
      {...props}
      className={({ isActive }) => {
        return `${props.className} ${isActive ? props.activeclassname : ''}`;
      }}
    />
  );
});
