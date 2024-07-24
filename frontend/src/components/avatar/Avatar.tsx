"use client"

import React from 'react';
import Image from 'next/image';

const Avatar: React.FC = () => {
  return (
    <div style={{ width: '7vh', height: '7vh', overflow: 'hidden', borderRadius: '50%', marginLeft: 10, marginRight: 10 }}>
      <Image src="/assets/meow.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} height={50} width={50} alt='IMG2' />
    </div>
  );
}

export default Avatar;
