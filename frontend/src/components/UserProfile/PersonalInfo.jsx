import { useState } from "react";

export default function PersonalInformation() {
  const ABOUT_LIMIT = 700;
  const Hashtag_LIMIT = 100;
  const Availability_LIMIT = 100;
  const TITLE_LIMIT = 40;
  const BIO_LIMIT = 160;

  const [title, setTitle] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [about, setAbout] = useState("");
  const [availability, setAvailability] = useState("");
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
const [stateVal, setStateVal] = useState("");
const [openCountry, setOpenCountry] = useState(false);
const [openState, setOpenState] = useState(false);


const countryOptions = ["India", "United States"];

const stateOptions =
  country === "India"
    ? [
        "Maharashtra",
        "Delhi",
        "Gujarat",
        "Karnataka",
        "Tamil Nadu",
        "Uttar Pradesh",
        "West Bengal",
      ]
    : country === "United States"
    ? ["California", "Texas", "New York", "Florida"]
    : [];


  const [skills, setSkills] = useState([
    "Agile/Scrum",
    "Accessibility",
    "Front-end Development",
    "Product Design",
    "Design Systems",
  ]);
  const [hashtag, setHashtag] = useState([
    "Agile/Scrum",
    "Accessibility",
    "Front-end Development",
    "Product Design",
    "Design Systems",
  ]);
  const availabilityOptions = [
    "Available",
    "Unavailable",
    "Working On A Project",
  ];

  const [tools, setTools] = useState([
    "Figma",
    "Illustrator",
    "Photoshop",
    "Tailwind CSS",
  ]);

  const [languages, setLanguages] = useState([]);

  const [openCalendar, setOpenCalendar] = useState(false);

  /* ---------- TAG INPUT HANDLERS ---------- */
  const handleAddTag = (e, list, setList) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      setList([...list, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const removeTag = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="w-full -mt-14 pb-20">
        {/* ================= PERSONAL INFO ================= */}
        <Section title="Personal Information">
          <TwoCol>
            <Input label="First Name" placeholder="First Name" />
            <Input label="Last Name" placeholder="Last Name" />

            {/* USERNAME */}
            <div>
              <Label>User Name</Label>
              <div className="flex items-center w-full border border-black rounded-md px-3 py-2 text-sm">
                <span className="text-gray-400 mr-1 select-none">@</span>
                <input
                  type="text"
                  placeholder="username"
                  className="flex-1 bg-transparent outline-none focus:shadow-none focus:border-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <Label>Date of Birth</Label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={dob}
                  readOnly
                  className="w-full bg-transparent border border-black rounded-md px-3 py-2 pr-10 text-sm outline-none"
                />

                <span
                  onClick={() => setOpenCalendar(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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

            <Input label="Email Address" placeholder="example@gmail.com" />

            {/* PHONE */}
            <div>
              <Label>Phone Number</Label>
              <div className="flex items-center border border-black rounded-md px-3 py-2 gap-2">
                <span className="text-sm text-gray-700">India</span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-700">+91</span>
                <input
                  type="tel"
                  placeholder="XXXXXXXXXX"
                  className="flex-1 outline-none bg-transparent text-sm pl-2 focus:shadow-none focus:border-transparent focus:outline-none"
                />
              </div>
            </div>

            <Input label="Gender" placeholder="Gender" />
          </TwoCol>
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section title="Address">
          <TwoCol>
            <Input label="Street" placeholder="Street" />
            <Input label="City" placeholder="City" />
       {/* COUNTRY */}
<div>
  <Label>Country</Label>
  <div className="relative">
    <input
      readOnly
      value={country}
      placeholder="Select country"
      onClick={() => setOpenCountry(!openCountry)}
      className="w-full h-[41px] cursor-pointer bg-transparent border border-black rounded-md pl-3 pr-10 text-sm outline-none"
    />

    <img
      src="/Polygon.svg"
      alt="dropdown"
      className={`absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 transition-transform ${
        openCountry ? "rotate-180" : ""
      }`}
    />

    {openCountry && (
      <div className="absolute mt-2 w-full rounded-md border bg-white p-2 space-y-2 z-10">
        {countryOptions.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCountry(c);
              setStateVal("");
              setOpenCountry(false);
            }}
            className="block w-fit border rounded-md px-3 py-1 text-sm"
          >
            {c}
          </button>
        ))}
      </div>
    )}
  </div>
</div>

{/* STATE */}
<div>
  <Label>State</Label>
  <div className="relative">
    <input
      readOnly
      value={stateVal}
      placeholder={country ? "Select state" : "Select country first"}
      onClick={() => country && setOpenState(!openState)}
      className="w-full h-[41px] cursor-pointer bg-transparent border border-black rounded-md pl-3 pr-10 text-sm outline-none"
    />

    <img
      src="/Polygon.svg"
      alt="dropdown"
      className={`absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 transition-transform ${
        openState ? "rotate-180" : ""
      }`}
    />

    {openState && (
      <div className="absolute mt-2 w-full rounded-md border bg-white p-2 space-y-2 z-10">
        {stateOptions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStateVal(s);
              setOpenState(false);
            }}
            className="block w-fit border rounded-md px-3 py-1 text-sm"
          >
            {s}
          </button>
        ))}
      </div>
    )}
  </div>
