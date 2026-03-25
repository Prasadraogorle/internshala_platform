import React, { useEffect, useState } from "react";

const Profile = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    projects: [],
    profilePhoto: "",
    introVideo: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [fillMode, setFillMode] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        if (data.profilePhoto) {
          setPhotoPreview(`http://localhost:5000/${data.profilePhoto}`);
        }
      });
  }, []);

  /* ================= PROFILE COMPLETION ================= */
  const completion = Math.min(
    100,
    Math.round(
      (
        [
          profile.name,
          profile.email,
          profile.phone,
          profile.location,
          profile.bio,
          profile.skills.length > 0,
          profile.experience.length > 0,
          profile.projects.length > 0,
          profile.profilePhoto,
          profile.introVideo,
        ].filter(Boolean).length / 10
      ) * 100
    )
  );

  /* ================= BASIC UPDATE ================= */
  const updateField = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateArrayField = (section, index, field, value) => {
    const updated = [...profile[section]];
    updated[index][field] = value;
    setProfile({ ...profile, [section]: updated });
  };

  const addItem = (section, structure) => {
    setProfile({
      ...profile,
      [section]: [...profile[section], structure],
    });
  };

  const removeItem = (section, index) => {
    const updated = profile[section].filter((_, i) => i !== index);
    setProfile({ ...profile, [section]: updated });
  };

  /* ================= PHOTO ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("http://localhost:5000/api/profile/photo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setProfile({ ...profile, profilePhoto: data.photo });
  };

  /* ================= RESUME ================= */
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumeUploaded(true);
    setFillMode(null);
  };

  const handleAutoFill = async () => {
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append("resume", resumeFile);

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/profile/auto-fill", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setProfile({ ...profile, ...data });

    setFillMode("auto");
    setLoading(false);
  };

  /* ================= SKILLS ================= */
  const addSkill = (skill) => {
    if (!skill.trim()) return;
    setProfile({ ...profile, skills: [...profile.skills, skill] });
  };

  const removeSkill = (index) => {
    const updated = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updated });
  };

  /* ================= VIDEO ================= */
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    const res = await fetch("http://localhost:5000/api/profile/video", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setProfile({ ...profile, introVideo: data.video });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!resumeUploaded) {
      alert("Resume upload is mandatory!");
      return;
    }

    if (!profile.name || !profile.email || !profile.phone) {
      alert("Please fill required fields.");
      return;
    }

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

  return (
    <div className="bg-[#eef2e3] min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white p-8 rounded-2xl shadow flex gap-8 items-center">
          <div className="relative">
            <img
              src={photoPreview || "https://via.placeholder.com/150"}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#8da242]"
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name || "Your Name"}</h2>

            <div className="mt-4 w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-[#8da242] h-3 rounded-full"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-sm mt-2 text-[#8da242]">
              Profile {completion}% Complete
            </p>
          </div>
        </div>

        {/* RESUME */}
        <Section title="Upload Resume (Mandatory)">
          <input type="file" accept="application/pdf" onChange={handleResumeUpload} />

          {resumeUploaded && (
            <div className="mt-6 flex gap-4">
              <button onClick={handleAutoFill} className="primaryBtn">
                Autofill Using Resume
              </button>
              <button
                onClick={() => setFillMode("manual")}
                className="border border-gray-400 px-6 py-2 rounded-full"
              >
                Fill Manually
              </button>
            </div>
          )}

          {loading && <p className="mt-3 text-[#8da242]">Parsing resume...</p>}
        </Section>

        {resumeUploaded && fillMode && (
          <>
            {/* BASIC INFO */}
            <Section title="Basic Information">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Name:" name="name" value={profile.name} onChange={updateField}/>
                <Input label="Email:" name="email" value={profile.email} onChange={updateField}/>
                <Input label="Phone Number:" name="phone" value={profile.phone} onChange={updateField}/>
                <Input label="Location:" name="location" value={profile.location} onChange={updateField}/>
              </div>

              <div className="mt-6">
                <label className="label">About You:</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={updateField}
                  className="inputField min-h-32"
                />
              </div>
            </Section>

            {/* SKILLS */}
            <Section title="Skills">
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="bg-[#8da242]/20 text-[#8da242] px-3 py-1 rounded-full">
                    {skill}
                    <button onClick={()=>removeSkill(i)} className="ml-2">✕</button>
                  </span>
                ))}
              </div>

              <input
                placeholder="Type skill & press Enter"
                className="inputField"
                onKeyDown={(e)=>{
                  if(e.key==="Enter"){
                    e.preventDefault();
                    addSkill(e.target.value);
                    e.target.value="";
                  }
                }}
              />
            </Section>

            {/* EXPERIENCE */}
            <Section title="Experience">
              {profile.experience.map((exp, i) => (
                <Card key={i}>
                  <Input label="Role:" value={exp.role}
                    onChange={(e)=>updateArrayField("experience", i, "role", e.target.value)} />
                  <Input label="Company:" value={exp.company}
                    onChange={(e)=>updateArrayField("experience", i, "company", e.target.value)} />

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Input type="date" label="Start Date:"
                      value={exp.startDate}
                      onChange={(e)=>updateArrayField("experience", i, "startDate", e.target.value)} />
                    <Input type="date" label="End Date:"
                      value={exp.endDate}
                      onChange={(e)=>updateArrayField("experience", i, "endDate", e.target.value)} />
                  </div>

                  <div className="mt-4">
                    <label className="label">Description:</label>
                    <textarea
                      value={exp.description}
                      onChange={(e)=>updateArrayField("experience", i, "description", e.target.value)}
                      className="inputField min-h-32"
                    />
                  </div>

                  <button onClick={()=>removeItem("experience", i)} className="text-red-500 mt-4 text-sm">
                    Remove Experience
                  </button>
                </Card>
              ))}

              <button
                onClick={()=>addItem("experience",{role:"",company:"",startDate:"",endDate:"",description:""})}
                className="primaryBtn"
              >
                Add Experience
              </button>
            </Section>

            {/* PROJECTS */}
            <Section title="Projects">
              {profile.projects.map((proj, i) => (
                <Card key={i}>
                  <Input label="Project Title:" value={proj.title}
                    onChange={(e)=>updateArrayField("projects", i, "title", e.target.value)} />

                  <div className="mt-4">
                    <label className="label">Description:</label>
                    <textarea
                      value={proj.description}
                      onChange={(e)=>updateArrayField("projects", i, "description", e.target.value)}
                      className="inputField min-h-32"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Input label="Live / Host Link:"
                      value={proj.hostLink}
                      onChange={(e)=>updateArrayField("projects", i, "hostLink", e.target.value)} />
                    <Input label="GitHub Link:"
                      value={proj.githubLink}
                      onChange={(e)=>updateArrayField("projects", i, "githubLink", e.target.value)} />
                  </div>

                  <button onClick={()=>removeItem("projects", i)} className="text-red-500 mt-4 text-sm">
                    Remove Project
                  </button>
                </Card>
              ))}

              <button
                onClick={()=>addItem("projects",{title:"",description:"",hostLink:"",githubLink:""})}
                className="primaryBtn"
              >
                Add Project
              </button>
            </Section>

            {/* INTRO VIDEO */}
            <Section title="Introduction Video">
              <input type="file" accept="video/*" onChange={handleVideoUpload} />
              {profile.introVideo && (
                <video
                  controls
                  className="mt-4 w-full rounded-xl"
                  src={`http://localhost:5000/${profile.introVideo}`}
                />
              )}
            </Section>
          </>
        )}

        <div className="text-center">
          <button onClick={handleSave} className="primaryBtn px-10 py-3">
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white p-8 rounded-2xl shadow">
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
    {children}
  </div>
);

const Card = ({ children }) => (
  <div className="border rounded-xl p-6 mb-6 bg-gray-50">
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="label">{label}</label>}
    <input {...props} className="inputField" />
  </div>
);

export default Profile;