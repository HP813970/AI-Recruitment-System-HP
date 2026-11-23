const candidates = [
  {
    id: "a",
    name: "Candidate A",
    role: "Senior Product Designer",
    skills: 92,
    experience: 8,
    experienceFit: 93,
    assessment: 94,
    overall: 93,
    certification: "UX Design Professional Certificate",
    education: "Master of Design",
    work: "Lead Product Designer, 2020–Present",
    skillList: ["Product strategy", "Design systems", "User research", "Prototyping"],
  },
  {
    id: "b",
    name: "Candidate B",
    role: "Senior Product Designer",
    skills: 84,
    experience: 4,
    experienceFit: 83,
    assessment: 81,
    overall: 83,
    certification: "Certified Accessibility Professional",
    education: "Bachelor of Fine Arts",
    work: "Product Designer, 2021–Present",
    skillList: ["Interaction design", "Accessibility", "Prototyping", "User testing"],
  },
  {
    id: "c",
    name: "Candidate C",
    role: "Senior Product Designer",
    skills: 75,
    experience: 3,
    experienceFit: 76,
    assessment: 77,
    overall: 76,
    certification: "UX Design Certificate",
    education: "Bachelor of Design",
    work: "Product Designer, 2022–Present",
    skillList: ["Visual design", "Wireframing", "Prototyping", "Research"],
  },
  {
    id: "d",
    name: "Candidate D",
    role: "Senior Product Designer",
    skills: 68,
    experience: 2,
    experienceFit: 69,
    assessment: 70,
    overall: 69,
    certification: "Interaction Design Certificate",
    education: "Bachelor of Arts",
    work: "Associate Designer, 2023–Present",
    skillList: ["Interface design", "Wireframing", "Usability testing", "Adobe CC"],
  },
];

const state = {
  view: "dashboard",
  selectedId: "a",
  decision: null,
  feedbackSubmitted: false,
  agent: {
    status: "idle",
    messages: [],
  },
};

const app = document.querySelector("#app");

function selectedCandidate() {
  return candidates.find((candidate) => candidate.id === state.selectedId) || candidates[0];
}

function layout(content) {
  return `
    <header class="site-header">
      <button class="site-title" data-view="dashboard">Explainable Recruitment Assistant</button>
      <nav aria-label="Main navigation">
        <button data-view="dashboard" class="${state.view === "dashboard" ? "active" : ""}">Candidates</button>
        <button data-view="profile" class="${state.view === "profile" ? "active" : ""}">Candidate detail</button>
        <button data-view="review" class="${state.view === "review" ? "active" : ""}">Human review</button>
      </nav>
      <span class="student-label">Hiren Patel - 3190710</span>
    </header>
    <main>${content}</main>
  `;
}

function scoreRow(label, value, suffix = "%") {
  return `<div class="score-row"><span>${label}</span><strong>${value}${suffix}</strong></div>`;
}

function candidateCard(candidate, index) {
  const selected = candidate.id === state.selectedId;
  return `
    <article class="candidate-card ${selected ? "selected" : ""}">
      <div class="card-top">
        <span class="rank">Rank ${index + 1}</span>
        ${index === 0 ? '<span class="recommended">Recommended</span>' : ""}
      </div>
      <h3>${candidate.name}</h3>
      <p>${candidate.role}</p>
      <div class="card-scores">
        ${scoreRow("Skills match", candidate.skills)}
        ${scoreRow("Experience", candidate.experience, " years")}
        ${scoreRow("Assessment", candidate.assessment)}
      </div>
      <div class="overall">
        <div><span>Overall score</span><strong>${candidate.overall}%</strong></div>
        <div class="progress"><span style="width:${candidate.overall}%"></span></div>
      </div>
      <button class="text-action" data-select="${candidate.id}">Select candidate</button>
    </article>
  `;
}

function factor(label, value) {
  return `
    <div class="factor">
      <div><span>${label}</span><strong>${value}%</strong></div>
      <div class="progress"><span style="width:${value}%"></span></div>
    </div>
  `;
}

