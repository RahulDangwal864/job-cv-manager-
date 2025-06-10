import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// --- Types
interface Job {
  id: string;
  company: string;
  createdAt: string;
  description: string;
  experience: string;
  jobLink: string;
  lastDate: string;
  location: string;
  positionName: string;
  startDate: string;
}

interface ResumeData {
  skills: { skill: string }[];
  objective?: string;
  certifications?: { certificationName: string }[];
  projects?: { description: string }[];
  workExperience?: { description: string }[];
}

// --- Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

// --- TF-IDF Vectorizer
function computeTfIdf(docs: string[]): {
  vectors: number[][];
  vocabulary: string[];
} {
  const termFreqs = docs.map((doc) => {
    const tf: Record<string, number> = {};
    doc
      .toLowerCase()
      .split(/\W+/)
      .forEach((word) => {
        if (word) tf[word] = (tf[word] || 0) + 1;
      });
    return tf;
  });

  const vocabulary = Array.from(
    new Set(
      docs.flatMap((doc) => doc.toLowerCase().split(/\W+/)).filter(Boolean)
    )
  );

  const vectors = termFreqs.map((tf) =>
    vocabulary.map((term) => tf[term] || 0)
  );

  return { vectors, vocabulary };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;

    // --- 1. Fetch resume data
    const resumesRef = collection(db, `users/${userEmail}/resumes`);
    const resumeSnap = await getDocs(resumesRef);
    if (resumeSnap.empty) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 });
    }

    const resumeData = resumeSnap.docs[0].data() as ResumeData;

    const skillText = resumeData.skills?.map((s) => s.skill).join(" ") || "";
    const certs =
      resumeData.certifications?.map((c) => c.certificationName).join(" ") ||
      "";
    const projects =
      resumeData.projects?.map((p) => p.description).join(" ") || "";
    const experience =
      resumeData.workExperience?.map((e) => e.description).join(" ") || "";
    const objective = resumeData.objective || "";

    const userText = [skillText, certs, projects, experience, objective]
      .join(" ")
      .replace(/\*\*/g, "")
      .toLowerCase()
      .trim();

    if (!userText) {
      return NextResponse.json(
        { error: "No meaningful resume content found" },
        { status: 400 }
      );
    }

    // --- 2. Fetch job posts
    const careersRef = collection(db, "careers");
    const jobSnap = await getDocs(
      query(careersRef, orderBy("createdAt", "desc"), limit(100))
    );
    const jobs: Job[] = jobSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Job, "id">),
    }));

    if (jobs.length === 0) {
      return NextResponse.json({ error: "No jobs found" }, { status: 404 });
    }

    // --- 3. Build TF-IDF vectors
    const jobDocs = jobs.map((job) => `${job.description} ${job.positionName}`);
    const { vectors} = computeTfIdf([...jobDocs, userText]);

    const userVector = vectors.pop()!; // Last vector is user

    // --- 4. Score and recommend
    const scoredJobs = jobs.map((job, i) => ({
      ...job,
      similarity: cosineSimilarity(vectors[i], userVector),
    }));

    const topJobs = scoredJobs
      .filter((j) => j.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    if (topJobs.length === 0) {
      return NextResponse.json(
        { error: "No relevant jobs found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { suggested: topJobs },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch {
    console.error("/api/suggestedjobs error");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
