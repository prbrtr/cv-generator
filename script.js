async function submitJD() {
  const jd = document.getElementById("jd").value;

  // Save JD to job_request.txt in repo using GitHub API
  const token = prompt("Enter your GitHub personal access token:");

  const url = "https://api.github.com/repos/prbrtr/cv-generator/contents/job_request.txt";
  const content = btoa(jd); // encode JD

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "New job description update",
      content: content,
    }),
  });

  if (res.ok) {
    alert("✅ Job description submitted! Wait 1–2 mins, your CV will be generated in repo.");
  } else {
    alert("❌ Error: Check token permissions.");
  }
}
