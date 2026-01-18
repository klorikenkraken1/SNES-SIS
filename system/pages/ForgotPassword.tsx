import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Key, ShieldCheck, 
  RefreshCcw, CheckCircle2, ShieldAlert,
  ArrowRight, Loader2
} from 'lucide-react';

const LOGO_URL = "https://raw.githubusercontent.com/Golgrax/randompublicimagefreetouse/refs/heads/main/logo.png";
const BG_URL = "https://raw.githubusercontent.com/Golgrax/randompublicimagefreetouse/refs/heads/main/login-background.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token');

  useEffect(() => {
    if (urlToken) {
      setInputToken(urlToken);
      setStep(2);
    }
  }, [urlToken]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        // Automatically advance to step 2 for manual entry
        setStep(2);
      } else {
        setError(data.message || 'Failed to send recovery link.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed relative flex items-center justify-center overflow-hidden p-6"
      style={{ backgroundImage: `url('${BG_URL}')` }}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[4px]"></div>

      <div className="w-full max-w-xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/85 backdrop-blur-2xl p-12 rounded-[4rem] border-2 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white p-2 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
               <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">Account Recovery</h1>
            <p className="text-[10px] font-black text-school-gold uppercase tracking-[0.4em]">Sto. Niño Security Protocol</p>
          </div>

          {step === 1 && (
            <form onSubmit={handleVerifyEmail} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4">Identity Verification</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-6 text-white/30" size={24} />
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/5 border-2 border-white/5 focus:border-school-gold outline-none font-bold text-white shadow-xl transition-all placeholder:text-slate-500"
                    placeholder="Enter your registered email"
                  />
                </div>
                {error && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-4 animate-shake">{error}</p>}
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  disabled={isLoading}
                  className="w-full bg-white text-slate-900 font-black py-6 rounded-[2rem] hover:bg-school-gold hover:text-school-navy transition-all flex items-center justify-center gap-4 group uppercase tracking-[0.2em] text-xs shadow-2xl"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={22} /> : 'Send Recovery Token'}
                  {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
                </button>
                <Link to="/" className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest py-2">
                  <ArrowLeft size={16} /> Back to Auth Gate
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} className="space-y-8 animate-in slide-in-from-bottom-10">
              <div className="p-6 bg-amber-500/10 border-2 border-amber-500/20 rounded-[2rem] flex items-start gap-4 mb-4">
                <ShieldCheck className="text-amber-500 shrink-0" size={24} />
                <p className="text-[10px] font-bold text-amber-100 uppercase tracking-widest leading-relaxed">
                  Token sent to {email}. Check your inbox and paste it below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4">Recovery Token</label>
                  <div className="relative flex items-center">
                    <Key className="absolute left-6 text-white/30" size={24} />
                    <input 
                      type="text" required value={inputToken} onChange={(e) => setInputToken(e.target.value)}
                      className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/5 border-2 border-white/5 focus:border-school-gold outline-none font-bold text-white shadow-xl transition-all placeholder:text-slate-500"
                      placeholder="Paste token here"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4">New Security Key</label>
                  <div className="relative flex items-center">
                    <ShieldAlert className="absolute left-6 text-white/30" size={24} />
                    <input 
                      type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/5 border-2 border-white/5 focus:border-school-gold outline-none font-bold text-white shadow-xl transition-all placeholder:text-slate-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4">Confirm New Key</label>
                  <div className="relative flex items-center">
                    <ShieldAlert className="absolute left-6 text-white/30" size={24} />
                    <input 
                      type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/5 border-2 border-white/5 focus:border-school-gold outline-none font-bold text-white shadow-xl transition-all placeholder:text-slate-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                {error && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-4 animate-shake">{error}</p>}
              </div>

              <button 
                disabled={isLoading}
                className="w-full bg-school-gold text-school-navy font-black py-6 rounded-[2rem] hover:brightness-110 transition-all flex items-center justify-center gap-4 group uppercase tracking-[0.2em] text-xs shadow-2xl"
              >
                {isLoading ? <Loader2 className="animate-spin" size={22} /> : 'Override System Key'}
                {!isLoading && <RefreshCcw size={22} className="group-hover:rotate-180 transition-transform duration-700" />}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-10 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                <CheckCircle2 size={56} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Key Updated</h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xs mx-auto">
                  Your identity has been re-secured. You can now use your new key to authorize device access.
                </p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-white text-slate-900 font-black py-6 rounded-[2rem] hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-[0.2em] text-xs shadow-2xl"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;