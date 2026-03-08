import { Eye } from "lucide-react";

export default function Security() {
  return (
    <div className="">
      {/* ================= Security ================= */}
      <div className="mb-8 -mt-28 ">
       <div className="flex items-center gap-4 mb-6">
        <h3 className="text-[24px] font-semibold text-[#5C5C5C] whitespace-nowrap">
          Security
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Password */}
          <div>
            <label className="text-[16px] font-bold text-[#2B2B2B]">
              Current password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="********"
                className="w-full bg-transparent border-1 border-black rounded-md px-3 py-2 pr-10 text-sm"
              />
              <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-[16px] font-bold text-[#2B2B2B]">New password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="********"
                className="w-full bg-transparent font-bold border-1 border-black rounded-md px-3 py-2 pr-10 text-sm"
              />
              <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[16px] font-bold text-[#2B2B2B]">
              Confirm New password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="********"
                className="w-full bg-transparent border-1 border-black rounded-md px-3 py-2 pr-10 text-sm"
              />
              <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Button */}
          <div className="flex items-end">
            <button className="ml-auto border-1 border-black bg-[#CEFF1B]  text-[#2B2B2B] text-sm px-4 py-2 rounded-md font-medium">
              Confirm Password
            </button>
          </div>
        </div>
      </div>

      {/* ================= Active Devices ================= */}
      <div>
       <div className="flex items-center gap-4 mb-6">
        <h3 className="text-[24px] font-semibold text-[#5C5C5C] whitespace-nowrap">
          Active Devices
        </h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>
        <p className="mb-4 text-[16px] ">Currently login</p>

        {/* Current Session */}
        <div className="flex bg-transparent  border-1 border-black items-center justify-between bg-white border rounded-md p-4 mb-3">
          <div>
            <p className="text-[16px] font-medium">Windows</p>
            <p className="text-[16px] text-gray-500">Chennai, Tamil Nadu, India</p>
          <p className="text-[16px] text-[#2B2B2B] flex items-center gap-1">
  <span className="text-[#0FB400]">●</span>
  Your Current Session
</p>

          </div>
          <button className="bg-[#FF0000] border border-black text-white text-xs px-4 py-1.5 rounded-lg">
            Log out
          </button>
        </div>

        {/* Other Device */}
        <div className="flex bg-transparent border-1  border-black items-center justify-between bg-white border rounded-md p-4">
          <div>
            <p className="text-[16px] font-medium">1 session on iPhone16</p>
            <p className="text-[16px] text-gray-500">Chennai, Tamil Nadu, India</p>
            <p className="text-[16px] text-gray-400">30 minutes ago</p>
          </div>
          <button className="bg-[#FF0000] border border-black text-white text-xs px-4 py-1.5 rounded-lg">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