</div>

            <Input label="Pincode" placeholder="Pincode" />
          </TwoCol>
        </Section>

        {/* ================= BIO ================= */}
        <Section title="Bio">
          <TwoCol>
            {/* TITLE */}
            <div>
              <Label>Title</Label>
              <textarea
                placeholder="Enter your professional title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_LIMIT))}
                rows={3}
                className="w-full bg-transparent border border-black rounded-md p-3 text-sm
                   outline-none resize-none placeholder:text-gray-400"
              />
              <p className="text-xs text-red-500 mt-1">
                {title.length}/{TITLE_LIMIT} characters
              </p>
            </div>

            {/* SHORT BIO */}
            <div>
              <Label>Short Bio</Label>
              <textarea
                placeholder="Add your skills or a short introduction..."
                value={shortBio}
                onChange={(e) =>
                  setShortBio(e.target.value.slice(0, BIO_LIMIT))
                }
                rows={3}
                className="w-full bg-transparent border border-black rounded-md p-3 text-sm
                   outline-none resize-none placeholder:text-gray-400"
              />
              <p className="text-xs text-red-500 mt-1">
                {shortBio.length}/{BIO_LIMIT} characters
              </p>
            </div>
          </TwoCol>
        </Section>

        {/* ================= ABOUT ================= */}
        <Section title="About">
          <textarea
            placeholder="Write a detailed description about yourself..."
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, ABOUT_LIMIT))}
            className="w-full bg-transparent border border-black rounded-md p-3 text-sm
               outline-none resize-none placeholder:text-gray-400"
          />
          <p className="text-xs text-red-500 mt-1">
            {about.length}/{ABOUT_LIMIT} characters
          </p>
        </Section>
        <Section title="Hashtag">
          <TagInput
            placeholder="Add skills"
            tags={skills}
            setTags={setSkills}
            onKeyDown={handleAddTag}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= SKILLS ================= */}
        <Section title="Skills & Expertise">
          <TagInput
            placeholder="Add skills"
            tags={skills}
            setTags={setSkills}
            onKeyDown={handleAddTag}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= TOOLS ================= */}
        <Section title="Tools & Technologies">
          <TagInput
            placeholder="Add tools"
            tags={tools}
            setTags={setTools}
            onKeyDown={handleAddTag}
            onRemove={removeTag}
          />
        </Section>

       <Section title="Availability">
  <div className="relative">
    {/* Input */}
    <input
      value={availability}
      placeholder="Availability"
      readOnly
      onClick={() => setOpen(!open)}
      className="w-full h-[41px] cursor-pointer
      bg-transparent
      border border-black dark:border-white
      rounded-md px-3 text-sm outline-none
      text-black dark:text-white"
    />

    {/* Arrow */}
    <img
      src="/Polygon.svg"
      alt="dropdown"
      className={`absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none transition-transform
      ${open ? "rotate-180" : ""}`}
    />

    {/* Dropdown (MATCHES Language Dropdown) */}
    {open && (
      <div
        className="absolute mt-2 w-full rounded-md border
        border-gray-200 dark:border-gray-700
        bg-white dark:bg-[#1E1E1E]
        p-2 space-y-2 z-10"
      >
        {["Available", "Unavailable", "Working on a project"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setAvailability(item);
              setOpen(false);
            }}
            className={`block w-fit rounded-md border px-3 py-1 text-sm transition
            ${
              availability === item
                ? "border-black dark:border-white bg-white dark:bg-[#2B2B2B]"
                : "border-gray-300 dark:border-gray-600  hover:dark:text-white"
            }
            text-black dark:text-white`}
          >
            {item}
          </button>
        ))}
      </div>
    )}
  </div>
