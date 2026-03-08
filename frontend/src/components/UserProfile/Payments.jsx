import { useState } from "react";

function Payments() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  return (
    <div className=" -mt-16 from-gray-100 to-lime-50 rounded-xl p-6">
      {/* ================= HEADER ================= */}
     <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
  <h3 className="text-[18px] sm:text-[22px] md:text-[24px] font-semibold text-gray-700 whitespace-nowrap">
    Payments & Payouts
  </h3>
  <div className="flex-1 h-px bg-[#2B2B2B]" />
</div>

<p className="text-[14px] sm:text-[16px] text-gray-500 mb-6">
  (For buying services/products/courses)
</p>


      {/* ================= PAYMENT METHODS ================= */}
     <div className="mb-8">
  <p className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-3">
    Payment Methods
  </p>

  <div className="space-y-4">
    {/* ADD CARD */}
    <label className="flex items-start sm:items-center gap-2 text-[16px] sm:text-[18px] md:text-[20px]">
      <input type="radio" name="payment" className="mt-1 sm:mt-0" />
      <span>Add credit/debit card</span>
    </label>

    <div className="h-px bg-[#2B2B2B]" />

    {/* CARD ICONS */}
    <div className="flex flex-wrap items-center gap-3">
      <div className="border rounded-md px-3 py-2 bg-white">
        <img src="/visa.png" alt="Visa" className="h-5" />
      </div>

      <div className="border rounded-md px-3 py-2 bg-white">
        <img src="/mastercard.png" alt="Mastercard" className="h-5" />
      </div>

      <div className="border rounded-md px-3 py-2 bg-white">
        <img src="/paypal.svg" alt="PayPal" className="h-5" />
      </div>
    </div>

    {/* UPI */}
    <label className="flex items-start sm:items-center gap-2 text-[16px] sm:text-[18px] md:text-[20px]">
      <input type="radio" name="payment" className="mt-1 sm:mt-0" />
      <span className="flex items-center gap-2">
        Scan and Pay with <img src="/upi.png" alt="upi" className="h-5" />
      </span>
    </label>

    <div className="h-px bg-[#2B2B2B]" />

    <p className="text-[14px] sm:text-[16px] cursor-pointer">
      Click here to Scan
    </p>

    {/* SAVED CARD */}
    <label className="flex items-start sm:items-center gap-2 text-[16px] sm:text-[18px] md:text-[20px]">
      <input type="radio" name="payment" className="mt-1 sm:mt-0" />
      <span>Remove / Set default</span>
    </label>

    <div className="h-px bg-[#2B2B2B]" />

    <p className="text-[16px] sm:text-[18px] text-gray-600">
      abc Bank ****1234
    </p>

    {/* ACTION BUTTONS */}
    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
      <button className="w-full sm:w-[204px] h-[36px] border border-black bg-[#CEFF1B] rounded text-xs font-medium">
        + Add Another Account
      </button>

      <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
        Discard
      </button>
    </div>
  </div>
</div>


      <div className=" text-[20px]">
        <label className=" text-[20px] flex items-center gap-2">
          <input type="radio" name="payment" />
          Add another account
        </label>
      </div>
      <div className="h-px my-4 bg-[#2B2B2B] mb-8" />

      {/* ================= CARD DETAILS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-[16px]">Card Number</label>
          <input
            className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            placeholder="**** **** **** 2345"
          />
        </div>

        <div>
          <label className="text-[16px]">CVV</label>
          <input
            className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            placeholder="CVV"
          />
        </div>

        <div>
          <label className="text-[16px]">Name On Card</label>
          <input
            className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            placeholder="Name on card"
          />
        </div>

        {/* ✅ Expiry Date — SAME LINE & SAME DESIGN */}
        <div>
          <label className="text-[16px]">Expiry Date</label>

          <div className="relative">
            <input
              type="text"
              placeholder="MM / YY"
              value={expiryDate}
              readOnly
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm"
            />

            <span
              onClick={() => setOpenCalendar(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Calendar OUTSIDE grid (best practice) */}
      {openCalendar && (
        <ExpiryCalendar
          onClose={() => setOpenCalendar(false)}
          onSelect={(value) => {
            setExpiryDate(value);
            setOpenCalendar(false);
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 mb-10">
  <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
    Discard
  </button>

  <button className="w-full sm:w-auto px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
    Confirm
  </button>
</div>


      {/* ================= PAYOUT ACCOUNTS ================= */}
      {/* ================= PAYOUT ACCOUNTS ================= */}
      <div className="mb-6">
        <p className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-2">
          Payout Accounts
        </p>

        <p className="text-[14px] sm:text-[16px] md:text-[18px] mb-3 cursor-pointer">
          Add account
        </p>

        <div className="h-px my-4 bg-[#2B2B2B]" />

        {/* ICONS + ACTION */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/visa.png" alt="Visa" className="h-5" />
          </div>

          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/mastercard.png" alt="Mastercard" className="h-5" />
          </div>

          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/3card.png" alt="Card" className="h-5" />
          </div>

          <div className="border rounded-md px-3 py-2 flex items-center bg-white">
            <img src="/4card.png" alt="Card" className="h-5" />
          </div>

          {/* SET PRIMARY */}
          <button className="border rounded-md px-4 py-2 bg-white text-[12px] sm:text-[14px] font-medium hover:bg-[#CEFF1B] transition">
            Set primary payout method
          </button>
        </div>
      </div>

      {/* ================= BILLING ADDRESS ================= */}
      <div className="mb-6">
        <p className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold mb-3">
          Billing Address
        </p>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="text-[14px] sm:text-[16px]">First Name</label>
            <input
              type="text"
              placeholder="First name"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">
              Email for Invoice
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* ADDRESS HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-[18px] sm:text-[20px] font-medium text-gray-700 whitespace-nowrap">
            Address
          </h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>

        {/* ADDRESS DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="text-[14px] sm:text-[16px]">Street Address</label>
            <input
              type="text"
              placeholder="Street, House No, Area"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">City</label>
            <input
              type="text"
              placeholder="City"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">State</label>
            <input
              type="text"
              placeholder="State"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">Country</label>
            <input
              type="text"
              placeholder="Country"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-[14px] sm:text-[16px]">Pincode</label>
            <input
              type="text"
              placeholder="Pincode"
              className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm border border-black">
            Discard
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpiryCalendar({ onClose, onSelect }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [openYear, setOpenYear] = useState(false);

  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      {/* OUTER CARD */}
      <div className="bg-[#F2F2F2] w-[335px] h-[380px] rounded-xl p-3 relative flex items-center justify-center">
        {/* CLOSE */}

        {/* INNER CARD */}
        <div className="bg-[#FEFEFE]/40 w-full h-full rounded-lg p-3 flex flex-col">
          {/* YEAR DROPDOWN */}
          <div className="relative mb-4">
            <div
              onClick={() => setOpenYear(!openYear)}
              className="bg-[#CEFF1B] text-black rounded-md text-center py-1 text-sm font-semibold cursor-pointer"
            >
              {year} :
            </div>

            {openYear && (
              <div className="absolute mt-2 w-full bg-white border rounded-md shadow z-10 max-h-40 overflow-y-auto">
                {years.map((y) => (
                  <div
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setOpenYear(false);
                    }}
                    className={`px-3 py-1 text-sm cursor-pointer transition
                      ${
                        y === year
                          ? "bg-[#CEFF1B] text-black font-semibold"
                          : "hover:bg-[#CEFF1B] hover:text-black"
                      }
                    `}
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MONTH GRID */}
          <div className="grid grid-cols-3 gap-3 flex-1 place-content-center">
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() =>
                  onSelect(
                    `${String(i + 1).padStart(2, "0")} / ${String(year).slice(
                      -2,
                    )}`,
                  )
                }
                className="border rounded-md py-3 text-sm font-medium text-black hover:bg-[#CEFF1B] hover:text-black"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
