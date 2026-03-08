import { useState, useRef } from "react";

export default function MyPortfolio() {
  const [projects, setProjects] = useState([
    { title: "", desc: "", cost: "" },
    { title: "", desc: "", cost: "" },
    { title: "", desc: "", cost: "" },
  ]);

  const [uploadStep, setUploadStep] = useState(null); // null | grid | success

  const addProject = () => {
    setProjects([...projects, { title: "", desc: "", cost: "" }]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* ================= BLUR WALA PAGE ================= */}
      <div
        className={`ml-auto mt-12 pb-20 transition-all duration-300 my-portfolio ${uploadStep === "success" ? " pointer-events-none select-none" : ""
          }`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold">My Portfolio</h3>
          <div className="flex-1 h-px bg-[#2B2B2B]" />
        </div>

        {/* MAIN */}
        <div className="border-2 border-white rounded-2xl p-6 mb-10">
          <div className="grid md:grid-cols-2 gap-8">

            <div className="relative h-[417px] bg-gray-200 rounded-xl overflow-hidden">

              {/* UPLOAD PHOTO BUTTON */}
              <button
                onClick={() => setUploadStep("grid")}
                className="absolute inset-0 m-auto bg-[#CEFF1B] px-4 py-2 rounded"
              >
                Upload Photo
              </button>

              {/* FULL CIRCLE CLOSE BUTTON */}
              <button
                onClick={() => setUploadStep(null)}
                className="
          absolute top-3 right-3
          w-6 h-6
          flex items-center justify-center
          bg-red-500 text-white
          rounded-full
          text-sm
          shadow-md
          hover:bg-red-600
        "
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">
              <Input label="Title" />
              <Textarea label="Description" limit={150} />
              <Input label="Project cost" />
            </div>

          </div>
        </div>


        {/* GRID */}
        <div className="border-2 border-white rounded-xl p-6 mb-6 flex flex-col">
          {/* SCROLLABLE PROJECTS */}
          <div className="max-h-[520px] overflow-y-auto pr-2 custom-scroll ">
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative h-[250px] bg-gray-200 rounded-xl">
                    <button
                      onClick={() => setUploadStep("grid")}
                      className="absolute inset-0 m-auto bg-[#CEFF1B] px-3 py-1 rounded text-xs"
                    >
                      Change Photo
                    </button>

                    <button
                      onClick={() => removeProject(index)}
                      className="
    absolute top-2 right-2
    w-6 h-6
    flex items-center justify-center
    bg-red-500 text-white
    rounded-full
    text-sm
  "
                    >
                      ✕
                    </button>
                  </div>

                  <Input label="Title" />
                  <Textarea label="Description" />
                  <Input label="Cost" small />
                </div>
              ))}
            </div>
          </div>

          {/* ADD MORE (FIXED INSIDE CARD) */}
          <div className="flex justify-end mt-6 pt-4 border-t border-white/20">
            <button
              onClick={addProject}
              className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded"
            >
              Add more
            </button>
          </div>
        </div>

        {/* ACTIONS (ALWAYS VISIBLE) */}
        <div className="flex justify-end gap-4  bottom-0">
          <button className=" px-4 py-2 border-[0.6px] border-black rounded">Discard</button>
          <button className="bg-[#CEFF1B] border-[0.6px] border-black px-4 py-2 rounded">
            Save Changes
          </button>
        </div>

        {/* UPLOAD GRID */}
        {uploadStep && (
          <UploadGrid
            onBack={() => setUploadStep(null)}
            onSelect={() => setUploadStep("success")}
          />
        )}
      </div>

      {/* ================= SUCCESS MODAL (NO BLUR) ================= */}
      {uploadStep === "success" && (
        <>
          {/* 🔥 BLUR + DARK BACKDROP */}
          <div className="fixed inset-0 z-[998] bg-black/30 backdrop-blur-sm" />

          {/* 🔥 SUCCESS MODAL */}
          <UploadSuccess
            onAddNew={() => setUploadStep("grid")}
            onExplore={() => setUploadStep(null)}
          />
        </>
      )}
    </>
  );
}

/* ================= UPLOAD GRID ================= */

