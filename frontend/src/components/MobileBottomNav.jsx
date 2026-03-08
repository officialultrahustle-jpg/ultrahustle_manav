import { Home, Store, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileBottomNav({ active, setActive, theme = "light" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const items = [
    { label: "Home", icon: Home },
    { label: "Marketplace", icon: Store },
    { label: "Forum", icon: FileText },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`
        fixed bottom-3 left-1/2 -translate-x-1/2
        w-[352px] max-w-[420px]
        backdrop-blur-md
        rounded-2xl
        flex justify-between
        px-3 py-1.5
        shadow-lg
        z-[9999]
        md:hidden
        ${
          isDark
            ? "bg-[#0f1115]/80 border border-[#2a2f3a]"
            : "bg-white/70 border border-[#CEFF1B]"
        }
      `}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.label;

        // Settings button route
        if (item.label === "Settings") {
          return (
            <button
              key={item.label}
              onClick={() => navigate("/user-profile")}
              className="w-full h-[52px] flex items-center justify-center"
            >
              {isActive ? (
                <div className="w-[64px] h-[40px] bg-[#CEFF1B] rounded-lg flex flex-col items-center justify-center">
                  <Icon size={16} color="#000" />
                  <span
                    className={`text-[10px] font-semibold mt-[2px] ${
                      isDark ? "text-[#1a1a1a]" : "text-black"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-[2px]">
                  <Icon
                    size={16}
                    color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"}
                  />
                  <span
                    className={`text-[10px] ${
                      isDark ? "text-white/60" : "text-black/70"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              )}
            </button>
          );
        }

        // Other buttons
        return (
          <button
            key={item.label}
            onClick={() => setActive && setActive(item.label)}
            className="w-full h-[52px] flex items-center justify-center"
          >
            {isActive ? (
              <div className="w-[64px] h-[40px] bg-[#CEFF1B] rounded-lg flex flex-col items-center justify-center">
                <Icon size={16} color="#000" />
                <span
                  className={`text-[10px] font-semibold mt-[2px] ${
                    isDark ? "text-[#1a1a1a]" : "text-black"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[2px]">
                <Icon
                  size={16}
                  color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"}
                />
                <span
                  className={`text-[10px] ${
                    isDark ? "text-white/60" : "text-black/70"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
