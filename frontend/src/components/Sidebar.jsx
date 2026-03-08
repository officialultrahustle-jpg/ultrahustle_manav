import { useState, useEffect } from "react";

import MobileBottomNav from "./MobileBottomNav";

import {
  LayoutGrid,
  Store,
  Folder,
  Settings,
  ChevronDown,
  Users,
  MessageCircle,
  TrendingUp,
  Maximize2,
  Package,
  FilePlus,
  ShoppingBag,
} from "lucide-react";

/* ================= DATA ================= */

const CREATOR_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  {
    label: "Marketplace",
    icon: Store,
    children: [
      { label: "View Products", icon: Package, highlight: true },
      { label: "Add New Listing", icon: FilePlus },
      { label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    label: "My Team",
    icon: Users,
    children: [
      { label: "Create Team", icon: Maximize2, highlight: true },
      { label: "Add Members", icon: Users },
      { label: "Manage Teams", icon: Users },
    ],
  },
  {
    label: "My Projects",
    icon: Folder,
    children: [{ label: "Active Projects", icon: Folder }],
  },
  { label: "Messages", icon: MessageCircle },
  {
    label: "Growth Tools",
    icon: TrendingUp,
    children: [
      { label: "Analytics & Earnings", icon: TrendingUp },
      { label: "Boost Listings", icon: ShoppingBag },
    ],
  },
  {
    label: "Setting",
    icon: Settings,
    children: [
      { label: "Profile and Setting", icon: Users },
      { label: "Payout / Wallet", icon: ShoppingBag },
      { label: "Contracts", icon: FilePlus },
    ],
  },
];

const CLIENT_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  {
    label: "Marketplace",
    icon: Store,
    children: [{ label: "Browse" }, { label: "My Orders" }],
  },
  {
    label: "My Projects",
    icon: Folder,
    children: [{ label: "Active Projects" }],
  },
  { label: "Messages", icon: MessageCircle },
];

/* ================= COMPONENT ================= */