function UploadGrid({ onSelect, onBack, blurred }) {
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [visibleSlots, setVisibleSlots] = useState(9);
  const [activeIndex, setActiveIndex] = useState(null);

  const MAX_FILES = 50;
  const ADD_MORE_COUNT = 3;

  const openPicker = () => fileRef.current?.click();

  // 🔥 Replace-only upload (no auto add)
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (activeIndex === null || selected.length === 0) return;

    setFiles((prev) => {
      const updated = [...prev];
      updated[activeIndex] = selected[0]; // replace
      return updated;
    });

    setActiveIndex(null);
    e.target.value = "";
  };

  return (
    <div className="upload-overlay fixed inset-0 z-40 flex items-center justify-center">
      <div
        className={`upload-card rounded-2xl p-4 w-[820px] max-h-[82vh] flex flex-col transition-all duration-300
        ${blurred ? "blur-sm scale-[0.98] pointer-events-none" : ""}`}
      >
        {/* HEADER */}
        <div className="upload-header flex items-center gap-3 mb-3 shrink-0">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <img src="/backarrow.svg" alt="back" />
          </button>
          <h4 className="text-sm font-medium">Select and upload your file</h4>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 custom-scroll">
          {Array.from({ length: visibleSlots }).map((_, i) => {
            const file = files[i];

            return (
              <div
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  openPicker();
                }}
                className="upload-slot relative h-[110px] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {i === 0 && (
                  <span className="upload-cover-badge absolute top-10 left-16 text-[10px] px-2 py-[2px] rounded z-10">
                    Upload Cover Image
                  </span>
                )}

                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  i !== 0 && (
                    <div className="relative">
                      <img
                        src="/video2.svg"
                        className="w-10 mr-8 mt-2 opacity-60"
                      />
                      <img
                        src="/video1.svg"
                        className="w-12 absolute -right-2 -top-3 opacity-60"
                      />
                      <div className="absolute bottom-4 right-5 w-6 h-6 rounded-full bg-[#CEFF1B] flex items-center justify-center">
                        +
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-3 shrink-0">
          <p className="text-xs text-red-500">
            {files.length === 0
              ? "3 required, up to 50 allowed"
              : `${files.filter(Boolean).length} files selected`}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="upload-btn-cancel px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>

            {files.filter(Boolean).length > 0 && (
              <button
                onClick={() => onSelect(files.filter(Boolean))}
                className="upload-btn-confirm px-5 py-2 rounded-lg text-sm font-medium"
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ================= SUCCESS ================= */

function UploadSuccess({ onAddNew, onExplore }) {
  return (
    <div className="upload-overlay fixed inset-0 z-[999] flex items-center justify-center">
      <div className="upload-success-card rounded-2xl w-[600px] h-[400px] flex flex-col items-center justify-center shadow-xl">
        <div className="w-24 h-24 bg-[#CEFF1B] rounded-full flex items-center justify-center mb-6">
          <img src="/right.svg" alt="" />
        </div>

        <h3 className="text-2xl font-semibold mb-6">
          You have successfully uploaded!
        </h3>

        <div className="flex gap-4">
          <button
            onClick={onAddNew}
            className="upload-btn-cancel px-6 py-2 rounded-lg"
          >
            Add New Listings
          </button>

          <button
            onClick={onExplore}
            className="upload-btn-confirm px-6 py-2 rounded-lg"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUTS ================= */

function Input({ label, placeholder, small }) {
  return (
    <div>
      <label className="block text-lg font-medium mb-1">{label}</label>
      <input
        placeholder={placeholder}
        className={`${small ? "w-40" : "w-full"
          } border border-black rounded-md px-3 py-2 bg-transparent text-sm
           outline-none placeholder:text-gray-400`}
      />
    </div>
  );
}

function Textarea({ label, placeholder, limit }) {
  const [text, setText] = useState("");

  return (
    <div>
      <label className="block text-lg font-medium mb-1">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border border-black rounded-md px-3 py-2 bg-transparent text-sm resize-none
                   outline-none placeholder:text-gray-400"
      />
      {limit && (
        <p className="text-xs text-red-500 mt-1">
          {text.length}/{limit} characters
        </p>
      )}
    </div>
  );
}
