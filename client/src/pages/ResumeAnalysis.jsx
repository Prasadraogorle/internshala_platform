import React, { useState } from "react";

const ResumeAnalysis = () => {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);

      const res = await fetch(
        "http://localhost:5000/api/analyze-resume",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setAnalysis(data);

    } catch (error) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-[#a7bc5b]/30 to-[#8da242]/40 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-6 text-center">
          AI Resume Analysis
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#a7bc5b] to-[#8da242] text-white px-6 py-2 rounded-full"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {analysis && (
          <div className="mt-8 space-y-6">

            {/* BASIC INFO */}
            <div className="p-6 bg-gray-100 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                {analysis.fullName || "Name Not Found"}
              </h2>

              <p><strong>Email:</strong> {analysis.contactInformation?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {analysis.contactInformation?.phone || "N/A"}</p>
              <p><strong>Location:</strong> {analysis.contactInformation?.location || "N/A"}</p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                {analysis.contactInformation?.linkedin ? (
                  <a
                    href={analysis.contactInformation.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Profile
                  </a>
                ) : (
                  "N/A"
                )}
              </p>

              <p className="mt-3 font-semibold text-green-700">
                ATS Score: {analysis.atsScore ?? 0}/100
              </p>
            </div>

            {/* SUMMARY */}
            {analysis.professionalSummary && (
              <div className="p-6 bg-gray-100 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">
                  Professional Summary
                </h2>
                <p className="whitespace-pre-line">
                  {analysis.professionalSummary}
                </p>
              </div>
            )}

            {/* TECHNICAL SKILLS */}
            {analysis.technicalSkills?.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">
                  Technical Skills
                </h2>
                <ul className="list-disc pl-6">
                  {analysis.technicalSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SOFT SKILLS */}
            {analysis.softSkills?.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">
                  Soft Skills
                </h2>
                <ul className="list-disc pl-6">
                  {analysis.softSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* PROJECTS */}
            {analysis.projects?.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">
                  Projects
                </h2>
                {analysis.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold">{project.title}</h3>
                    <p>{project.description}</p>
                    {project.technologiesUsed?.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Tech: {project.technologiesUsed.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {analysis.education?.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-xl">
                <h2 className="text-xl font-semibold mb-3">
                  Education
                </h2>
                {analysis.education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-bold">{edu.degree}</p>
                    <p>{edu.institution}</p>
                    <p>{edu.year}</p>
                    <p>{edu.percentageOrCGPA}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeAnalysis;