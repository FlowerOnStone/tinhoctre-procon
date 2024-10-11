'use client';

import React from 'react';
import Image from 'next/image';

const Avatar: React.FC = () => {
  return (
    <div className="w-[7vh] h-[7vh] overflow-hidden rounded-full ml-3 mr-3">
      <Image src="/assets/meow.jpg" className="w-full h-full object-cover" height={50} width={50} alt="IMG2" />
    </div>
  );
};

export default Avatar;
