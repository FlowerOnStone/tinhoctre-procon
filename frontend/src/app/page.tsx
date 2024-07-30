import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-screen-2xl w-full my-6">
      <div className="py-6 px-6 bg-[#FF8B3E]">
        <h1 className="text-3xl font-bold text-white">Chào mừng bạn đến với hệ thống thi tin học trẻ toàn quốc</h1>
      </div>
      <Image src={'/banner_header.jpg'} alt="banner" width={1920} height={1080} className="w-full"></Image>
    </div>
  );
}