function agentPanel() {
  const { status, messages } = state.agent;
  const statusText = {
    idle: "Ready",
    running: "Evaluating",
    complete: "Complete",
  }[status];

  return `
    <section class="agent-panel" aria-live="polite">
      <div class="agent-heading">
        <div>
          <span class="label">Simulated AI Agent</span>
          <h2>Recommendation evaluation</h2>
          <p>Uses fixed, visible criteria to score and rank the four candidates.</p>
        </div>
        <div class="agent-action">
          <span class="agent-status ${status}">${statusText}</span>
          <button class="primary" id="run-agent" ${status === "running" ? "disabled" : ""}>
            ${status === "complete" ? "Run evaluation again" : status === "running" ? "Evaluation in progress" : "Run AI evaluation"}
          </button>
        </div>
      </div>
      <div class="agent-weights">
        <span>Skills match <strong>40%</strong></span>
        <span>Relevant experience <strong>35%</strong></span>
        <span>Assessment result <strong>25%</strong></span>
      </div>
      ${
        messages.length
          ? `<ol class="agent-log">${messages
              .map(
                (message, index) =>
                  `<li class="${index === messages.length - 1 && status === "running" ? "current" : ""}">${message}</li>`,
              )
              .join("")}</ol>`
          : '<p class="agent-empty">Select “Run AI evaluation” to simulate the recommendation process.</p>'
      }
      ${
        status === "complete"
          ? `<p class="agent-result"><strong>Recommendation:</strong> ${candidates[0].name} ranks first with an overall score of ${candidates[0].overall}%. Human review is still required.</p>`
          : ""
      }
    </section>
  `;
}

function dashboard() {
  const candidate = selectedCandidate();
  const comparison = candidate.id === "a" ? candidates[1] : candidates[0];
  const experienceDifference = Math.abs(candidate.experience - comparison.experience);

  return `
    <section class="page-heading">
      <div>
        <span class="label">Senior Product Designer</span>
        <h1>Candidate review</h1>
        <p>Review the evidence behind each recommendation before making a decision.</p>
      </div>
      ${state.agent.status === "complete" ? '<button class="primary" data-view="review">Start human review</button>' : ""}
    </section>

    ${agentPanel()}

    ${
      state.agent.status === "complete"
        ? `<section>
      <div class="section-heading">
        <div><span class="label">Candidate Ranking</span><h2>Shortlisted candidates</h2></div>
        <span>4 candidates ranked by overall match</span>
      </div>
      <div class="candidate-grid">
        ${candidates.map(candidateCard).join("")}
      </div>
    </section>

    <section class="explanation">
      <div class="section-heading">
        <div><span class="label">Recommendation Explanation</span><h2>Why ${candidate.name} was ranked here</h2></div>
        <button class="link-button" data-view="profile">View full profile</button>
      </div>
      <div class="explanation-grid">
        <article class="panel">
          <h3>Feature importance</h3>
          <p class="panel-intro">Contribution of each factor to the recommendation.</p>
          <div class="factor-list">
            ${factor("Skills match", 40)}
            ${factor("Relevant experience", 35)}
            ${factor("Assessment score", 25)}
          </div>
        </article>

        <article class="panel confidence-panel">
          <span class="label">Confidence Score</span>
          <h3>AI confidence: ${candidate.overall}%</h3>
          <div class="large-progress">
            <span style="width:${candidate.overall}%"></span>
          </div>
          <p>Based on complete profile information and consistent results across the evaluated criteria.</p>
          <div class="confidence-details">
            <span>Data quality <strong>Complete</strong></span>
            <span>Confidence <strong>${candidate.overall >= 85 ? "High" : "Moderate"}</strong></span>
          </div>
        </article>

        <article class="panel comparison-panel">
          <span class="label">Candidate Comparison</span>
          <h3>${candidate.name} compared with ${comparison.name}</h3>
          <div class="comparison-table">
            <div><span>Candidate</span><strong>${candidate.name}</strong><strong>${comparison.name}</strong></div>
            <div><span>Overall score</span><strong>${candidate.overall}%</strong><strong>${comparison.overall}%</strong></div>
            <div><span>Experience</span><strong>${candidate.experience} years</strong><strong>${comparison.experience} years</strong></div>
            <div><span>Assessment</span><strong>${candidate.assessment}%</strong><strong>${comparison.assessment}%</strong></div>
          </div>
          <p class="comparison-note">
            ${candidate.name} has ${experienceDifference}
            ${candidate.experience >= comparison.experience ? "additional" : "fewer"} years of experience,
            ${candidate.assessment >= comparison.assessment ? "a higher" : "a lower"} assessment result, and
            ${candidate.skills >= comparison.skills ? "better" : "narrower"} skills coverage.
          </p>
        </article>
      </div>
    </section>`
        : ""
    }
  `;
}

