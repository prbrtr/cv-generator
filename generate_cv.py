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
Include standard LaTeX document structure with documentclass, packages, and complete content.
"""

# Correct OpenAI API call
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a professional CV writer specializing in ATS-friendly resumes."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.7,
    max_tokens=2000
)

cv_latex = response.choices[0].message.content

# Clean up markdown code fences if present
if cv_latex.startswith("```
    cv_latex = cv_latex.split("```")[1]
    if cv_latex.startswith("latex\n"):
        cv_latex = cv_latex[6:]
    elif cv_latex.startswith("tex\n"):
        cv_latex = cv_latex[4:]

# Save as cv-template.tex and compile
with open("cv-template.tex", "w", encoding="utf-8") as f:
    f.write(cv_latex)

print("Compiling LaTeX to PDF...")

# Compile LaTeX to PDF
try:
    subprocess.run(["pdflatex", "-interaction=nonstopmode", "cv-template.tex"], 
                   check=True, 
                   capture_output=True)
    
    # Rename output
    if os.path.exists("cv-template.pdf"):
        os.rename("cv-template.pdf", "output.pdf")
        print("✅ CV generated successfully as output.pdf")
    else:
        print("❌ PDF compilation failed - check LaTeX syntax")
        
except subprocess.CalledProcessError as e:
    print(f"❌ LaTeX compilation error: {e}")
    print(e.stderr.decode() if e.stderr else "")
except FileNotFoundError:
    print("❌ pdflatex not found. Make sure LaTeX is installed.")
