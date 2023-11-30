import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

const getTopics = async () => {
  const apiUrl = process.env.API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/topics`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    const data = await res.json();

    if (!data || !data.topics) {
      throw new Error("Invalid data structure from API");
    }

    return data.topics;
  } catch (error) {
    console.error("Error loading topics: ", error);
    throw error;
  }
};

export default async function TopicsList() {
  try {
    const topics = await getTopics();

    return (
      <>
        {topics.map((t) => (
          <div
            key={t._id}
            className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start"
          >
            <div>
              <h2 className="font-bold text-2xl">{t.title}</h2>
              <div>{t.description}</div>
              <div>{t.time}</div>
              <div>{t.date}</div>
            </div>

            <div className="flex gap-2">
              <RemoveBtn id={t._id} />
              <Link href={`/editTopic/${t._id}`}>
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        ))}
      </>
    );
  } catch (error) {
    console.error("Error in TopicsList component: ", error);
    return <div>Error loading topics</div>;
  }
}