function profile() {
  const candidate = selectedCandidate();
  return `
    <button class="back" data-view="dashboard">Back to candidate ranking</button>
    <section class="profile-heading">
      <div>
        <span class="label">Candidate Detail View</span>
        <h1>${candidate.name}</h1>
        <p>${candidate.role}</p>
      </div>
      <div class="profile-score"><span>Overall score</span><strong>${candidate.overall}%</strong></div>
    </section>

    <div class="profile-layout">
      <div class="profile-main">
        <article class="panel rationale">
          <span class="label">Recommendation Explanation</span>
          <h2>Why this candidate was recommended</h2>
          <p>
            ${candidate.name} is a strong match because their ${candidate.experience} years of relevant experience,
            ${candidate.skills}% skills match, and ${candidate.assessment}% assessment result align with the role.
            This recommendation is advisory. The hiring manager remains responsible for the final decision.
          </p>
        </article>
        <article class="panel">
          <h2>Work history</h2>
          <div class="detail-row"><strong>${candidate.work}</strong><span>Relevant product design experience</span></div>
          <div class="detail-row"><strong>Product design experience</strong><span>Research, design, testing, and delivery</span></div>
        </article>
        <article class="panel">
          <h2>Assessment results</h2>
          ${factor("Product thinking", Math.min(98, candidate.assessment + 2))}
          ${factor("Interaction design", candidate.assessment)}
          ${factor("Communication", Math.max(65, candidate.assessment - 3))}
        </article>
      </div>
      <aside>
        <article class="panel">
          <h2>Key skills</h2>
          <ul class="plain-list">${candidate.skillList.map((skill) => `<li>${skill}</li>`).join("")}</ul>
        </article>
        <article class="panel">
          <h2>Certification</h2>
          <p>${candidate.certification}</p>
        </article>
        <article class="panel">
          <h2>Education</h2>
          <p>${candidate.education}</p>
        </article>
        <button class="primary full" data-view="review">Continue to human review</button>
      </aside>
    </div>
  `;
}

function recoveryExample() {
  return `
    <section class="recovery">
      <div class="section-heading">
        <div><span class="label">Failure and Recovery Example</span><h2>How human feedback corrects the system</h2></div>
        <span>Simulation</span>
      </div>
      <div class="recovery-grid">
        <article><span>1. Original Recommendation</span><h3>Candidate A is recommended</h3><p>The highest overall score was based on skills, experience, and assessment.</p></article>
        <article><span>2. Correction</span><h3>Missing context is identified</h3><p>The manager notices Candidate B has a critical accessibility certification.</p></article>
        <article><span>3. Human Decision</span><h3>The recommendation is rejected</h3><p>The manager records feedback and requests a revised explanation.</p></article>
        <article><span>4. Updated Explanation</span><h3>The certification is included</h3><p>The system records the correction and explains its relevance.</p></article>
      </div>
    </section>
  `;
}

