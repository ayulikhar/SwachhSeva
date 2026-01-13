import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary to-emerald-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold bg-gradient-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">
            SwachhSeva
          </h1>
        </div>
      </div>
    </header>
  );
}
