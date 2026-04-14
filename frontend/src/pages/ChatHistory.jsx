import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/clients'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MessageCircle, Bot, User, Calendar, Clock } from 'lucide-react'
import '../styles/markdown.css'



export default function ChatHistory() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [groupedMessages, setGroupedMessages] = useState({})
  useEffect(() => {
    if (user?.id) fetchChatHistory()
  }, [user?.id])

  async function fetchChatHistory() {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      const items = data || []
      setMessages(items)

      // Group messages by date
      const grouped = items.reduce((acc, msg) => {
        const date = new Date(msg.created_at).toDateString()
        if (!acc[date]) acc[date] = []
        acc[date].push(msg)
        return acc
      }, {})
      setGroupedMessages(grouped)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <MessageCircle className="text-purple-400" />
          Chat History
        </h1>
        <p className="text-gray-400">View all your previous conversations with Pluton AI</p>
      </div>

      {Object.keys(groupedMessages).length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No chat history yet. Start a conversation in Doubt Finisher!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Calendar size={16} className="text-purple-400" />
                <span className="text-white font-medium">{date}</span>
                <span className="text-gray-400 text-sm">({msgs.length} messages)</span>
              </div>

              <div className="space-y-5">
                {msgs.map((msg, index) => (
                  <div key={msg.id || index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}

                    <div className={`max-w-[80%] rounded-2xl p-4 border ${
                      msg.role === 'user'
                        ? 'bg-purple-600/80 text-white border-purple-500/40'
                        : 'bg-slate-900/70 text-gray-200 border-white/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.role === 'user' ? (
                          <User size={14} className="text-purple-200" />
                        ) : (
                          <Bot size={14} className="text-purple-300" />
                        )}
                        <span className="text-xs opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>

                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-md text-sm"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-black/30 px-1 py-0.5 rounded text-sm" {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}