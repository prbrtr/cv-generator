// Your secret configuration (encrypted with your passphrase)
const CONFIG = {
  encryptedToken: 'FQkJLQMBGQULMSwABwkeRg42RlIXGTgdGFY/RhA8MCUyR1VLFlIgKg==', // Will be generated based on your passphrase
  repo: 'prbrtr/cv-generator',
  workflow: 'generate_cv.yml'
};

// Simple encryption/decryption using passphrase
function simpleDecrypt(encrypted, passphrase) {
  // XOR-based decryption with passphrase
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(
      encrypted.charCodeAt(i) ^ passphrase.charCodeAt(i % passphrase.length)
    );
  }
  return decrypted;
}

function simpleEncrypt(text, passphrase) {
  let encrypted = '';
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ passphrase.charCodeAt(i % passphrase.length)
    );
  }
  return btoa(encrypted); // Base64 encode the result
}

async function submitJD() {
  const passphrase = document.getElementById("passphrase").value.trim();
  const jd = document.getElementById("jd").value.trim();
  const status = document.getElementById("status");

  if (!passphrase) {
    status.textContent = "❌ Please enter your secret passphrase.";
    status.style.color = "red";
    return;
  }

  if (!jd) {
    status.textContent = "❌ Please enter a job description.";
    status.style.color = "red";
    return;
  }

  status.textContent = "⏳ Verifying and generating CV...";
  status.style.color = "#007bff";

  try {
    // Decrypt the token using passphrase
    const encryptedBytes = atob(CONFIG.encryptedToken);
    const token = simpleDecrypt(encryptedBytes, passphrase);

    // Verify token format (basic check)
    if (!token.startsWith('ghp_')) {
      status.textContent = "❌ Invalid passphrase. Access denied.";
      status.style.color = "red";
      return;
    }

    const [owner, repo] = CONFIG.repo.split('/');

    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.repo}/actions/workflows/${CONFIG.workflow}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
        <a href="https://github.com/${CONFIG.repo}/actions" target="_blank" style="color: #007bff;">
          Click here to check progress and download PDF
        </a>`;
      status.style.color = "#28a745";
      
      // Clear fields
      document.getElementById("jd").value = "";
      document.getElementById("passphrase").value = "";
    } else if (response.status === 401) {
      status.textContent = "❌ Invalid passphrase. Access denied.";
      status.style.color = "red";
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Invalid passphrase or workflow error.";
    status.style.color = "red";
  }
}

// Helper function - Run this ONCE in console to encrypt your token
function generateEncryptedToken(token, passphrase) {
  const encrypted = simpleEncrypt(token, passphrase);
  console.log('Copy this to CONFIG.encryptedToken:');
  console.log(encrypted);
  return encrypted;
}

// Example usage in console:
// generateEncryptedToken('ghp_yourActualToken', 'mySecretWord123')
