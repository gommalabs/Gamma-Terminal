import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  ssr: false,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"email" | "phone">("phone");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    navigate({ to: "/terminal" });
  };

  const handlePhoneSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) return setErr(error.message);
    setInfo(`6-DIGIT CODE SENT TO ${phone}`);
    setStep("verify");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
    setLoading(false);
    if (error) return setErr(error.message);
    navigate({ to: "/terminal" });
  };

  return (
    <div className="min-h-screen bg-term-black text-term-text font-mono flex">
      <div className="hidden md:flex flex-col justify-between border-r border-term-border-strong bg-term-panel p-8 w-[420px]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-term-amber" />
          <span className="text-term-amber font-bold text-xs tracking-[0.2em]">GAMMA TERMINAL</span>
        </Link>
        <div>
          <div className="text-[9px] text-term-amber tracking-[0.3em] uppercase mb-3">▍ Authentication</div>
          <h2 className="text-2xl text-term-heading font-bold leading-tight">
            Two-factor secured.<br/>Always.
          </h2>
          <p className="text-term-textDim text-xs mt-4 leading-relaxed">
            SMS OTP verified login keeps unauthorized access off your terminal. Sessions expire
            after 8 hours of inactivity.
          </p>
        </div>
        <div className="text-[8px] text-term-textDim tracking-widest uppercase">
          ENCRYPTED · MFA · SESSION-BOUND
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-[9px] text-term-amber tracking-[0.3em] uppercase mb-4">SECURE LOGIN</div>
          <h1 className="text-2xl text-term-heading font-bold mb-6">Authenticate</h1>

          {/* Mode toggle */}
          <div className="flex border border-term-border-strong mb-6">
            {(["phone", "email"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setStep("input"); setErr(null); setInfo(null); }}
                className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold ${
                  mode === m ? "bg-term-amber text-black" : "bg-term-panel text-term-textDim hover:text-term-amber"
                }`}
              >
                {m === "phone" ? "PHONE OTP" : "EMAIL"}
              </button>
            ))}
          </div>

          {mode === "email" ? (
            <form onSubmit={handleEmail} className="space-y-4">
              <Field label="EMAIL" type="email" value={email} onChange={setEmail} required />
              <Field label="PASSWORD" type="password" value={password} onChange={setPassword} required />
              {err && <ErrorBox msg={err} />}
              <SubmitBtn loading={loading} label="▶ AUTHENTICATE" />
            </form>
          ) : step === "input" ? (
            <form onSubmit={handlePhoneSend} className="space-y-4">
              <Field label="PHONE NUMBER (E.164)" value={phone} onChange={setPhone} placeholder="+15551234567" required />
              {err && <ErrorBox msg={err} />}
              <SubmitBtn loading={loading} label="▶ SEND 6-DIGIT CODE" />
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {info && <div className="border border-term-green bg-term-green/10 text-term-green text-[10px] p-2 uppercase">{info}</div>}
              <Field label="VERIFICATION CODE" value={code} onChange={setCode} placeholder="123456" required />
              {err && <ErrorBox msg={err} />}
              <SubmitBtn loading={loading} label="▶ VERIFY & ENTER TERMINAL" />
              <button type="button" onClick={() => { setStep("input"); setCode(""); setErr(null); setInfo(null); }} className="text-[10px] text-term-textDim hover:text-term-amber w-full text-center">
                ← USE A DIFFERENT NUMBER
              </button>
            </form>
          )}

          <div className="mt-6 text-[10px] text-term-textDim text-center">
            NO ACCOUNT? <Link to="/signup" className="text-term-amber hover:underline">REQUEST ACCESS</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }: any) {
  return (
    <label className="block">
      <div className="text-[8px] text-term-textDim tracking-[0.2em] uppercase mb-1">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="bb-input w-full" />
    </label>
  );
}
function ErrorBox({ msg }: { msg: string }) {
  return <div className="border border-term-red bg-term-red/10 text-term-red text-[10px] p-2 uppercase">{msg}</div>;
}
function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="bb-button w-full justify-center" style={{ background: "var(--color-term-amber)", color: "#000", borderColor: "var(--color-term-amber)", padding: "8px", fontSize: "10px" }}>
      {loading ? "PROCESSING..." : label}
    </button>
  );
}
