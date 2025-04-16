const sampleData = {
    companyName: "TechCorp",
    matchScore: 86,
    accountStatus: "Target"
  };
  
  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'profile-enhancer-widget';
  widget.innerHTML = `
    <div id="pe-header">
      <strong>${sampleData.companyName}</strong>
      <button id="toggle-visibility">✖</button>
    </div>
    <div class="pe-body">
      <label>Match Score: ${sampleData.matchScore}%</label>
      <div class="pe-progress-bar">
        <div class="pe-progress" style="width: ${sampleData.matchScore}%"></div>
      </div>
      <div class="pe-tag ${sampleData.accountStatus === "Target" ? "target" : "not-target"}">
        ${sampleData.accountStatus}
      </div>
    </div>
  `;
  
  // Append widget
  document.body.appendChild(widget);
  
  // Load visibility from chrome.storage
  chrome.storage.sync.get(["peWidgetVisible"], (result) => {
    if (result.peWidgetVisible === false) {
      widget.style.display = "none";
    }
  });
  
  // Toggle visibility
  document.getElementById("toggle-visibility").addEventListener("click", () => {
    widget.style.display = "none";
    chrome.storage.sync.set({ peWidgetVisible: false });
  });
  