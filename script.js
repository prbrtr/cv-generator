const GITHUB_TOKEN = 'ghp_YOUR_TOKEN_HERE'; // Replace with your actual token
const REPO_OWNER = 'prbrtr';
const REPO_NAME = 'cv-generator';
const WORKFLOW_ID = 'generate_cv.yml';

async function submitJD() {
  const jd = document.getElementById("jd").value.trim();
  const status = document.getElementById("status");

  if (!jd) {
    status.textContent = "❌ Please enter a job description.";
    status.style.color = "red";
    return;
  }

  status.textContent = "⏳ Submitting and generating CV...";
  status.style.color = "#007bff";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          ref: "main",
          inputs: {
            job_description: jd
          }
        }),
      }
    );

    if (response.status === 204) {
      status.innerHTML = `✅ CV generation started! <br>
        <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}/actions" target="_blank">
          Click here to check progress and download PDF
        </a>`;
      status.style.color = "#28a745";
      
      // Clear the textarea
      document.getElementById("jd").value = "";
    } else {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error triggering workflow. Please check console for details.";
    status.style.color = "red";
  }
}
