"use client";

import { Mail, Github, Linkedin, Send, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { getSettings, Settings } from "@/lib/services";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const s = await getSettings();
      setSettings(s);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      if (!settings?.brevoApiKey || !settings?.contactEmail) {
        throw new Error("Configuration Brevo manquante dans les paramètres.");
      }

      if (!settings.brevoApiKey.startsWith("xkeysib-")) {
        throw new Error("La clé API Brevo semble invalide (elle doit commencer par 'xkeysib-').");
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": settings.brevoApiKey.trim(),
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: "Formulaire Portfolio",
            email: settings.contactEmail
          },
          replyTo: {
            email: email,
            name: name
          },
          to: [
            {
              email: settings.contactEmail,
              name: "Admin Portfolio"
            }
          ],
          subject: `Nouveau message de ${name} via Portfolio`,
          htmlContent: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">Nouveau Message</h2>
              </div>
              <div style="padding: 30px;">
                <p>Vous avez reçu un nouveau message depuis votre formulaire de contact.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
                <p><strong>Message :</strong></p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
                Ceci est un message automatique envoyé depuis votre portfolio.
              </div>
            </div>
          `
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Détails de l'erreur Brevo:", errorData);
        throw new Error(errorData.message || "Erreur lors de l'envoi via Brevo");
      }

      const result = await response.json();
      console.log("Succès Brevo - ID du message:", result.messageId);

      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du mail:", error);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Contact Info */}
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Parlons de votre <span className="text-gradient">prochain projet</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-900/60 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-bold">
              Vous avez une idée ambitieuse ou un projet innovant ? Je serais ravi d&apos;en discuter avec vous et de voir comment je peux vous aider.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              { 
                icon: <Mail size={24} />, 
                label: "Email", 
                value: settings?.contactEmail || "votre@email.com", 
                href: settings?.contactEmail ? `mailto:${settings.contactEmail}` : "#",
                color: "blue" 
              },
              { 
                icon: <Github size={24} />, 
                label: "GitHub", 
                value: settings?.githubUrl?.replace("https://github.com/", "") || "github.com/votre-username", 
                href: settings?.githubUrl || "#",
                color: "indigo" 
              },
              { 
                icon: <Linkedin size={24} />, 
                label: "LinkedIn", 
                value: settings?.linkedinUrl?.replace("https://linkedin.com/in/", "") || "linkedin.com/in/votre-nom", 
                href: settings?.linkedinUrl || "#",
                color: "blue" 
              }
            ].map((item, i) => (
              <a 
                key={i} 
                href={item.href}
                target={item.href.startsWith('http') ? "_blank" : undefined}
                rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                className="group p-6 md:p-8 bg-white/80 backdrop-blur-sm dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-3xl md:rounded-4xl hover:shadow-2xl hover:border-blue-300 transition-all duration-500 block"
              >
                <div className={`p-3 md:p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 w-fit rounded-xl md:rounded-2xl mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <p className="text-[10px] md:text-xs font-black text-blue-900/40 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-base md:text-lg font-black text-blue-950 dark:text-white truncate tracking-tight">{item.value}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="relative">
          <div className="absolute -inset-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-3xl opacity-10 animate-pulse" />
          <div className="relative bg-white/80 backdrop-blur-xl dark:bg-slate-900 rounded-4xl md:rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-blue-100 dark:border-slate-800 p-6 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-xs md:text-sm font-black text-blue-900/70 dark:text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-base md:text-lg font-bold text-blue-950 dark:text-white"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-xs md:text-sm font-black text-blue-900/70 dark:text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 md:px-6 py-4 md:py-5 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-base md:text-lg font-bold text-blue-950 dark:text-white"
                    placeholder="jean@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-xs md:text-sm font-black text-blue-900/70 dark:text-slate-400 uppercase tracking-widest ml-1">Téléphone (Optionnel)</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-900/30 dark:text-slate-500" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-5 md:pr-6 py-4 md:py-5 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-base md:text-lg font-bold text-blue-950 dark:text-white"
                    placeholder="+xxx xxxxxxxx"
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-xs md:text-sm font-black text-blue-900/70 dark:text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-5 md:px-6 py-4 md:py-5 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-base md:text-lg font-bold text-blue-950 dark:text-white resize-none"
                  placeholder="Décrivez votre projet en quelques mots..."
                />
              </div>
              
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className={`w-full group relative flex items-center justify-center space-x-3 md:space-x-4 px-6 md:px-8 py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-xl transition-all duration-500 active:scale-95 shadow-2xl ${
                  status === "sent" 
                    ? "bg-green-500 text-white shadow-green-200" 
                    : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02]"
                } disabled:opacity-50 disabled:hover:scale-100`}
              >
                {status === "sending" ? (
                  <div className="animate-spin rounded-full h-7 w-7 border-4 border-white/30 border-t-white" />
                ) : status === "sent" ? (
                  <span>Message envoyé !</span>
                ) : status === "error" ? (
                  <span>Erreur lors de l&apos;envoi</span>
                ) : (
                  <>
                    <span>Envoyer le message</span>
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
              </button>
              {status === "error" && (
                <p className="text-center text-red-500 font-bold mt-4 animate-bounce">
                  Veuillez vérifier la configuration Brevo dans l&apos;administration.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
