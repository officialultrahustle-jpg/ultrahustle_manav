// CreateNewContract.jsx
import React, { useMemo, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import Sidebar from "../components/Sidebar";
import "./SoloContractListing.css";
import '../Darkuser.css';

export default function SoloContractListing({ theme = "light", setTheme }) {


  const contractId = useMemo(() => "AUTO-123456", []);
  // ✅ Sidebar state (same as CreateTeam.jsx)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  React.useEffect(() => {
    setSidebarOpen(true);
    setShowSettings(false);
  }, []);

  const [form, setForm] = useState({
    // Basics
    title: "",
    contractType: "",
    soloTeam: false,

    // Parties
    clientUsername: "",
    clientFullName: "",
    clientEmail: "",
    clientCompany: "",

    creatorUsername: "",
    creatorFullName: "",
    creatorEmail: "",
    creatorCompany: "",

    // Scope
    projectSummary: "",
    outOfScope: "",

    // Timeline
    initialDeliveryDeadline: "",
    clientReviewWindow: "",
    includedRevisionRounds: "",
    revisionTurnaroundDays: "",
    lateDeliveryConsequence: "",

    // SLA
    deliverySLA: "",
    communicationSLA: "",
    revisionSLA: "",
    qualityStandards: "",
    clientResponsibilities: "",
    creatorResponsibilities: "",

    // Payment & escrow
    paymentType: "",
    projectCost: "",
    escrowRules: "",

    // Final confirmation
    finalClientName: "",
    finalCreatorName: "",
    clientAgree: false,
    creatorAgree: false,
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onToggle = (key) => () => setForm((p) => ({ ...p, [key]: !p[key] }));

  // Deliverables
  const [deliverableDraft, setDeliverableDraft] = useState({
    title: "",
    format: "",
    qty: "",
    acceptance: "",
  });
  const [deliverables, setDeliverables] = useState([]);

  const onDraftChange = (key) => (e) =>
    setDeliverableDraft((p) => ({ ...p, [key]: e.target.value }));

  const addDeliverable = () => {
    const t = deliverableDraft.title.trim();
    const f = deliverableDraft.format.trim();
    const q = deliverableDraft.qty.trim();
    const a = deliverableDraft.acceptance.trim();
    if (!t && !f && !q && !a) return;

    setDeliverables((p) => [
      ...p,
      {
        id: crypto?.randomUUID?.() || String(Date.now()),
        title: t,
        format: f,
        qty: q,
        acceptance: a,
      },
    ]);
    setDeliverableDraft({ title: "", format: "", qty: "", acceptance: "" });
  };

  // Milestones
  const [milestoneDraft, setMilestoneDraft] = useState({
    name: "Milestone 1",
    amount: "",
    deadline: "",
  });
  const [milestones, setMilestones] = useState([]);

  const onMilestoneDraftChange = (key) => (e) =>
    setMilestoneDraft((p) => ({ ...p, [key]: e.target.value }));

  const addMilestone = () => {
    const name = milestoneDraft.name.trim();
    const amount = milestoneDraft.amount.trim();
    const deadline = milestoneDraft.deadline.trim();
    if (!name && !amount && !deadline) return;

    setMilestones((p) => [
      ...p,
      {
        id: crypto?.randomUUID?.() || String(Date.now()),
        name,
        amount,
        deadline,
      },
    ]);
    setMilestoneDraft({ name: `Milestone ${milestones.length + 2}`, amount: "", deadline: "" });
  };

  const removeMilestone = (id) => setMilestones((p) => p.filter((m) => m.id !== id));

  // Activity log dummy (same UI)
  const activity = useMemo(
    () => [
      { ts: "2025-12-10 10:12", actor: "Client @acme", action: "Created contract", details: "Title: Landing Page Design" },
      { ts: "2025-12-10 11:05", actor: "Team Owner @alpha", action: "Edited milestones", details: "Added Milestone 2 (₹25,000)" },
      { ts: "2025-12-11 09:30", actor: "Team Admin @alpha", action: "Accepted & sent to client", details: "Review window: 3 days" },
      { ts: "2025-12-12 14:02", actor: "Client @acme", action: "Resolution: Funded escrow", details: "Total: ₹75,000" },
    ],
    []
  );

  return (
    <div className={`create-team-page user-page ${theme} min-h-screen relative overflow-hidden`}>
      {/* Navbar */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="pt-[85px] flex relative z-10">
        {/* Sidebar */}
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={(id) => setActiveSetting(id)}
          forceClient={true}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Main Content Wrapper */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* Scrollable Area */}
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <main className="cnc-main">
              <div className="cnc-wrap">
                <h1 className="cnc-title">Create New Contract</h1>

                {/* Contract Basics */}
                <div className="cnc-card">
                  <h2 className="cnc-card-title">Contract Basics</h2>
                  <div className="cnc-grid">
                    <div className="cnc-field">
                      <label className="cnc-label">Contract Title</label>
                      <input
                        className="cnc-input"
                        placeholder="Contract Title"
                        value={form.title}
                        onChange={onChange("title")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Contract Type</label>
                      <div className="cnc-input cnc-input--switchWrap">
                        <input
                          className="cnc-inputInner"
                          placeholder="Solo/ Team service"
                          value={form.contractType}
                          onChange={onChange("contractType")}
                        />
                        <div className="cnc-switchArea">
                          <span className="cnc-switchText">Solo/team</span>
                          <button
                            type="button"
                            className={`cnc-switch ${form.soloTeam ? "is-on" : ""}`}
                            onClick={onToggle("soloTeam")}
                            aria-pressed={form.soloTeam}
                            aria-label="Solo/team toggle"
                          >
                            <span className="cnc-knob" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Contract ID</label>
                      <input className="cnc-input" value={contractId} readOnly />
                    </div>
                    <div className="cnc-field cnc-field--empty" />
                  </div>
                </div>

                {/* Parties Involved */}
                <div className="cnc-card cnc-card--mt">

                  <div className="cnc-twoCards">
                    <div className="cnc-subcard">
                      <h2 className="cnc-card-title">Parties Involved</h2>
                      <div className="cnc-subTop">
                        <div className="cnc-subTitle">Client</div>
                      </div>
                      <div className="cnc-subGrid">
                        <div className="cnc-field">
                          <label className="cnc-label">Client username</label>
                          <input
                            className="cnc-input"
                            placeholder="Client username"
                            value={form.clientUsername}
                            onChange={onChange("clientUsername")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Full name</label>
                          <input
                            className="cnc-input"
                            placeholder="Full name"
                            value={form.clientFullName}
                            onChange={onChange("clientFullName")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Email</label>
                          <input
                            className="cnc-input"
                            placeholder="Email"
                            value={form.clientEmail}
                            onChange={onChange("clientEmail")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Name and company</label>
                          <input
                            className="cnc-input"
                            placeholder="Name and company"
                            value={form.clientCompany}
                            onChange={onChange("clientCompany")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="cnc-subcard">
                      <div className="cnc-subTop">
                        <div className="cnc-subTitle">Service Provider</div>
                      </div>
                      <div className="cnc-subGrid">
                        <div className="cnc-field">
                          <label className="cnc-label">Creator username</label>
                          <input
                            className="cnc-input"
                            placeholder="Creator username"
                            value={form.creatorUsername}
                            onChange={onChange("creatorUsername")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Full name</label>
                          <input
                            className="cnc-input"
                            placeholder="Full name"
                            value={form.creatorFullName}
                            onChange={onChange("creatorFullName")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Email</label>
                          <input
                            className="cnc-input"
                            placeholder="Email"
                            value={form.creatorEmail}
                            onChange={onChange("creatorEmail")}
                          />
                        </div>
                        <div className="cnc-field">
                          <label className="cnc-label">Name and company</label>
                          <input
                            className="cnc-input"
                            placeholder="Country"
                            value={form.creatorCompany}
                            onChange={onChange("creatorCompany")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope and Deliverables */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Scope and Deliverables</h2>
                  <div className="cnc-field">
                    <label className="cnc-label">Project Summary</label>
                    <textarea
                      className="cnc-textarea"
                      placeholder="Short explanation"
                      value={form.projectSummary}
                      onChange={onChange("projectSummary")}
                    />
                  </div>

                  <div className="cnc-deliverables">
                    <div className="cnc-del-title">Deliverables</div>
                    <div className="cnc-del-grid">
                      <div className="cnc-field">
                        <label className="cnc-label">Title</label>
                        <input
                          className="cnc-input"
                          placeholder="Title"
                          value={deliverableDraft.title}
                          onChange={onDraftChange("title")}
                        />
                      </div>
                      <div className="cnc-field">
                        <label className="cnc-label">Format/file type</label>
                        <input
                          className="cnc-input"
                          placeholder="Format/file type"
                          value={deliverableDraft.format}
                          onChange={onDraftChange("format")}
                        />
                      </div>
                      <div className="cnc-field">
                        <label className="cnc-label">Quantity</label>
                        <input
                          className="cnc-input"
                          placeholder="Quantity"
                          value={deliverableDraft.qty}
                          onChange={onDraftChange("qty")}
                        />
                      </div>
                      <div className="cnc-field">
                        <label className="cnc-label">Acceptance Criteria</label>
                        <input
                          className="cnc-input"
                          placeholder="Acceptance Criteria"
                          value={deliverableDraft.acceptance}
                          onChange={onDraftChange("acceptance")}
                        />
                      </div>
                    </div>
                    <button type="button" className="cnc-addBtn" onClick={addDeliverable}>
                      Add Deliverables
                    </button>
                    {deliverables.length > 0 && (
                      <div className="cnc-del-list">
                        {deliverables.map((d) => (
                          <div className="cnc-del-item" key={d.id}>
                            <div className="cnc-del-row">
                              <div className="cnc-del-pill">
                                <b>Title:</b> {d.title || "-"}
                              </div>
                              <div className="cnc-del-pill">
                                <b>Format:</b> {d.format || "-"}
                              </div>
                              <div className="cnc-del-pill">
                                <b>Qty:</b> {d.qty || "-"}
                              </div>
                              <div className="cnc-del-pill">
                                <b>Acceptance:</b> {d.acceptance || "-"}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="cnc-del-remove"
                              onClick={() => removeDeliverable(d.id)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="cnc-field cnc-outScope">
                    <label className="cnc-label">Out of scope</label>
                    <textarea
                      className="cnc-textarea"
                      placeholder="Free text"
                      value={form.outOfScope}
                      onChange={onChange("outOfScope")}
                    />
                  </div>
                </div>

                {/* Timeline and Revisions */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Timeline and Revisions</h2>
                  <div className="cnc-timelineGrid">
                    <div className="cnc-field">
                      <label className="cnc-label">Initial delivery deadline</label>
                      <input
                        className="cnc-input"
                        type="date"
                        value={form.initialDeliveryDeadline}
                        onChange={onChange("initialDeliveryDeadline")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Client review window (1–7 days)</label>
                      <select
                        className="cnc-input cnc-select"
                        value={form.clientReviewWindow}
                        onChange={onChange("clientReviewWindow")}
                      >
                        <option value="">Select one</option>
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                          <option key={n} value={String(n)}>
                            {n} day{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Included revision rounds</label>
                      <select
                        className="cnc-input cnc-select"
                        value={form.includedRevisionRounds}
                        onChange={onChange("includedRevisionRounds")}
                      >
                        <option value="">Select one</option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={String(n)}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Revision turnaround time (days)</label>
                      <select
                        className="cnc-input cnc-select"
                        value={form.revisionTurnaroundDays}
                        onChange={onChange("revisionTurnaroundDays")}
                      >
                        <option value="">Select one</option>
                        {[1, 2, 3, 4, 5, 7, 10, 14, 21, 30].map((n) => (
                          <option key={n} value={String(n)}>
                            {n} day{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="cnc-field cnc-lateConsequence">
                    <label className="cnc-label">Late delivery consequence</label>
                    <select
                      className="cnc-input cnc-select"
                      value={form.lateDeliveryConsequence}
                      onChange={onChange("lateDeliveryConsequence")}
                    >
                      <option value="">Select</option>
                      <option value="discount_5">5% discount</option>
                      <option value="discount_10">10% discount</option>
                      <option value="refund_partial">Partial refund</option>
                      <option value="refund_full">Full refund</option>
                      <option value="extend_deadline">Extend deadline</option>
                    </select>
                  </div>
                </div>

                {/* SLA Snapshot */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">SLA Snapshot</h2>
                  <div className="cnc-slaGrid">
                    <div className="cnc-field">
                      <label className="cnc-label">Delivery SLA</label>
                      <input
                        className="cnc-input"
                        placeholder="Delivery SLA"
                        value={form.deliverySLA}
                        onChange={onChange("deliverySLA")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Communication SLA</label>
                      <input
                        className="cnc-input"
                        placeholder="Communication SLA"
                        value={form.communicationSLA}
                        onChange={onChange("communicationSLA")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Revision SLA</label>
                      <input
                        className="cnc-input"
                        placeholder="Revision SLA"
                        value={form.revisionSLA}
                        onChange={onChange("revisionSLA")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Quality standards</label>
                      <input
                        className="cnc-input"
                        placeholder="Quality standards"
                        value={form.qualityStandards}
                        onChange={onChange("qualityStandards")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Client responsibilities</label>
                      <input
                        className="cnc-input"
                        placeholder="Client responsibilities"
                        value={form.clientResponsibilities}
                        onChange={onChange("clientResponsibilities")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Creator/team responsibilities</label>
                      <input
                        className="cnc-input"
                        placeholder="Creator/team responsibilities"
                        value={form.creatorResponsibilities}
                        onChange={onChange("creatorResponsibilities")}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment and Escrow */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Payment and Escrow</h2>
                  <div className="cnc-payTop">
                    <div className="cnc-field">
                      <label className="cnc-label">Payment Type</label>
                      <select
                        className="cnc-input cnc-select"
                        value={form.paymentType}
                        onChange={onChange("paymentType")}
                      >
                        <option value="">Select one</option>
                        <option value="fixed">Fixed</option>
                        <option value="milestone">Milestone based</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Project cost</label>
                      <input
                        className="cnc-input"
                        placeholder="$50000"
                        value={form.projectCost}
                        onChange={onChange("projectCost")}
                      />
                    </div>
                    <div className="cnc-field">
                      <label className="cnc-label">Escrow Rules</label>
                      <input
                        className="cnc-input"
                        placeholder="Funds lock before work starts. Release after approval or review expiry."
                        value={form.escrowRules}
                        onChange={onChange("escrowRules")}
                      />
                    </div>
                  </div>

                  <div className="cnc-milestones">
                    <div className="cnc-del-title">Milestones</div>
                    <div className="cnc-mil-grid">
                      <div className="cnc-field">
                        <label className="cnc-label">Add Milestone</label>
                        <input
                          className="cnc-input"
                          placeholder="Milestone 1"
                          value={milestoneDraft.name}
                          onChange={onMilestoneDraftChange("name")}
                        />
                      </div>
                      <div className="cnc-field">
                        <label className="cnc-label">Amount</label>
                        <input
                          className="cnc-input"
                          placeholder="$10000"
                          value={milestoneDraft.amount}
                          onChange={onMilestoneDraftChange("amount")}
                        />
                      </div>
                      <div className="cnc-field">
                        <label className="cnc-label">Initial delivery deadline</label>
                        <input
                          className="cnc-input"
                          type="date"
                          value={milestoneDraft.deadline}
                          onChange={onMilestoneDraftChange("deadline")}
                        />
                      </div>
                      <div className="cnc-field cnc-trashWrap">
                        <label className="cnc-label" style={{ opacity: 0 }}>remove</label>
                        <button
                          type="button"
                          className="cnc-trashBtn"
                          disabled
                          title="Remove is available after adding"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                    <button type="button" className="cnc-addBtn" onClick={addMilestone}>
                      + Add Milestone
                    </button>
                    {milestones.length > 0 && (
                      <div className="cnc-mil-list">
                        {milestones.map((m) => (
                          <div className="cnc-mil-item" key={m.id}>
                            <div className="cnc-mil-left">
                              <div className="cnc-del-pill"><b>{m.name || "-"}</b></div>
                              <div className="cnc-del-pill"><b>Amount:</b> {m.amount || "-"}</div>
                              <div className="cnc-del-pill"><b>Deadline:</b> {m.deadline || "-"}</div>
                            </div>
                            <button
                              type="button"
                              className="cnc-trashBtn"
                              onClick={() => removeMilestone(m.id)}
                              aria-label="Remove milestone"
                              title="Remove milestone"
                            >
                              🗑
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="cnc-confirmRow cnc-card--mt">
                  <div className="cnc-confirmCard">
                    <div className="cnc-confirmTitle">Final Confirmation (Client)</div>
                    <div className="cnc-field">
                      <label className="cnc-label">Full Name</label>
                      <input
                        className="cnc-input"
                        placeholder="Full Name"
                        value={form.finalClientName}
                        onChange={onChange("finalClientName")}
                      />
                    </div>
                    <label className="cnc-checkRow">
                      <input
                        type="checkbox"
                        checked={form.clientAgree}
                        onChange={onToggle("clientAgree")}
                      />
                      <span>
                        I accept and agree to the <a href="#">terms and conditions</a>
                      </span>
                    </label>
                    <button type="button" className="cnc-primaryBtn">
                      Ready to fund escrow
                    </button>
                    <div className="cnc-confirmActions">
                      <button type="button" className="cnc-ghostBtn">Send for review</button>
                      <button type="button" className="cnc-ghostBtn">Edit Contract</button>
                    </div>
                  </div>

                  <div className="cnc-confirmCard">
                    <div className="cnc-confirmTitle">Final Confirmation (Creator)</div>
                    <div className="cnc-field">
                      <label className="cnc-label">Full Name</label>
                      <input
                        className="cnc-input"
                        placeholder="Full Name"
                        value={form.finalCreatorName}
                        onChange={onChange("finalCreatorName")}
                      />
                    </div>
                    <label className="cnc-checkRow">
                      <input
                        type="checkbox"
                        checked={form.creatorAgree}
                        onChange={onToggle("creatorAgree")}
                      />
                      <span>
                        I accept and agree to the <a href="#">terms and conditions</a>
                      </span>
                    </label>
                    <button type="button" className="cnc-primaryBtn">
                      Accept contract
                    </button>
                    <div className="cnc-confirmActions">
                      <button type="button" className="cnc-ghostBtn">Cancelled</button>
                      <button type="button" className="cnc-ghostBtn">Decline</button>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="cnc-card cnc-card--mt">
                  <h2 className="cnc-card-title">Activity Log</h2>
                  <div className="cnc-tableWrap">
                    <table className="cnc-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Actor</th>
                          <th>Action</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.map((r, idx) => (
                          <tr key={idx}>
                            <td>{r.ts}</td>
                            <td>{r.actor}</td>
                            <td>{r.action}</td>
                            <td>{r.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
