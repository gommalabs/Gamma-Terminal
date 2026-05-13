import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  ssr: false,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", phone: "", fullName: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
      options: {
        emailRedirectTo: `${window.location.origin}/terminal`,
        data: { full_name: form.fullName, phone: form.phone },
      },
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/terminal" });
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="min-h-screen bg-term-black text-term-text font-mono flex">
      <div className="hidden md:flex flex-col justify-between border-r border-term-border-strong bg-term-panel p-8 w-[420px]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-term-amber" />
          <span className="text-term-amber font-bold text-xs tracking-[0.2em]">GAMMA TERMINAL</span>
        </Link>
        <div>
          <div className="text-[9px] text-term-amber tracking-[0.3em] uppercase mb-3">▍ Account Provisioning</div>
          <h2 className="text-2xl text-term-heading font-bold leading-tight">
            Activate your<br/>institutional seat.
          </h2>
          <p className="text-term-textDim text-xs mt-4 leading-relaxed">
            Email signup. Phone-verified login. Broker integration available post-onboarding.
            14-day evaluation included.
          </p>
        </div>
        <div className="text-[8px] text-term-textDim tracking-widest uppercase">
          SOC2 · FINRA REG NMS · ENCRYPTED AT REST
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-[9px] text-term-amber tracking-[0.3em] uppercase mb-4">SIGNUP // STEP 1 OF 2</div>
          <h1 className="text-2xl text-term-heading font-bold mb-1">Create terminal account</h1>
          <p className="text-term-textDim text-xs mb-8">Phone number required for SMS-based login.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="FULL NAME" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} placeholder="John Smith" required />
            <Field label="EMAIL" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="trader@firm.com" required />
            <Field label="PASSWORD" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" required />
            <Field label="PHONE (E.164)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+15551234567" />

            {err && <div className="border border-term-red bg-term-red/10 text-term-red text-[10px] p-2 uppercase">{err}</div>}

            <button type="submit" disabled={loading} className="bb-button w-full justify-center" style={{ background: "var(--color-term-amber)", color: "#000", borderColor: "var(--color-term-amber)", padding: "8px", fontSize: "10px" }}>
              {loading ? "PROVISIONING..." : "▶ PROVISION TERMINAL"}
            </button>
          </form>

          <div className="mt-6 text-[10px] text-term-textDim text-center">
            EXISTING USER? <Link to="/login" className="text-term-amber hover:underline">SIGN IN</Link>
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bb-input w-full"
      />
    </label>
  );
}