export default function Sidebar({
  expanded,
  setExpanded,
  showSettings,
  setShowSettings,
  activeSetting,
  onSectionChange,
  forceClient,
  theme,
  setTheme,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [userType, setUserType] = useState("creator");

  useEffect(() => {
    if (forceClient) {
      setUserType("creator");
      setShowSettings(true);
      setExpanded(true);
      setOpenMenu("Setting");
    }
  }, [forceClient]);

  const SIDEBAR_ITEMS = userType === "creator" ? CREATOR_ITEMS : CLIENT_ITEMS;
  const [isMobile, setIsMobile] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState("Marketplace");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (isMobile) {
      setExpanded(false); // 👈 mobile pe default CLOSED
      setShowSettings(false);
    }
  }, [isMobile]);

  return (
    <>
      {/* ================= MOBILE HAMBURGER ================= */}

      <div className="flex ">
        {/* ================= ICON RAIL ================= */}
        {/* ================= ICON RAIL ================= */}
        {!isMobile && (
          <aside
            className="sidebar w-14 flex flex-col items-center py-4"
            style={{ backgroundColor: "var(--card)" }}
          >
            <button
              onClick={() => setExpanded((p) => !p)}
              className="w-10 h-10 rounded-full flex items-center justify-center mb-6 transition hover:scale-105"
              style={{ backgroundColor: "var(--bg)" }}
            >
              <img src="/switch.svg" alt="toggle sidebar" className="w-5 h-5" />
            </button>

            <div className="flex flex-col space-y-6">
              {SIDEBAR_ITEMS.map((item) => (
                <item.icon
                  key={item.label}
                  size={18}
                  style={{ color: "var(--text)" }}
                />
              ))}
            </div>
          </aside>
        )}

        {/* ================= MAIN SIDEBAR ================= */}
        {/* ===== BACKDROP BLUR (MOBILE ONLY) ===== */}
        {isMobile && expanded && (
          <div
            className="
      fixed inset-0
      backdrop-blur-xl
      bg-black/30
      z-[9998]
    "
            onClick={() => setExpanded(false)}
          />
        )}

        {expanded && (
          <aside
            className={`
      relative
      ${isMobile ? "fixed top-0 left-0 h-screen w-[289px] z-[9999]" : "relative"
              }
      px-6 py-6 flex flex-col
    `}
            style={{ backgroundColor: "var(--card)" }}
          >
            {/* ---- rest of sidebar code ---- */}

            {/* CREATOR / CLIENT TOGGLE */}
            <div className="creator-client-toggle flex bg-[#CEFF1B] rounded-xl p-1 mb-8 mt-2">
              {["creator", "client"].map((t) => {
                const isActive = userType === t;

                return (
                  <button
                    key={t}
                    onClick={() => setUserType(t)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
                    style={{
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      color: "#000000", // ✅ FORCE BLACK (beats var(--text))
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* NAV */}
            <nav className="space-y-4">
              {SIDEBAR_ITEMS.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item.label ? null : item.label)
                    }
                    className="w-full flex items-center font-medium px-3 py-2 rounded-md transition"
                    style={{
                      backgroundColor:
                        theme === "dark" && openMenu === item.label
                          ? "#3A3A3A" // ✅ GREY (as image)
                          : theme === "light" && openMenu === item.label
                            ? "#E8E8E8"
                            : "transparent",
                      color: theme === "dark" ? "#FFFFFF" : "var(--text)",
                    }}
                  >
                    <item.icon size={18} />
                    <span className="ml-4">{item.label}</span>

                    {item.children && (
                      <ChevronDown
                        size={14}
                        className={`ml-auto transition-transform ${openMenu === item.label ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </button>

                  {item.children && openMenu === item.label && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <div
                            key={sub.label}
                            className="flex items-center gap-3 text-sm px-3 py-2 rounded-md cursor-pointer transition"
                            style={{
                              backgroundColor: sub.highlight
                                ? "#CEFF1B"
                                : "transparent",
                              color: sub.highlight ? "#000" : "var(--text)",
                            }}
                          >
                            {Icon && <Icon size={16} />}
                            <span>{sub.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div
              className="w-full px-4 pb-4 mt-2 ml-2"
              style={{
                position: window.innerWidth >= 768 ? "absolute" : "static",
                bottom: window.innerWidth >= 768 ? 0 : undefined,
                left: window.innerWidth >= 768 ? 0 : undefined,
                right: window.innerWidth >= 768 ? 0 : undefined,
              }}
            >
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="
                    relative
                    w-[135px] h-[48px]
                    bg-[#CEFF1B]
                    rounded-full
                    flex items-center
                    transition
                  "
              >
                {/* SLIDER CIRCLE */}
                <div
                  className={`
                      absolute
                      top-[9px]
                      w-[33px] h-[33px]
                      rounded-full
                      flex items-center justify-center
                      shadow-md shadow-black/30
                      transition-all duration-300 ease-in-out

                      ${theme === "dark"
                      ? "left-[96px] bg-[#24272C]"
                      : "left-[6px] bg-[#24272C]"
                    }
                    `}
                >
                  {/* ICON */}
                  {theme === "dark" ? (
                    /* MOON */
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E9EAF0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                    </svg>
                  ) : (
                    /* SUN */
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E9EAF0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </aside>
        )}

        {/* ================= SETTINGS SIDEBAR ================= */}
        {expanded && showSettings && userType === "creator" && !isMobile && (
          <aside
            className="w-[238px] border-l"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="pt-8 space-y-1">
              {[
                "account",
                "profile",
                "security",
                "portfolio",
                "notifications",
                "payments",
                "verification",
                "apps",
                "delete",
              ].map((item) => {
                const isActive = activeSetting === item;

                return (
                  <div
                    key={item}
                    onClick={() => onSectionChange(item)}
                    className="px-5 py-2 text-sm cursor-pointer transition"
                    style={{
                      backgroundColor: isActive ? "#CEFF1B" : "transparent",
                      color:
                        item === "delete"
                          ? "#ef4444"
                          : isActive
                            ? "#000000" // ✅ FIX: active text always black
                            : "var(--text)",
                    }}
                  >
                    {item.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
      {/* ================= MOBILE BOTTOM NAV ================= */}
      {isMobile && (
        <MobileBottomNav
          active={activeBottomTab}
          setActive={setActiveBottomTab}
          theme={theme} // 👈 YE MISSING THA
        />
      )}
    </>
  );
}
