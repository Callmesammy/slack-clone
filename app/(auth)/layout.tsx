import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-slack-blue/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center justify-center">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 mb-8 select-none">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-slack-blue flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-extrabold text-xl tracking-tighter text-white">#</span>
          </div>
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-50 via-slate-100 to-slate-300">
            timeslack
          </span>
        </div>

        {/* Auth Card wrapper */}
        {children}
      </div>
    </div>
  );
}
