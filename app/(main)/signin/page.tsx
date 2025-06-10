"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const email = session?.user?.email;
    if (typeof email === "string") {
      const loadSettings = async () => {
        try {
          const docRef = doc(db, 'users', email, 'settings', 'preferences');
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(data);

            // Also set to localStorage as backup
            localStorage.setItem('job-cv-manager_name', data.displayName);
            localStorage.setItem('job-cv-manager_template', data.defaultTemplate);
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      };
      loadSettings();
      router.push('/profile');
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}