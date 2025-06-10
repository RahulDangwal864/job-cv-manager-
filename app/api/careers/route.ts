import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function isAdmin(email: string): Promise<boolean> {
  return email === ADMIN_EMAIL;
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "careers"));
    const careers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ careers });
  } catch {
    console.error("Error fetching careers:");
    return NextResponse.json(
      { error: "Failed to fetch careers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!(await isAdmin(session.user.email))) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const newCareer = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "careers"), newCareer);
    return NextResponse.json({ id: docRef.id, ...newCareer });
  } catch {
    console.error("Error creating career:");
    return NextResponse.json(
      { error: "Failed to create career" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!(await isAdmin(session.user.email))) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Missing career id" },
        { status: 400 }
      );
    }
    const docRef = doc(db, "careers", id);
    await updateDoc(docRef, data);
    return NextResponse.json({ id, ...data });
  } catch {
    console.error("Error updating career:");
    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!(await isAdmin(session.user.email))) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing career id" },
        { status: 400 }
      );
    }
    const docRef = doc(db, "careers", id);
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Career deleted" });
  } catch {
    console.error("Error deleting career:");
    return NextResponse.json(
      { error: "Failed to delete career" },
      { status: 500 }
    );
  }
}
