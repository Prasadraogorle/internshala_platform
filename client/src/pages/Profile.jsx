import React, { useEffect, useState } from "react";

const Profile = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    profilePhoto: "",
    introVideo: "",
  });

  const [loading, setLoading] = useState(false);
  const [resumeMode, setResumeMode] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ================= PHOTO UPLOAD ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(
      "http://localhost:5000/api/profile/photo",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    setProfile({ ...profile, profilePhoto: data.photo });
  };

  /* ================= VIDEO UPLOAD ================= */
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    const res = await fetch(
      "http://localhost:5000/api/profile/video",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    setProfile({ ...profile, introVideo: data.video });
  };

  /* ================= RESUME AUTO FILL ================= */
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    const res = await fetch(
      "http://localhost:5000/api/profile/auto-fill",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    setProfile({ ...profile, ...data });
    setLoading(false);
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    alert("Profile Updated Successfully");
  };

  /* ================= COMPLETION ================= */
  const completion = Math.min(
    100,
    Math.round(
      ([
        profile.name,
        profile.phone,
        profile.location,
        profile.bio,
        profile.skills?.length,
        profile.profilePhoto,
      ].filter(Boolean).length /
        6) *
        100
    )
  );

  return (
    <div className="bg-[#f4f7ed] min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="bg-white p-8 rounded-2xl shadow mb-8 flex items-center gap-8">

          {/* PHOTO */}
          <div className="relative group">
            <img
              src={
                profile.profilePhoto
                  ? `http://localhost:5000/${profile.profilePhoto}`
                  : "https://via.placeholder.com/150"
              }
              className="w-32 h-32 rounded-full object-cover border-4 border-[#8da242]"
            />

            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm cursor-pointer transition">
              {profile.profilePhoto ? "Change Photo" : "Upload Photo"}
            </div>

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.name || "Your Name"}
            </h2>

            <p className="text-gray-500">
              {profile.location || "Add your location"}
            </p>

            <div className="mt-4 w-72 bg-gray-200 h-3 rounded-full">
              <div
                className="bg-[#8da242] h-3 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="text-sm text-[#8da242] mt-1">
              {completion}% Complete
            </p>
          </div>
        </div>

        {/* FILL OPTION */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            How would you like to fill your profile?
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => setResumeMode("manual")}
              className={`px-6 py-3 rounded-full border transition ${
                resumeMode === "manual"
                  ? "bg-[#8da242] text-white"
                  : "border-gray-300"
              }`}
            >
              Fill Manually
            </button>

            <button
              onClick={() => setResumeMode("resume")}
              className={`px-6 py-3 rounded-full border transition ${
                resumeMode === "resume"
                  ? "bg-[#8da242] text-white"
                  : "border-gray-300"
              }`}
            >
              Autofill Using Resume
            </button>
          </div>

          {resumeMode === "resume" && (
            <div className="mt-6">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeUpload}
              />
              {loading && (
                <p className="text-[#8da242] mt-3">
                  Parsing resume...
                </p>
              )}
            </div>
          )}
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="inputField"
            />
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="inputField"
            />
            <input
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Location"
              className="inputField"
            />
          </div>

          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="About You"
            className="inputField mt-4"
          />
        </div>

        {/* SKILLS */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-[#8da242]/20 text-[#8da242] px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => {
                    const updated = profile.skills.filter((_, i) => i !== index);
                    setProfile({ ...profile, skills: updated });
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <input
            placeholder="Type skill and press Enter"
            className="inputField"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setProfile({
                  ...profile,
                  skills: [...profile.skills, e.target.value],
                });
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* INTRO VIDEO */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Introduction Video
          </h2>

          <input type="file" accept="video/*" onChange={handleVideoUpload} />

          {profile.introVideo && (
            <video
              controls
              className="mt-4 w-full rounded-xl"
              src={`http://localhost:5000/${profile.introVideo}`}
            />
          )}
        </div>

        {/* SAVE BUTTON */}
        <div className="text-center">
          <button
            onClick={handleSave}
            className="bg-[#8da242] hover:bg-[#a7bc5b] text-white px-8 py-3 rounded-full shadow-md transition"
          >
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;