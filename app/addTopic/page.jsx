"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTopic() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !time) {
      alert("Title and description are required.");
      return;
    }
    const existingTopic = await checkExistingTopic({ title, description, time, date });

    if (existingTopic) {
      alert("A topic with the same values already exists.");
      return;
    }

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, time, date }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to create a topic");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkExistingTopic = async ({ title, description, time, date }) => {
    try {
      const res = await fetch("/api/topics");
      const data = await res.json();

      const existingTopic = data.topics.find(
        (topic) =>
          topic.title === title &&
          topic.description === description &&
          topic.time === time &&
          topic.date === date
      );

      return existingTopic;
    } catch (error) {
      console.error("Error checking existing topic:", error);
      return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />
      <input
        onChange={(e) => setDate(e.target.value)}
        value={date}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />
      <input
        onChange={(e) => setTime(e.target.value)}
        value={time}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />

      <button
        type="submit"
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
      >
        Add Topic
      </button>
    </form>
  );
}


