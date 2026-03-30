import { motion } from "framer-motion";
import { CloudRain, Wind, Moon, Sun } from "lucide-react";
import { useEmotionalState } from "@/context/EmotionalContext";

export const SensorialControls = () => {
  const { ambientSound, setAmbientSound, calmMode, setCalmMode } = useEmotionalState();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-3"
    >
      {/* Calm Mode Toggle */}
      <button
        onClick={() => setCalmMode(!calmMode)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 border shadow-sm ${
          calmMode 
            ? "bg-slate-800 text-white border-slate-700" 
            : "bg-white/80 text-slate-600 border-white/40 hover:bg-white"
        }`}
        aria-label="Toggle Calm Mode"
      >
        {calmMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        <span className="text-sm font-bold tracking-wide">Calm Mode</span>
      </button>

      {/* Ambient Sound Toggle */}
      <button
        onClick={() => setAmbientSound(!ambientSound)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 border shadow-sm ${
          ambientSound 
            ? "bg-sky-500 text-white border-sky-400" 
            : "bg-white/80 text-slate-600 border-white/40 hover:bg-white"
        }`}
        aria-label="Toggle Ambient Sound"
      >
        {ambientSound ? <CloudRain className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
        <span className="text-sm font-bold tracking-wide">Ambient Sound</span>
      </button>

    </motion.div>
  );
};
