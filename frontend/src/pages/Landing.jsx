import { useNavigate } from 'react-router-dom'
import StarField from '../components/StarField'
import { Zap, Youtube, FileText, Brain, MessageCircle, Map, CheckSquare, ArrowRight, Star, Sparkles, Wand2, Timer } from 'lucide-react'

const features = [
  { icon: Youtube, label: 'YT Summarizer', desc: 'Paste any YouTube link → get smart notes tailored to your level', color: '#ef4444' },
  { icon: FileText, label: 'PDF Extractor', desc: 'Upload PDFs → extract key questions & answers instantly', color: '#a78bfa' },
  { icon: Brain, label: 'Quiz Lab', desc: 'Generate quizzes from notes or YT summaries to test yourself', color: '#fbbf24' },
  { icon: MessageCircle, label: 'Doubt Finisher', desc: 'Ask anything — AI explains in simple, clear English', color: '#34d399' },
  { icon: Map, label: 'Roadmap Tracker', desc: 'Visual learning paths for every subject you add', color: '#60a5fa' },
  { icon: CheckSquare, label: 'To-Do & Journal', desc: 'Plan your day and reflect with your personal study journal', color: '#f472b6' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#03040a', position: 'relative', overflow: 'hidden' }}>
      <StarField count={120} />

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(3,4,10,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
          }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: '#f1f5f9' }}>Pluton</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="ghost-btn" onClick={() => navigate('/auth')} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Sign In
          </button>
          <button className="nebula-btn" onClick={() => navigate('/auth?mode=signup')} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', padding: '120px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 18, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="label-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} /> AI Learning Studio
              </span>
            </div>

            <h1 className="animate-fade-in-up stagger-2" style={{
              fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em',
              fontSize: 'clamp(2.6rem, 6vw, 5.2rem)', color: '#f1f5f9', marginBottom: 18,
            }}>
              Your personal AI.
              <span className="shimmer-text"> Your perfect pace</span>
            </h1>

            <p className="animate-fade-in-up stagger-3" style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#94a3b8', lineHeight: 1.7, marginBottom: 28,
              maxWidth: 540,
            }}>
              Pluton adapts to how you learn. Summaries, quizzes, roadmaps, and a personal tutor — stitched into one sharp, fast workspace.
            </p>

            <div className="animate-fade-in-up stagger-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="nebula-btn"
                onClick={() => navigate('/auth?mode=signup')}
                style={{ fontSize: '1rem', padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Start Learning Free <ArrowRight size={16} />
              </button>
              <button
                className="ghost-btn"
                onClick={() => navigate('/auth')}
                style={{ fontSize: '1rem', padding: '14px 30px' }}
              >
                Sign In
              </button>
            </div>

            <div className="animate-fade-in-up stagger-5" style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Built for students, by students 🎓</span>
            </div>
          </div>

          {/* Hero preview */}
          <div className="animate-fade-in-up stagger-3" style={{ position: 'relative' }}>
            <div className="hero-panel" style={{
              padding: 22,
              borderRadius: 22,
              border: '1px solid rgba(124,58,237,0.3)',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(52,211,153,0.06))',
              boxShadow: '0 30px 80px rgba(2,6,23,0.55)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={14} color="white" />
                  </div>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>Pluton Workspace</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Live Preview</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
                <div className="glass-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Wand2 size={14} color="#a78bfa" />
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'Syne', fontWeight: 600 }}>AI Summary</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 10 }}>
                    <div style={{ width: '68%', height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #7c3aed, #34d399)' }} />
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6 }}>
                    Key ideas extracted, simplified, and organized for your level.
                  </p>
                </div>

                <div className="glass-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Timer size={14} color="#34d399" />
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'Syne', fontWeight: 600 }}>Daily Plan</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, color: '#94a3b8', fontSize: '0.75rem' }}>
                    <li>Review: Arrays & Pointers</li>
                    <li>Quiz: 10 questions</li>
                    <li>Roadmap: Phase 2</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
                <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>12</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Quizzes</div>
                </div>
                <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>6</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Subjects</div>
                </div>
                <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>84%</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Consistency</div>
                </div>
              </div>
            </div>

            <div style={{
              position: 'absolute', inset: -20, borderRadius: 30,
              background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 65%)',
              filter: 'blur(30px)', zIndex: -1
            }} />
          </div>
        </div>

        {/* Floating orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '8%', width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent)',
          borderRadius: '50%', filter: 'blur(30px)', animation: 'float 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '18%', right: '10%', width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(52,211,153,0.14), transparent)',
          borderRadius: '50%', filter: 'blur(30px)', animation: 'float 9s ease-in-out infinite 2s',
        }} />
      </section>

      {/* How it works */}
      <section style={{ padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="label-tag" style={{ marginBottom: 16, display: 'inline-block' }}>Simple flow</span>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              A study loop that sticks
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {[
              { icon: Youtube, title: 'Collect', text: 'Drop a YouTube link or PDF. We extract only what matters.' },
              { icon: Brain, title: 'Practice', text: 'Generate quizzes and get instant explanations.' },
              { icon: Map, title: 'Progress', text: 'Track your roadmap and focus on gaps.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-card-hover" style={{ padding: 22 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={18} color="#a78bfa" />
                </div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: 8 }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="label-tag" style={{ marginBottom: 16, display: 'inline-block' }}>Everything you need</span>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              One platform, infinite learning
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {features.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="glass-card-hover" style={{ padding: '26px 22px' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: 8 }}>{label}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section style={{ padding: '20px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '26px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, textAlign: 'center' }}>
            {[
              { label: 'Avg. study focus', value: '2.4x' },
              { label: 'Notes saved', value: '14k+' },
              { label: 'Quiz accuracy', value: '82%' },
              { label: 'Time saved', value: '6 hrs/wk' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, color: '#f8fafc', fontSize: '1.3rem' }}>{item.value}</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px 120px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to launch your learning? 🚀
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
            Join Pluton today — free for students. No credit card needed.
          </p>
          <button
            className="nebula-btn"
            onClick={() => navigate('/auth?mode=signup')}
            style={{ fontSize: '1.05rem', padding: '16px 40px' }}
          >
            Create Free Account ✨
          </button>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
