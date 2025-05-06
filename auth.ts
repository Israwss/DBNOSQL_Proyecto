import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Email Address', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize(credentials) {
      const validUsers = [
        { email: 'isra@gmail.com', password: '123', name: 'Isra' },
        { email: 'yoshi@gmail.com', password: '123', name: 'Yoshi' },
      ];

      const user = validUsers.find(
        (u) => u.email === credentials?.email && u.password === credentials?.password
      );

      if (user) {
        return {
          id: user.email,
          name: user.name,
          email: user.email,
        };
      }

      return null;
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');
      return isPublicPage || isLoggedIn;
    },
  },
});
