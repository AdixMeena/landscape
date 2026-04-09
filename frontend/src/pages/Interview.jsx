import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/clients'
import toast from 'react-hot-toast'
import { User, Sparkles, ArrowRight, ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'learning_style',
    question: 'How do you prefer to learn new concepts?',
    options: [
      { value: 'visual', label: 'By watching videos or seeing diagrams', icon: '👁️' },
      { value: 'auditory', label: 'By listening to explanations or discussions', icon: '👂' },
      { value: 'reading', label: 'By reading books or articles', icon: '📖' },
      { value: 'hands_on', label: 'By doing practical exercises or projects', icon: '🛠️' }
    ]
  },
  {
    id: 'problem_solving',
    question: 'When solving a problem, you usually:',
    options: [
      { value: 'step_by_step', label: 'Break it down into small, logical steps', icon: '📋' },
      { value: 'intuition', label: 'Trust your gut feeling and try different approaches', icon: '💡' },
      { value: 'examples', label: 'Look for similar examples or patterns', icon: '🔍' },
      { value: 'ask_help', label: 'Ask others for guidance or hints', icon: '🤝' }
    ]
  },
  {
    id: 'memory_style',
    question: 'What helps you remember information best?',
    options: [
      { value: 'repetition', label: 'Repeating and reviewing multiple times', icon: '🔄' },
      { value: 'stories', label: 'Connecting facts into stories or narratives', icon: '📚' },
      { value: 'visualization', label: 'Creating mental images or mind maps', icon: '🧠' },
      { value: 'practice', label: 'Applying knowledge through practice', icon: '⚡' }
    ]
  },
  {
    id: 'mistake_handling',
    question: 'When you make a mistake, you typically:',
    options: [
      { value: 'analyze', label: 'Analyze what went wrong and fix it', icon: '🔬' },
      { value: 'frustrated', label: 'Get frustrated and want immediate help', icon: '😤' },
      { value: 'try_again', label: 'Keep trying different approaches', icon: '🔄' },
      { value: 'avoid', label: 'Avoid similar problems in the future', icon: '🚫' }
    ]
  },
  {
    id: 'explanation_preference',
    question: 'You understand concepts better when explanations are:',
    options: [
      { value: 'detailed', label: 'Very detailed with all the background', icon: '📝' },
      { value: 'concise', label: 'Short and to the point', icon: '💬' },
      { value: 'examples', label: 'Full of real-world examples', icon: '🌍' },
      { value: 'analogies', label: 'Using analogies and metaphors', icon: '🎭' }
    ]
  },
  {
    id: 'motivation',
    question: 'What motivates you most in learning?',
    options: [
      { value: 'achievement', label: 'Achieving goals and getting good grades', icon: '🏆' },
      { value: 'curiosity', label: 'Satisfying curiosity about how things work', icon: '🔍' },
      { value: 'practical', label: 'Learning skills useful for real life', icon: '🛠️' },
      { value: 'social', label: 'Impressing others or working in groups', icon: '👥' }
    ]
  },
  {
    id: 'time_preference',
    question: 'When do you study best?',
    options: [
      { value: 'morning', label: 'Early morning when fresh and focused', icon: '🌅' },
      { value: 'evening', label: 'Evening when the day is winding down', icon: '🌙' },
      { value: 'short_sessions', label: 'Short, frequent study sessions', icon: '⏱️' },
      { value: 'long_sessions', label: 'Long, deep focus sessions', icon: '🕐' }
    ]
  },
  {
    id: 'difficulty_preference',
    question: 'When facing difficult topics, you prefer to:',
    options: [
      { value: 'break_down', label: 'Break them into smaller, manageable parts', icon: '✂️' },
      { value: 'overview_first', label: 'Get the big picture first, then details', icon: '🎯' },
      { value: 'skip_difficult', label: 'Skip the hard parts and come back later', icon: '⏭️' },
      { value: 'persistent', label: 'Keep working until you understand', icon: '💪' }
    ]
  }
]

export default function Interview() {
  const { user, profile, updateProfile } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [generating, setGenerating] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    // Check if user already has a learning profile
    if (profile?.learning_profile) {
      toast.info('You already have a personalized profile! Redirecting to profile page...')
      setTimeout(() => window.location.href = '/profile', 2000)
    }
  }, [profile])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      generateProfile()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const generateProfile = async () => {
    setGenerating(true)
    try {
      // Send to backend for analysis
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-profile-from-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          interview_responses: answers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate profile')
      }

      const result = await response.json()
      const profileText = result.learning_profile

      // Store in database
      await supabase.from('profiles').update({
        learning_profile: profileText,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)

      setCompleted(true)
      toast.success('Learning profile created! 🎉')

      // Redirect to profile after showing completion
      setTimeout(() => {
        window.location.href = '/profile'
      }, 3000)

    } catch (error) {
      console.error('Error generating profile:', error)
      toast.error('Failed to create learning profile')
    } finally {
      setGenerating(false)
    }
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const currentQ = QUESTIONS[currentQuestion]
  const isAnswered = answers[currentQ?.id]

  if (generating) {
    return (
      <div style={{ padding: '28px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🧠</div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Analyzing Your Responses</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24 }}>Creating your personalized learning profile...</p>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.3)', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    )
  }

  if (completed) {
    return (
      <div style={{ padding: '28px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Profile Created Successfully!</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24 }}>Your personalized learning environment is ready. Redirecting to your profile...</p>
        <CheckCircle size={48} color="#34d399" />
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 24px', maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <MessageCircle size={28} color="#a78bfa" />
        </div>
        <h1 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>Learning Style Interview</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Help us understand how you learn best! This will create your personalized learning environment.</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600 }}>
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </span>
          <span style={{ color: '#a78bfa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600 }}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
            borderRadius: 100,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f1f5f9', fontSize: '1.1rem', marginBottom: 20 }}>
          {currentQ.question}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          {currentQ.options.map((option) => {
            const isSelected = answers[currentQ.id]?.value === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option)}
                style={{
                  padding: '16px 18px',
                  borderRadius: 12,
                  border: isSelected ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'rgba(255,255,255,0.05)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'rgba(255,255,255,0.02)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                  }
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                <div>
                  <div style={{
                    color: isSelected ? '#a78bfa' : '#cbd5e1',
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    marginBottom: 2
                  }}>
                    {option.label}
                  </div>
                </div>
                {isSelected && <CheckCircle size={16} color="#7c3aed" style={{ marginLeft: 'auto' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            color: currentQuestion === 0 ? '#475569' : '#cbd5e1',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'Syne',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: isAnswered ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(255,255,255,0.05)',
            color: isAnswered ? 'white' : '#64748b',
            cursor: isAnswered ? 'pointer' : 'not-allowed',
            fontFamily: 'Syne',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {currentQuestion === QUESTIONS.length - 1 ? 'Generate Profile' : 'Next'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
  
}