function review() {
  const candidate = selectedCandidate();
  const decisionMessage =
    state.decision === "approve"
      ? "Recommendation approved. Your decision has been recorded."
      : state.decision === "reject"
        ? "Recommendation rejected. Your decision has been recorded."
        : "";

  return `
    <button class="back" data-view="dashboard">Back to recommendation</button>
    <section class="page-heading">
      <div><span class="label">Human Review</span><h1>Final decision</h1><p>The final hiring decision is always made by the hiring manager.</p></div>
      <span class="control-label">Human-controlled process</span>
    </section>
    ${decisionMessage ? `<div class="decision-message">${decisionMessage}</div>` : ""}

    <div class="review-grid">
      <section class="panel">
        <span class="label">AI Recommendation</span>
        <h2>Recommended candidate: ${candidate.name}</h2>
        <div class="review-summary">
          <div><span>Overall score</span><strong>${candidate.overall}%</strong></div>
          <div><span>Skills match</span><strong>${candidate.skills}%</strong></div>
          <div><span>Assessment</span><strong>${candidate.assessment}%</strong></div>
        </div>
        <p class="review-copy">The recommendation is based on the evidence shown above. Review it before choosing an action.</p>
        <div class="decision-actions">
          <button class="approve" data-decision="approve">Approve recommendation</button>
          <button class="reject" data-decision="reject">Reject recommendation</button>
          <button class="secondary" data-view="dashboard">Compare other candidates</button>
        </div>
      </section>

      <section class="panel">
        <span class="label">Feedback</span>
        <h2>Feedback to the system</h2>
        <p class="panel-intro">Explain what influenced your decision or identify information the evaluation missed.</p>
        <label for="feedback">Your feedback</label>
        <textarea id="feedback" maxlength="500" placeholder="Example: A critical certification should have been weighted more highly."></textarea>
        <div class="feedback-actions">
          <span id="feedback-count">0 / 500</span>
          <button class="primary" id="submit-feedback">Submit feedback</button>
        </div>
        ${state.feedbackSubmitted ? '<p class="submitted">Feedback recorded in the review history.</p>' : ""}
      </section>
    </div>
    ${recoveryExample()}
  `;
}

function render() {
  const views = { dashboard, profile, review };
  app.innerHTML = layout(views[state.view]());
  bindEvents();
}

function calculateRecommendations() {
  candidates.forEach((candidate) => {
    candidate.overall = Math.round(
      candidate.skills * 0.4 + candidate.experienceFit * 0.35 + candidate.assessment * 0.25,
    );
  });
  candidates.sort((first, second) => second.overall - first.overall);
  state.selectedId = candidates[0].id;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function runRecommendationAgent() {
  if (state.agent.status === "running") return;

  state.agent = { status: "running", messages: ["Reading candidate profile data"] };
  render();

  const steps = [
    "Comparing skills with the role requirements",
    "Evaluating relevant years of experience",
    "Reviewing structured assessment results",
    "Applying the published feature weights",
    "Ranking candidates by calculated overall score",
  ];

  for (const step of steps) {
    await wait(550);
    state.agent.messages.push(step);
    render();
  }

  await wait(550);
  calculateRecommendations();
  state.agent.status = "complete";
  state.agent.messages.push("Evaluation complete; recommendation is ready for human review");
  render();
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      window.scrollTo({ top: 0, behavior: "smooth" });
      render();
    });
  });

  document.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.select;
      state.decision = null;
      render();
    });
  });

  document.querySelectorAll("[data-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      state.decision = button.dataset.decision;
      render();
    });
  });

  const feedback = document.querySelector("#feedback");
  const count = document.querySelector("#feedback-count");
  if (feedback && count) {
    feedback.addEventListener("input", () => {
      count.textContent = `${feedback.value.length} / 500`;
    });
  }

  document.querySelector("#submit-feedback")?.addEventListener("click", () => {
    if (!feedback.value.trim()) {
      feedback.focus();
      return;
    }
    state.feedbackSubmitted = true;
    render();
  });

  document.querySelector("#run-agent")?.addEventListener("click", runRecommendationAgent);
}

render();