</Section>


        {/* ================= LANGUAGES ================= */}
        <Section title="Languages">
          <TagSelect
            options={[
              "Hindi",
              "English",
              "Tamil",
              "Telugu",
              "Marathi",
              "Gujarati",
              "Punjabi",
              "Bengali",
              "Kannada",
              "Malayalam",
            ]}
            tags={languages}
            setTags={setLanguages}
            onRemove={removeTag}
          />
        </Section>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-4 mt-10">
          <button className="px-4 py-2 rounded-lg text-sm border border-black">
            Discard
          </button>
          <button className="px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
            Save Changes
          </button>
        </div>
      </div>
      {/* ================= CALENDAR MODAL ================= */}
      {openCalendar && (
        <Calendar
          onClose={() => setOpenCalendar(false)}
          onSelect={(date) => {
            setDob(date);
            setOpenCalendar(false);
          }}
        />
      )}
    </>
  );
}

/* ================= CALENDAR ================= */


function Calendar({ onClose, onSelect }) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [openYear, setOpenYear] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const years = Array.from({ length: 101 }, (_, i) => 1950 + i);

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const changeMonth = (dir) => {
    if (dir === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear(y => y - 1);
      } else setMonth(m => m - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear(y => y + 1);
      } else setMonth(m => m + 1);
    }
  };

  const formatDate = (d) =>
    `${String(d).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 dark:bg-black/70 flex items-center justify-center">
      {/* OUTER CARD */}
      <div className="bg-white dark:bg-[#2B2B2B] w-[335px] h-[350px] rounded-xl p-3 shadow-lg">

        {/* INNER CARD */}
        <div className="bg-white dark:bg-[#2B2B2B] border border-[#CEFF1B] w-full h-full rounded-lg p-3 flex flex-col text-black dark:text-black">

          {/* YEAR DROPDOWN */}
          <div className="relative mb-6">
            <div
              onClick={() => setOpenYear(!openYear)}
              className="bg-[#CEFF1B] text-black rounded-md text-center py-1 text-sm font-semibold cursor-pointer"
            >
              {year} :
            </div>

            {openYear && (
              <div className="absolute mt-2 w-full bg-white dark:bg-[#1E1E1E] border border-[#CEFF1B]/40 rounded-md shadow z-10 max-h-40 custom-scroll overflow-y-auto">
                {years.map((y) => (
                  <div
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setOpenYear(false);
                    }}
                    className={`px-3 py-1 text-sm cursor-pointer ${
                      y === year
                        ? "bg-[#CEFF1B] text-black font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-[#CEFF1B]"
                    }`}
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MONTH HEADER */}
          <div className="flex justify-between items-center text-sm font-medium -mt-2 mb-2 px-1">
            <span onClick={() => changeMonth("prev")} className="cursor-pointer">‹</span>
            <span>{months[month]} {year}</span>
            <span onClick={() => changeMonth("next")} className="cursor-pointer">›</span>
          </div>

          {/* WEEK */}
          <div className="grid grid-cols-7 text-[10px] text-gray-600 dark:text-gray-400 mb-2">
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-2 text-sm flex-1">

            {/* PREVIOUS MONTH DAYS */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={i}
                className="text-center text-gray-400 dark:text-gray-600"
              >
                {prevMonthDays - firstDay + i + 1}
              </div>
            ))}

            {/* CURRENT MONTH DAYS */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const formatted = formatDate(day);
              const isSelected = selectedDate === formatted;

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDate(formatted);
                    onSelect(formatted);
                  }}
                  className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition
                    ${
                      isSelected
                        ? "bg-[#CEFF1B] text-black font-bold"
                        : "hover:bg-[#CEFF1B] hover:text-black"
                    }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}




/* ================= REUSABLE UI ================= */

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-xl font-semibold whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-[#2B2B2B]" />
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="block mb-1 font-medium">{children}</label>;
}

function TwoCol({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  );
}

function Input({ label, placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        // this is for the upper
        placeholder={placeholder}
        className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}

function TagInput({ placeholder, tags, setTags, onKeyDown, onRemove }) {
  const clearAll = () => setTags([]);

  return (
    <div className="space-y-3">
      {/* INPUT */}
      <input
        placeholder={placeholder}
        onKeyDown={(e) => onKeyDown(e, tags, setTags)}
        className="w-full bg-transparent border border-black rounded-md px-3 py-2 text-sm outline-none"
      />

      {/* CHIP CONTAINER (input-style) */}
      <div className="flex flex-wrap items-center w-full min-h-[56px] rounded-md px-2 py-2 bg-white dark:bg-[#232323] gap-y-2 gap-x-2 mb-2">
        {/* LEFT: CHIPS */}
        <div className="flex flex-wrap gap-2 flex-1">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="tag-chip flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-gray-100 dark:bg-[#232323]"
            >
              {tag}
              <button
                onClick={() => onRemove(i, tags, setTags)}
                className="text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* RIGHT: BIG CLOSE (container level) */}
        {tags.length > 0 && (
          <button
            onClick={clearAll}
            className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
            title="Clear all"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function TagSelect({ options, tags, setTags, onRemove }) {
  const [open, setOpen] = useState(false);

  const addTag = (value) => {
    if (!tags.includes(value)) {
      setTags([...tags, value]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="relative">
        <input
          readOnly
          placeholder="Select languages"
          onClick={() => setOpen(!open)}
          className="w-full h-[41px] cursor-pointer bg-transparent border border-black rounded-md pl-3 pr-10 text-sm outline-none"
        />

        {/* Right polygon icon (local svg) */}
        <img
          src="/Polygon.svg"
          alt="dropdown"
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute mt-2 w-full rounded-md border border-gray-200 bg-white p-2 space-y-2 z-10 max-h-48 overflow-y-auto">
            {options.map((lang) => (
              <button
                key={lang}
                onClick={() => addTag(lang)}
                disabled={tags.includes(lang)}
                className={`block w-fit rounded-md border px-3 py-1 text-sm transition
                  ${
                    tags.includes(lang)
                      ? "border-black bg-white opacity-50 cursor-not-allowed"
                      : "border-gray-300 "
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected tags */}
      <div className="flex w-full rounded-lg bg-[#FEFEFE] flex-wrap gap-2 p-2 border">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="tag-chip flex items-center gap-2 px-3 py-1 rounded-md text-xs h-8"
          >
            {tag}
            <button
              onClick={() => onRemove(i, tags, setTags)}
              className="text-xs"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
