import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  try {
    const userDocRef = doc(db, "users", email);
    const userDocSnap = await getDoc(userDocRef);

    let isAdmin = false;

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      if (data.role === "admin") {
        isAdmin = true;
      }
    }

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ error: "Error checking admin status" }, { status: 500 });
  }
}
