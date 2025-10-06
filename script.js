async function submitJD() {
  const token = document.getElementById("token").value.trim();
  const jd = document.getElementById("jd").value.trim();
  const status = document.getElementById("status");

  if (!token || !jd) {
    status.textContent = "❌ Please enter both API key and JD.";
    return;
  }

  status.textContent = "⏳ Submitting job description...";

  const content = new Blob([jd], { type: "text/plain" });
  const formData = new FormData();
  formData.append("content", content);

  // Commit JD to repo to trigger workflow
  try {
    await fetch(
      "https://api.github.com/repos/prbrtr/cv-generator/contents/job_request.txt",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "New JD submission",
          content: btoa(jd),
        }),
      }
    );
    status.textContent =
      "✅ Submitted! Wait ~30s and check Actions tab for your generated PDF.";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error submitting JD. Check token and repo access.";
  }
}
