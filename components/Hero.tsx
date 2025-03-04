import React from "react";

const Hero = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden mt-[50px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={"/video/ecomVideo.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Hero;
