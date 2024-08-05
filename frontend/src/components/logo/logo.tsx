"use client"

import React from 'react';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <div>
      <Image src="/assets/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} height={90} width={90} alt='IMG1' />
    </div>
  );
}

export default Logo;
