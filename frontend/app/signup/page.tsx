'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2, User, BookOpen, GraduationCap, CheckCircle2, ChevronRight, ChevronLeft, Info, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  
  // Step Management
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Step 1 State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [examiningBody, setExaminingBody] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  // Dropdown Data
  const examiningBodies = [
    'Faisalabad Medical University (FMU)',
    'Fatima Jinnah Medical University (FJMU)',
    'King Edward Medical University (KEMU)',
    'National University Of Medical Sciences (NUMS)',
    'Nishtar Medical University (NMU)',
    'Rawalpindi Medical University (RMU)',
    'University College of Medicine and Dentistry (UCMD)',
    'University of Health Sciences (UHS)',
    'Other'
  ];



  const handleUsernameCheck = (val: string) => {
    setUsername(val);
    if (val.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    // Mock debounced check
    setTimeout(() => {
      if (val.toLowerCase() === 'taken') {
        setUsernameAvailable(false);
      } else {
        setUsernameAvailable(true);
      }
    }, 500);
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && email && password.length >= 8) {
      setStep(2);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isMockMode = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock-project.supabase.co';
    
    if (isMockMode) {
      // Mock Registration logic
      setTimeout(() => {
        localStorage.setItem('mock_user_id', username);
        router.push('/dashboard');
      }, 1500);
      return;
    }

    // Real Supabase Registration Logic
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
            examining_body_id: examiningBody,
            academic_year: parseInt(academicYear)
          }
        }
      });

      if (authError) throw authError;
      
      // If session exists immediately, email confirmation is OFF — go straight to dashboard
      if (data.session) {
        router.push('/dashboard');
      } else {
        // Email confirmation is ON — show the check-your-email screen
        setRegisteredEmail(email);
        setEmailSent(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
      setLoading(false);
    }
  };

  // --- Email Confirmation Screen ---
  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-bg-surface border border-border px-8 py-10 shadow-sm sm:rounded-xl text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-5">
              <Mail className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary text-sm mb-1">
              We sent a confirmation link to:
            </p>
            <p className="font-semibold text-text-primary mb-5">{registeredEmail}</p>
            <p className="text-text-secondary text-sm">
              Click the link in the email to activate your account, then come back and log in.
            </p>
            <div className="mt-6 pt-5 border-t border-border">
              <Link href="/login">
                <button className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                  Go to Login →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-heading font-bold text-text-primary tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent hover:text-accent-hover transition-colors">
            Log in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-bg-surface border border-border px-4 py-8 shadow-sm sm:rounded-xl sm:px-12 relative overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-border">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out" 
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          <form className="space-y-6 mt-4" onSubmit={step === 1 ? nextStep : handleSignup}>
            {error && (
              <div className="rounded-md bg-error/10 p-4 border border-error/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fadeIn space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-text-primary">
                    Email address
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-text-secondary" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-2.5 pl-10 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 placeholder:text-text-secondary/50"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-text-primary">
                    Password (min. 8 characters)
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-text-secondary" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-2.5 pl-10 pr-10 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-secondary hover:text-text-primary focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="filled" size="lg" className="w-full justify-center mt-8">
                  Continue to Profile
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeIn space-y-5">
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium leading-6 text-text-primary">First name</label>
                    <input 
                      type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm" 
                      placeholder="John" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium leading-6 text-text-primary">Last name</label>
                    <input 
                      type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-text-primary">Username</label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-text-secondary" />
                    </div>
                    <input 
                      type="text" required value={username} onChange={e => handleUsernameCheck(e.target.value)}
                      className={`block w-full rounded-md border-0 py-2.5 pl-10 pr-10 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm ${
                        usernameAvailable === false ? 'ring-error focus:ring-error' : 
                        usernameAvailable === true ? 'ring-success focus:ring-success' : 'ring-border focus:ring-accent'
                      }`} 
                      placeholder="doctor123" 
                    />
                    {usernameAvailable === true && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                    )}
                    {usernameAvailable === false && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <AlertCircle className="h-5 w-5 text-error" />
                      </div>
                    )}
                  </div>
                  {usernameAvailable === false && <p className="mt-1 text-xs text-error">Username is already taken.</p>}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium leading-6 text-text-primary">Examining Body</label>
                    <div className="group relative flex items-center">
                      <Info className="w-4 h-4 text-text-secondary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-bg-surface-hover text-text-primary text-xs rounded-md border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none">
                        Medigify is currently optimized for the UHS curriculum. You are welcome to proceed if you would like to explore our resources and tools using this framework.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-surface-hover"></div>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <BookOpen className="h-5 w-5 text-text-secondary" />
                    </div>
                    <select
                      required
                      value={examiningBody}
                      onChange={(e) => setExaminingBody(e.target.value)}
                      className="block w-full rounded-md border-0 py-2.5 pl-10 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm appearance-none"
                    >
                      <option value="" disabled>Select your examining body</option>
                      {examiningBodies.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>



                <div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium leading-6 text-text-primary">Academic Year</label>
                    <div className="group relative flex items-center">
                      <Info className="w-4 h-4 text-text-secondary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-bg-surface-hover text-text-primary text-xs rounded-md border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none">
                        We are currently perfecting our First Year content library. Feel free to sign up and take a look around, we’re working hard to bring more years to the platform soon!
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-surface-hover"></div>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <GraduationCap className="h-5 w-5 text-text-secondary" />
                    </div>
                    <select
                      required
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="block w-full rounded-md border-0 py-2.5 pl-10 bg-bg-primary text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm appearance-none"
                    >
                      <option value="" disabled>Select your current year</option>
                      {[1,2,3,4,5].map(y => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} className="px-4">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                  </Button>
                  <Button type="submit" variant="filled" className="flex-1 justify-center" disabled={loading || usernameAvailable === false}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </Button>
                </div>
              </div>
            )}
            
          </form>
        </div>
      </div>
    </div>
  );
}
