'use client';

import React from 'react';
import Link from 'next/link';

type InteractiveLinkProps = {
  href: string;
  children: React.ReactNode;
};

const InteractiveLink: React.FC<InteractiveLinkProps> = ({ href, children }) => {
  const enableHoverEffect = (e: any) => {
    (e.target).style.backgroundColor = '#14518B';
    (e.target).style.color = 'white';
    (e.target).style.transition = 'color 0.3s, background-color 0.3s';
  };

  const disableHoverEffect = (e: any) => {
    (e.target).style.backgroundColor = 'unset';
    (e.target).style.color = 'unset';
    (e.target).style.transition = 'color 0.3s, background-color 0.3s';
  };

  return (
    <Link href={href}>
      <p
        onMouseEnter={(e) => enableHoverEffect(e)}
        onMouseLeave={(e) => disableHoverEffect(e)}
        style={{ fontSize: 24, fontWeight: 'bold' }}
      >
        {children}
      </p>
    </Link>
  );
};

export default InteractiveLink;
