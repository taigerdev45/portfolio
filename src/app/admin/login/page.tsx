"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && user.email === "taigermboumba@gmail.com") {
      router.push("/admin");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email !== "taigermboumba@gmail.com") {
      setError("Accès refusé : Seul l'administrateur principal peut se connecter.");
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: unknown) {
      setError("Erreur de connexion : " + (err instanceof Error ? err.message : "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/30 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full space-y-10 p-10 bg-white/80 backdrop-blur-xl dark:bg-slate-900 rounded-4xl shadow-2xl shadow-blue-900/10 border border-blue-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 bg-blue-600 flex items-center justify-center rounded-3xl shadow-xl shadow-blue-200 rotate-3 transition-transform hover:rotate-0 duration-500">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-blue-950 dark:text-white tracking-tight">
              Administration
            </h2>
            <p className="text-blue-900/60 dark:text-slate-400 font-bold">Connectez-vous pour gérer votre portfolio</p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="group">
              <label htmlFor="email-address" className="block text-sm font-black text-blue-900/70 dark:text-slate-400 mb-2 uppercase tracking-wider ml-1">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full px-6 py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-blue-950 dark:text-white"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="block text-sm font-black text-blue-900/70 dark:text-slate-400 mb-2 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-6 py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-blue-950 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-6 flex items-center text-blue-900/40 hover:text-blue-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl animate-in shake duration-500">
              <p className="text-red-600 dark:text-red-400 font-bold text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 px-6 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Connexion...</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        <p className="text-center text-blue-900/40 dark:text-slate-500 text-sm font-bold">
          © {new Date().getFullYear()} Admin Portfolio
        </p>
      </div>
    </div>
  );
}
