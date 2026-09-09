import { Providers } from "@/components/Providers";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SessionProvider is scoped here because useSession/signIn/signOut are used
  // ONLY inside admin routes. The public site no longer ships/parses the
  // next-auth client context at all.
  return <Providers>{children}</Providers>;
}
