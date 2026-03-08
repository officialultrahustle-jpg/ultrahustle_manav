import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/CreateTeam.css';
import UserNavbar from '../components/UserNavbar';
import Sidebar from '../components/Sidebar';
import MyPortfolio from '../components/UserProfile/MyPortfolio';
import '../Darkuser.css';

const CreateTeam = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // ... (rest of the state remains the same, will use replace_file_content specifically for targeted areas)

    teamName: '',
    teamUsername: '',
    title: 'Product Designer & Full-Stack Developer',
    bio: 'Multi-disciplinary team helping brands ship elegant, accessible design systems and modern front-ends.',
    about: 'We are a multi-disciplinary product design and front-end team with 6+ years of experience shipping accessible, modern experiences. We specialize in design systems, tokens, and high-quality component libraries.',
    whatWeDo: '',
    hashtags: ['Agile/Scrum', 'Accessibility', 'Front-end Development', 'Product Design', 'Design Systems'],
    skills: ['Agile/Scrum', 'Accessibility', 'Front-end Development', 'Product Design', 'Design Systems'],
    tools: ['Figma', 'Illustrator', 'Photoshop', 'Tailwind CSS'],
    availability: '',
    languages: ['Hindi', 'Tamil', 'English'],
    rules: ['Professional Conduct', '24hr Response', 'Secure File Handling']
  });

  // Inputs state for adding new tags
  const [inputStates, setInputStates] = useState({
    hashtag: '',
    skill: '',
    tool: '',
    language: '',
    rule: ''
  });

  const LIMITS = {
    teamName: 50,
    teamUsername: 30,
    title: 40,
    bio: 160,
    about: 700,
    whatWeDo: 700
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e, field) => {
    setInputStates(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addTag = (e, field, listName, limit) => {
    if (e.key === 'Enter' && inputStates[field].trim()) {
      if (formData[listName].length < limit) {
        setFormData(prev => ({
          ...prev,
          [listName]: [...prev[listName], inputStates[field].trim()]
        }));
        setInputStates(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const removeTag = (tagToRemove, listName) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(tag => tag !== tagToRemove)
    }));
  };

  const renderCharCounter = (fieldName) => {
    const currentLength = formData[fieldName].length;
    const limit = LIMITS[fieldName];
    return (
      <div className="char-counter">
        You have used {currentLength} Characters out of {limit} Characters
      </div>
    );
  };

  // Mock users for search
  const mockUsers = [
    { id: 1, name: 'Ava Patel', email: 'ava@ultra.dev', avatar: 'AV', color: '#ccff00' },
    { id: 2, name: 'Leo Wang', email: 'leo@ultra.dev', avatar: 'LW', color: '#eee' },
    { id: 3, name: 'Maya Singh', email: 'maya@ultra.dev', avatar: 'MS', color: '#ccff00' },
    { id: 4, name: 'Noah Kim', email: 'Noah@ultra.dev', avatar: 'NO', color: '#ccff00' },
    { id: 5, name: 'Zara Ali', email: 'zara@ultra.dev', avatar: 'ZA', color: '#ccff00' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([4, 5]); // Noah and Zara invited based on image

const [teamMembers, setTeamMembers] = useState([
  { id: 1, name: 'You (Owner)', email: 'you@owner.com', title: 'Title', role: 'Owner', status: 'Joined', avatar: 'YO', isMe: true },
  { id: 2, name: 'Ava Patel', email: 'ava@ultra.dev', title: 'Title', role: 'Contributor', status: 'Pending Invite', avatar: 'A' },
  { id: 3, name: 'Leo wang', email: 'leo@ultra.dev', title: 'Title', role: 'Lead', status: 'Joined', avatar: 'L' },
  { id: 4, name: 'Maya Singh', email: 'maya@ultra.dev', title: 'Title', role: 'Assistant', status: 'Declined', avatar: 'AV' },
  { id: 5, name: 'Alex (External)', email: 'alex@ultra.dev', title: 'Title', role: 'Manager', status: 'Pending Invite', avatar: 'AV' }
]);


  // ✅ Sidebar state (matching User.jsx)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  // State for avatar upload modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarZoom, setAvatarZoom] = useState(50);
  const [selectedAvatarImage, setSelectedAvatarImage] = useState(null);
  const avatarInputRef = React.useRef(null);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setSelectedAvatarImage(null);
    setAvatarZoom(50);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImageClick = () => {
    avatarInputRef.current?.click();
  };

  // Portfolios state is now handled within MyPortfolio component

  // Portfolio functions are now handled within MyPortfolio component

  const toggleInvite = (id) => {
    if (invitedUsers.includes(id)) {
      setInvitedUsers(invitedUsers.filter(u => u !== id));
    } else {
      setInvitedUsers([...invitedUsers, id]);
    }
  };

  function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  const roles = ["Contributor", "Lead", "Assistant", "Manager"];

  React.useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="role-dd">
     <button
  type="button"
  onClick={() => setOpen(!open)}
  className={`role-dd-trigger ${value ? "selected" : ""}`}
>
  <span className="role-dd-chip">{value}</span>
  <img
    src="/Polygon.svg"
    className={`role-dd-arrow ${open ? "rot" : ""}`}
  />
</button>


      {open && (
        <div className="role-dd-menu">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                onChange(r);
                setOpen(false);
              }}
              className={`role-dd-item ${value === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


  return (
    <div
      className={`create-team-page user-page ${theme} min-h-screen relative overflow-hidden`}
    >
      {/* ✅ NAVBAR */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
      />

      <div className="pt-[85px] flex relative z-10">
        {/* ✅ SIDEBAR */}
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={handleSectionChange}
          forceClient={true}
          theme={theme}
          setTheme={setTheme}
        />

        {/* ✅ MAIN CONTENT WRAPPER */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* Scrollable Area */}
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="create-team-container">
              <header className="header-section">
                <h1>Create Your Team</h1>
                <p className=""
                >Build a team of creators and collaborate on services, products, or projects</p>
              </header>

              {/* Avatar Section */}
              <div className="team-avatar-card">
                <div
                  className="relative w-16 h-16 rounded-full bg-[#D9D9D9] cursor-pointer flex items-center justify-center avatar-container"
                  onClick={openAvatarModal}
                >
                  {selectedAvatarImage ? (
                    <img src={selectedAvatarImage} alt="Team Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="avatar-placeholder"></div>
                  )}
                  <span
                    className="
                      absolute
                      bottom-0 right-0
                      w-7 h-7
                      rounded-full
                      flex items-center justify-center
                      shadow-lg
                      bg-white
                      profile-avatar-badge
                    "
                  >
                    <img
                      src="/edit.svg"
                      alt="Edit"
                      className="w-4 h-4"
                    />
                  </span>
                </div>
                <div className="team-display-name">
                  {formData.teamName || "Abigail"}
                </div>
              </div>

              {/* Main Form Section */}
              <div className="team-info-section">
                <div className="section-header">
                  <h2>Team Basic Information</h2>
                  <div className="header-line"></div>
                </div>
                <p className="section-subtext">Visible on your team profile</p>

                <div className="form-grid">
                  {/* Team Name */}
                  <div className="form-group">
                    <label className="form-label">
                      Team Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      className="form-input"
                      placeholder="Team name"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Team Username */}
                  <div className="form-group">
                    <label className="form-label">
                      Team Username <span className="required-star">*</span>
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">@</span>
                      <input
                        type="text"
                        name="teamUsername"
                        className="form-input"
                        placeholder="teamusername"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">
                      Title <span className="required-star">*</span>
                    </label>
                    <textarea
                      name="title"
                      className="form-textarea"
                      placeholder="Product Designer & Full-Stack Developer"
                      onChange={handleInputChange}
                      style={{ minHeight: '80px', resize: 'none' }}
                    />
                    {renderCharCounter('title')}
                  </div>

                  {/* Bio */}
                  <div className="form-group">
                    <label className="form-label">
                      Bio <span className="required-star">*</span>
                    </label>
                    <div className="textarea-wrapper">
                      <textarea
                        name="bio"
                        className="form-textarea scrollable-textarea custom-scroll"
                        placeholder="Multi-disciplinary team helping..."
                        onChange={handleInputChange}
                      />
                    </div>
                    {renderCharCounter('bio')}
                  </div>
                </div>

                {/* About - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    About <span className="required-star">*</span>
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      name="about"
                      className="form-textarea scrollable-textarea custom-scroll"
                      placeholder="We are a multi-disciplinary..."
                      onChange={handleInputChange}
                    />
                  </div>
                  {renderCharCounter('about')}
                </div>

                {/* What We Do - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    What We Do <span className="required-star">*</span>
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      name="whatWeDo"
                      className="form-textarea scrollable-textarea custom-scroll"
                      placeholder="Describe your team, specialties, workflow, and impact."
                      value={formData.whatWeDo}
                      onChange={handleInputChange}
                    />
                  </div>
                  {renderCharCounter('whatWeDo')}
                </div>

                {/* Hashtag Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Hashtag <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Hashtag"
                    value={inputStates.hashtag}
                    onChange={(e) => handleTagInput(e, 'hashtag')}
                    onKeyDown={(e) => addTag(e, 'hashtag', 'hashtags', 15)}
                  />
                  <div className="tags-limit-text">You can add {15 - formData.hashtags.length} hashtag</div>
                  <div className="tags-container">
                    {formData.hashtags.map((tag, index) => (
                      <div key={index} className="tag-pill">
                        {tag}
                        <span className="tag-remove" onClick={() => removeTag(tag, 'hashtags')}>×</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Expertise Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Skills & Expertise <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search Skills & Expertise"
                    value={inputStates.skill}
                    onChange={(e) => handleTagInput(e, 'skill')}
                    onKeyDown={(e) => addTag(e, 'skill', 'skills', 16)}
                  />
                  <div className="tags-limit-text">You can add {16 - formData.skills.length} more skills & expertise</div>
                  <div className="tags-container">
                    {formData.skills.map((tag, index) => (
                      <div key={index} className="tag-pill">
                        {tag}
                        <span className="tag-remove" onClick={() => removeTag(tag, 'skills')}>×</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools & Technologies Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Tools & Technologies <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search Tools & Technologies"
                    value={inputStates.tool}
                    onChange={(e) => handleTagInput(e, 'tool')}
                    onKeyDown={(e) => addTag(e, 'tool', 'tools', 10)}
                  />
                  <div className="tags-limit-text">You can add {10 - formData.tools.length} more tools & technologies</div>
                  <div className="tags-container">
                    {formData.tools.map((tag, index) => (
                      <div key={index} className="tag-pill">
                        {tag}
                        <span className="tag-remove" onClick={() => removeTag(tag, 'tools')}>×</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Availability
                  </label>
                  <select
                    name="availability"
                    className="form-select"
                    value={formData.availability}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled hidden>Select Availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Languages Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Languages
                  </label>
                  <select
                    className="form-select"
                    placeholder="Select Languages"
                    onChange={(e) => {
                      if (e.target.value && formData.languages.length < 10) {
                        setFormData(prev => ({
                          ...prev,
                          languages: [...prev.languages, e.target.value]
                        }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>Select Languages</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                  <div className="tags-limit-text">You can add upto {10 - formData.languages.length} Languages</div>
                  <div className="tags-container">
                    {formData.languages.map((tag, index) => (
                      <div key={index} className="tag-pill">
                        {tag}
                        <span className="tag-remove" onClick={() => removeTag(tag, 'languages')}>×</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">
                    Team Category <span className="required-star">*</span>
                  </label>
                  <select placeholder="Select category"
                    className="form-select">

                    <option value="">Select category</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Content">Content</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              {/* Team Members Section */}
              <div className="team-info-section">
                <div className="section-header">
                  <h2>Team Members</h2>
                  <div className="header-line"></div>
                </div>
                <p className="section-subtext">Invite existing users or external creators. Assign roles directly in the table</p>

                {/* Search */}
                <div className="form-group full-width">
                  <label className="form-label">Search creator by name / email</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="eg., Ava, Mia Malgova, ben@windex.dev"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Results Grid */}
                <div className="search-results-grid">
                  {mockUsers.map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-info">
                        <div className="user-avatar" style={{ backgroundColor: user.color }}>
                          {user.avatar}
                        </div>
                        <div className="user-details">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <button
                        className={`btn-invite ${invitedUsers.includes(user.id) ? 'active' : ''}`}
                        onClick={() => toggleInvite(user.id)}
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>

                {/* Invite Container - wraps both invite email and status table */}
                <div className="invite-container">
                  {/* Invite External */}
                  <div className="invite-external-section">
                    <label className="form-label" style={{ marginBottom: 0 }}>Invite external via email</label>
                    <div className="invite-external-row">
                      <input type="email" className="form-input" placeholder="name@example.com" style={{ flex: 1 }} />
                      <button className="btn-send-invite">Send Invite</button>
                    </div>
                  </div>

                  {/* Invite Status Table */}
                  <div className="invite-status-section">
                    <label className="form-label">Invite Status</label>
                    <table className="status-table">
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Member Title</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map(member => (
                          <tr key={member.id}>
                            <td>
                              <div className="status-member-info">
                                <div className="table-avatar">{member.avatar}</div>
                                <div>
                                  <div className="member-name">{member.name}</div>
                                  <div className="member-email">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <input type="text" className="table-input" placeholder="Title" defaultValue={member.title !== 'Title' ? member.title : ''} />
                            </td>
                           <td>
  {!member.isMe ? (
    <RoleDropdown
      value={member.role}
      onChange={(newRole) => {
        setTeamMembers((prev) =>
          prev.map((m) =>
            m.id === member.id ? { ...m, role: newRole } : m
          )
        );
      }}
    />
  ) : (
    <div className="role-badge owner">Owner</div>
  )}
</td>

                            <td>
                              <span className={`status-badge ${member.status.toLowerCase().replace(' ', '-')}`}>
                                {member.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* My Portfolio Section */}
              <div className="team-info-section">
                <MyPortfolio />
              </div>

              {/* Team Contract & Rules Section */}
              <div className="team-info-section">
                <div className="section-header">
                  <h2>Team Contract & Rules</h2>
                  <div className="header-line"></div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>Team Terms</label>
                  <textarea
                    className="form-textarea"
                    placeholder="This project involves designing a next-generation salon mobile application with AI-powered recommendations, seamless booking experience, and elegant user interface."
                    style={{ height: '120px', resize: 'none' }}
                  ></textarea>
                </div>

                <div className="rules-section">
                  <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>Creator Rules & Expectations</label>
                  <div className="rules-input-row">
                    <input type="text" className="form-input rules-input" placeholder="Add rule and press enter" />
                    <button className="btn-add-rule">+ Add</button>
                  </div>
                  <div className="rules-helper-text">You can add 16 more skills & expertise's</div>

                  <div className="tags-container">
                    {formData.rules.map((tag, index) => (
                      <div key={index} className="tag-pill">
                        {tag}
                        <span className="tag-remove" onClick={() => removeTag(tag, 'rules')}>×</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <button className="btn-discard">Discard</button>
                  <button className="btn-create-team">Create Team</button>
                </div>
              </div>

            </div>
          </div>

          {/* Avatar Upload Modal */}
          {isAvatarModalOpen && (
            <div
              className="
            z-50 flex
            mt-20
            fixed inset-0 items-center justify-center image-modal
          "
            >
              <div
                className="
              flex flex-col
              w-[400px] h-[621px]
              p-8
              rounded-2xl
              image-modal-card relative
            "
              >
                <button
                  onClick={closeAvatarModal}
                  className="
                text-red-500 font-bold
                absolute top-4 right-4
              "
                >
                  ✕
                </button>

                <h3
                  className="
                mb-6
                text-center font-semibold text-gray-800
              "
                >
                  Resize and adjust <br /> your photo
                </h3>

                <div
                  className="
                flex
                w-[330px] h-[368px]
                mb-5
                bg-[#2B2B2B]
                rounded-xl
                items-center justify-center
                relative overflow-hidden
              "
                >
                  {selectedAvatarImage ? (
                    <>
                      <img
                        src={selectedAvatarImage}
                        alt="Preview"
                        className="preview-image w-full h-full object-cover transition-transform duration-200"
                        style={{ transform: `scale(${1 + avatarZoom / 100})` }}
                      />
                      {/* CIRCULAR PREVIEW OVERLAY */}
                      <div
                        className="
                      absolute inset-0
                      pointer-events-none
                      flex items-center justify-center
                    "
                        style={{
                          background: "radial-gradient(circle, transparent 130px, rgba(0,0,0,0.5) 130px)"
                        }}
                      >
                        <div
                          className="
                        w-[300px] h-[300px]
                        rounded-full
                        border-2 border-white/50
                      "
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleSelectImageClick}
                      className="
                    w-[157px] h-[58.41px]
                    text-sm
                    bg-white
                    rounded
                  "
                    >
                      Select Image
                    </button>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <p
                  className="
                mb-2
                text-xs text-center text-red-500
                -mt-6
              "
                >
                  Maximum upload size: 10 MB
                </p>
                <div
                  className="
                flex
                px-4 mb-6
                items-center gap-2
              "
                >
                  {/* MINUS */}
                  <button
                    onClick={() => setAvatarZoom(Math.max(0, avatarZoom - 10))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="filter invert brightness-0">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>

                  {/* RANGE */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={avatarZoom}
                    onChange={(e) => setAvatarZoom(parseInt(e.target.value))}
                    className="
                  w-[279px]
                  accent-[#5C5C5C]
                "
                  />

                  {/* PLUS */}
                  <button
                    onClick={() => setAvatarZoom(Math.min(100, avatarZoom + 10))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="filter invert brightness-0">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>

                <button
                  className="
                w-full
                mt-auto py-3
                font-medium
                bg-[#CEFF1B]
                rounded-md
              "
                  onClick={closeAvatarModal}
                >
                  Upload Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
