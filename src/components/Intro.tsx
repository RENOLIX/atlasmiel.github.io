import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Intro({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDone, 1000);
  };

  useEffect(() => {
    const auto = setTimeout(dismiss, 5000);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      void video.play().catch(() => undefined);
      video.onended = dismiss;
    }
    return () => clearTimeout(auto);
  }, []);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div key="intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden" onClick={dismiss}>
          <video ref={videoRef} autoPlay playsInline muted loop={false} disablePictureInPicture disableRemotePlayback controlsList="nodownload nofullscreen noremoteplayback" onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none">
            <source src="https://hercules-cdn.com/file_oT7acZg5vjbFCCyZ2McOUYS4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 pointer-events-none">
            {[12, 28, 50, 68, 85].map((left, i) => (
              <motion.div key={i} initial={{ y: "-20%", opacity: 0 }} animate={{ y: "110vh", opacity: [0, 0.7, 0.5, 0] }} transition={{ duration: 2.2 + i * 0.35, delay: 0.2 + i * 0.2, ease: "easeIn" as const, repeat: Infinity, repeatDelay: 1 + i * 0.3 }} className="absolute top-0 w-[2px] rounded-full bg-gradient-to-b from-[oklch(0.85_0.12_70)] to-transparent" style={{ left: `${left}%`, height: `${55 + i * 14}px` }} />
            ))}
          </div>
          <div className="relative z-10 text-center select-none">
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.3 }} className="text-7xl md:text-9xl lg:text-[11rem] font-light text-white leading-none tracking-widest" style={{ fontFamily: "Cormorant Garamond, serif" }}>Atlas</motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.5 }} className="text-7xl md:text-9xl lg:text-[11rem] font-light italic text-[oklch(0.85_0.12_70)] leading-none tracking-widest" style={{ fontFamily: "Cormorant Garamond, serif" }}>Miel</motion.h1>
            </div>
            <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 1.2, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }} className="mt-5 mx-auto h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.12_70)] to-transparent origin-center" style={{ width: "60%" }} />
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }} className="mt-5 text-xs tracking-[0.4em] uppercase text-white/50" style={{ fontFamily: "Montserrat, sans-serif" }}>Pur - Naturel - Algerien</motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
