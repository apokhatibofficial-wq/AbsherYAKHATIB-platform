import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-app-bg">
      <div className="flex min-h-dvh w-full max-w-xl flex-col bg-app-bg sm:border-x sm:border-border-light">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <div className="sticky bottom-0 z-10">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
