import React, { useState } from "react";

const ResumeAnalysis = () => {
  const [resume, setResume] = useState(null);
  const [summary, setSummary] = useState("");
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

      setSummary(data.summary);

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

        {summary && (
          <div className="mt-8 p-6 bg-gray-100 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">
              AI Summary
            </h2>
            <p className="whitespace-pre-line">{summary}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeAnalysis;
