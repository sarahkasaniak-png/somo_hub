"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("student");

  const submit = async () => {
    const res = await fetch("/api/profile/complete-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, role }),
    });

    if (res.ok) {
      router.push(
        role === "tutor"
          ? "/onboarding/tutor"
          : role === "institution"
          ? "/onboarding/institution"
          : "/dashboard"
      );
    }
  };

  return (
    <div>
      <h1>Complete your profile</h1>

      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
        <option value="institution">Institution</option>
      </select>

      <button onClick={submit}>Continue</button>
    </div>
  );
}
