import os
from openai import OpenAI
import subprocess

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Read the job description
with open("job_request.txt", "r", encoding="utf-8") as f:
    jd = f.read().strip()

print("Generating CV from JD...")

# Generate tailored CV text in LaTeX
prompt = f"""
You are a professional CV writer.
Use the following job description to tailor a 1-page CV in LaTeX format.

Job Description:
{jd}

Make it ATS-friendly, concise, and professional.
Return only valid LaTeX code (no explanations).
"""

response = client.responses.create(
    model="gpt-4.1-mini",
    input=prompt
)

cv_latex = response.output_text

# Save as cv-template.tex and compile
with open("cv-template.tex", "w", encoding="utf-8") as f:
    f.write(cv_latex)

# Compile LaTeX to PDF
subprocess.run(["pdflatex", "cv-template.tex"], check=True)

# Rename output
os.rename("cv-template.pdf", "output.pdf")

print("✅ CV generated successfully as output.pdf")
