import openai
import os

openai.api_key = os.environ["OPENAI_API_KEY"]

with open("base_cv.tex", "r") as f:
    base_cv = f.read()

with open("jd.txt", "r") as f:
    jd = f.read()

prompt = f"""
You are an expert resume writer.
Tailor the following LaTeX CV to match the job description.
Keep formatting consistent and output valid LaTeX.

Base CV:
{base_cv}

Job Description:
{jd}
"""

response = openai.Completion.create(
    model="gpt-4o-mini",
    prompt=prompt,
    max_tokens=2000
)

tailored_cv = response.choices[0].text.strip()

with open("tailored_cv.tex", "w") as f:
    f.write(tailored_cv)
