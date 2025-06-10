import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db, doc, getDoc, setDoc } from './firebase';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error('No Profile!');
      }

      const email = profile.email;
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // User doesn't exist, create with default role
        await setDoc(userRef, {
          role: "user"
        });
      }

      return true;
    }
  }
};

export default NextAuth(authOptions);