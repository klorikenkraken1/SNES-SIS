import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types';
import { api } from '../../src/api'; 
import { UserPlus, ArrowRight, CheckCircle, Plus, User as UserIcon, FileText, ShieldAlert } from 'lucide-react';

const SecretAdmission: React.FC<{ user: User }> = ({ user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    firstName: '',
    middleName: '',
    lastName: '',
    extension: '',
    email: '', 
    targetGrade: 'Grade 1', 
    previousSchool: '', 
    parentName: '',
    parentContact: ''
  });
  const [sf9Files, setSf9Files] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Allow admins to override email verification check for manual entry
  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('middleName', formData.middleName);
      data.append('lastName', formData.lastName);
      data.append('extension', formData.extension);
      data.append('email', formData.email);
      data.append('targetGrade', formData.targetGrade);
      data.append('previousSchool', formData.previousSchool);
      data.append('parentName', formData.parentName);
      data.append('parentContact', formData.parentContact);
      
      if (sf9Files.length > 0) {
          sf9Files.forEach(file => {
              data.append('sf9', file);
          });
      }

      await api.submitApplication(data);
      setStep(3);
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setSf9Files(Array.from(e.target.files));
      }
  };

  const resetForm = () => {
      setStep(1);
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        extension: '',
        email: '', 
        targetGrade: 'Grade 1', 
        previousSchool: '', 
        parentName: '',
        parentContact: ''
      });
      setSf9Files([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100">
          <UserPlus size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Manual Admission Entry</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Directly enroll students into the system. <span className="text-indigo-500 font-bold">Administrative Use.</span></p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm">
        {step === 1 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><UserIcon size={24}/></div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Learner Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Name Components</label>
                </div>
                <input 
                  type="text" required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Middle Name (Optional)"
                  value={formData.middleName}
                  onChange={e => setFormData({...formData, middleName: e.target.value})}
                />
                <input 
                  type="text" required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Ext (e.g. Jr.)"
                  value={formData.extension}
                  onChange={e => setFormData({...formData, extension: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Email Address (For System Access)</label>
                <input 
                  type="email" required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="student@snes.edu.ph"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Target Grade</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  value={formData.targetGrade}
                  onChange={e => setFormData({...formData, targetGrade: e.target.value})}
                >
                  {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Previous School</label>
                <input 
                  type="text" required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="School Name"
                  value={formData.previousSchool}
                  onChange={e => setFormData({...formData, previousSchool: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2">Guardian Name</label>
                <input 
                  type="text" required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Guardian's Name"
                  value={formData.parentName}
                  onChange={e => setFormData({...formData, parentName: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button onClick={() => setStep(2)} className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                Next: Requirements
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><FileText size={24}/></div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Documents</h2>
            </div>
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx,image/*" 
                multiple
                onChange={handleFileChange} 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`p-10 border-4 border-dashed rounded-[2.5rem] text-center transition-all cursor-pointer group ${
                    sf9Files.length > 0 ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 hover:bg-white hover:border-rose-200'
                }`}
              >
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors shadow-sm ${
                     sf9Files.length > 0 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-300 group-hover:text-rose-500'
                 }`}>
                    {sf9Files.length > 0 ? <CheckCircle size={32} /> : <Plus size={32} />}
                 </div>
                 <p className={`text-lg font-black uppercase tracking-tight ${sf9Files.length > 0 ? 'text-emerald-700' : 'text-slate-700 dark:text-slate-200'}`}>
                     {sf9Files.length > 0 ? `${sf9Files.length} Files Selected` : 'Upload Report Card (SF9)'}
                 </p>
                 <p className="text-xs text-slate-400 mt-2 font-bold">{sf9Files.length > 0 ? 'Click to add/change' : 'OPTIONAL FOR MANUAL ENTRY'}</p>
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <button onClick={() => setStep(1)} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all">Back</button>
              <button 
                onClick={handleSubmit} 
                className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform shadow-xl bg-rose-600 text-white hover:scale-105"
              >
                Submit Manual Application
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10 space-y-8">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in-50 duration-500">
              <CheckCircle size={56} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Application Created!</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium max-w-sm mx-auto">This application is now visible in the Admissions Queue for approval.</p>
            </div>
            <div className="flex gap-4 justify-center pt-6">
              <button onClick={() => navigate('/faculty-requests')} className="px-10 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                Go to Admissions Queue
              </button>
              <button onClick={resetForm} className="px-10 py-4 bg-rose-100 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-200 transition-colors">
                Add Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretAdmission;
