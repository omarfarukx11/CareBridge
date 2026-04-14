import { dbConnect } from "@/lib/dbConnect";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const userCollection = await dbConnect("users"); 
        const user = await userCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordMatched = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatched) {
          throw new Error("Invalid password");
        }

        // Next-auth এর জন্য অবজেক্ট রিটার্ন করুন
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const db = await dbConnect("users");
          const userExists = await db.findOne({ email: user.email });

          if (!userExists) {
            await db.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
              provider: "google",
              createdAt: new Date().toISOString(),
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.id;
        token.role = user.role ?? token.role;
        token.image = user.image || token.image;
      }

      if (!token.role && token.email) {
        try {
          const db = await dbConnect("users");
          const existingUser = await db.findOne({ email: token.email });
          if (existingUser) {
            token.role = existingUser.role || "user";
            token.id = existingUser._id.toString();
            token.image = existingUser.image || token.image;
          }
        } catch (error) {
          console.error("Error loading user role from DB in jwt callback:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };