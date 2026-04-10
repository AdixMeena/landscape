from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import groq
import json

load_dotenv()

# Debug environment variables
print("Environment variables loaded:")
print(f"SUPABASE_URL: {'SET' if os.getenv('SUPABASE_URL') else 'NOT SET'}")
print(f"SUPABASE_ANON_KEY: {'SET' if os.getenv('SUPABASE_ANON_KEY') else 'NOT SET'}")
print(f"GROQ_API_KEY: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
print(f"FRONTEND_URL: {os.getenv('FRONTEND_URL', 'NOT SET')}")

app = FastAPI(title="Personalized Learning Backend", version="1.0.0")

# CORS middleware to allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://landscape-delta-six.vercel.app",  # Vercel frontend URL
        os.getenv("FRONTEND_URL", "http://localhost:5173"),  # Railway frontend URL
        "https://*.up.railway.app",  # Allow all Railway domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client - initialize lazily
supabase = None
groq_client = None

def get_supabase():
    global supabase
    if supabase is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=500, detail="Supabase configuration missing")
        supabase = create_client(supabase_url, supabase_key)
    return supabase

def get_groq_client():
    global groq_client
    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Groq API key missing")
        groq_client = groq.Groq(api_key=api_key)
    return groq_client

# Pydantic models
class UserData(BaseModel):
    user_id: str
    quiz_scores: list[float]
    time_spent: list[int]  # in minutes
    topics_accessed: list[str]
    doubt_queries: list[str]

class PersonalizedPromptRequest(BaseModel):
    user_id: str
    query: str
    context: str = ""
    language: str = "english"  # "english" or "hindi"

class PersonalizedResponse(BaseModel):
    personalized_prompt: str
    response: str

# Dependency to get supabase client
def get_supabase():
    return supabase

# Function to analyze learning patterns
def analyze_learning_pattern(user_data: UserData):
    # Simple pattern analysis based on quiz scores and time spent
    avg_score = sum(user_data.quiz_scores) / len(user_data.quiz_scores) if user_data.quiz_scores else 0
    avg_time = sum(user_data.time_spent) / len(user_data.time_spent) if user_data.time_spent else 0
    topics_count = len(set(user_data.topics_accessed))
    doubts_count = len(user_data.doubt_queries)

    # Categorize based on thresholds
    if avg_score > 80 and avg_time > 30:
        pattern = "advanced_learner"
    elif avg_score > 60:
        pattern = "intermediate_learner"
    else:
        pattern = "beginner_learner"

    if doubts_count > 5:
        pattern += "_high_doubts"
    if topics_count > 10:
        pattern += "_diverse_topics"

    return pattern

# Endpoint to get personalized prompt and response
@app.post("/personalize", response_model=PersonalizedResponse)
async def personalize_response(request: PersonalizedPromptRequest):
    try:
        supabase = get_supabase()
        client = get_groq_client()
        # Fetch user data from Supabase
        user_response = supabase.table('profiles').select('*').eq('id', request.user_id).execute()
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = user_response.data[0]
        
        # Get learning profile if available
        learning_profile = user.get('learning_profile', '')
        
        # Analyze learning pattern (fallback if no profile)
        pattern = "general_learner"
        if not learning_profile:
            # Fallback to basic pattern analysis
            quiz_scores = user.get('quiz_scores', [])
            time_spent = user.get('time_spent', [])
            topics_accessed = user.get('topics_accessed', [])
            doubt_queries = user.get('doubt_queries', [])
            
            user_data = UserData(
                user_id=request.user_id,
                quiz_scores=quiz_scores,
                time_spent=time_spent,
                topics_accessed=topics_accessed,
                doubt_queries=doubt_queries
            )
            pattern = analyze_learning_pattern(user_data)
        
        # Create personalized prompt
        language_instruction = "Respond in English." if request.language.lower() == "english" else "Respond in Hindi."
        
        # Use learning profile if available, otherwise use pattern
        if learning_profile:
            base_prompt = f"User Learning Profile:\n{learning_profile}\n\n{language_instruction} Provide a response to: {request.query}"
        else:
            base_prompt = f"User is a {pattern.replace('_', ' ')}. {language_instruction} Provide a response to: {request.query}"
            
        if request.context:
            base_prompt += f" Context: {request.context}"
        
        # Generate response using Groq
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": 
                """You are an intelligent educational assistant designed to help users learn effectively. 
Your goal is to provide clear, accurate, and well-structured explanations tailored to the users learning level and patterns.

Guidelines:
1. Personalize responses based on the users experience level (beginner, intermediate, advanced) whenever possible.
2. Provide structured answers using sections, bullet points, or step-by-step explanations.
3. Explain concepts clearly with examples, analogies, or simple demonstrations when helpful.
4. Keep explanations concise but complete, avoiding unnecessary complexity.
5. Encourage learning by suggesting best practices, tips, or follow-up ideas.
6. When solving problems, show reasoning and steps so the user can understand the process.
7. Maintain a supportive and educational tone.

Output Format:
- Start with a short explanation of the concept.
- Provide a structured breakdown (steps, bullets, or sections).
- Include examples or practical applications when useful.
- End with a short summary or key takeaway..
"""},
                {"role": "user", "content": base_prompt}
            ],
            max_tokens=500
        )
        
        personalized_response = response.choices[0].message.content.strip()
        
        return PersonalizedResponse(
            personalized_prompt=base_prompt,
            response=personalized_response
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Get chat history for a user
@app.get("/chat-history/{user_id}")
async def get_chat_history(user_id: str):
    try:
        supabase = get_supabase()
        response = supabase.table('chat_messages').select('*').eq('user_id', user_id).order('created_at', desc=False).execute()
        return {"messages": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Generate personalized learning profile
@app.post("/generate-profile")
async def generate_learning_profile(request: dict):
    try:
        user_id = request.get("user_id")
        user_data = request.get("user_data", {})
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        
        # Format user data for analysis
        data_summary = format_user_data_for_analysis(user_data)
        
        # Create the analysis prompt
        analysis_prompt = f"""You are an AI learning analyst.

Below is a dataset containing a user's chat messages, questions, quiz answers, and interaction history.

Your task is to analyze this data and generate a concise but insightful PERSONALIZED LEARNING PROFILE for the user.

Focus on identifying patterns in:
- Learning style
- Knowledge level
- Common mistakes
- Strong areas
- Weak areas
- Question patterns
- Curiosity topics
- Response behavior
- Cognitive approach (analytical, memorization-based, conceptual, etc.)

Return the analysis in the following structured format:

1. USER SUMMARY
Brief 3–5 sentence overview of the user.

2. KNOWLEDGE LEVEL
Beginner / Intermediate / Advanced  
Explain why.

3. LEARNING STYLE
Examples:
- Visual learner
- Step-by-step learner
- Example-based learner
- Concept-first learner
- Practice-heavy learner

4. STRENGTH AREAS
List topics or skills the user seems strong in.

5. WEAK AREAS / KNOWLEDGE GAPS
Topics where the user struggles or shows confusion.

6. COMMON MISTAKES
Patterns of incorrect answers or misunderstandings.

7. QUESTION BEHAVIOR
How the user asks questions:
- Short / detailed
- Exploratory / exam-focused
- Conceptual / practical

8. ENGAGEMENT PATTERN
Examples:
- Curious learner
- Task-driven learner
- Passive learner
- Highly interactive learner

9. RECOMMENDED TEACHING STYLE
How AI should respond to this user:
- Short explanations
- Step-by-step breakdowns
- Real-world examples
- Analogies
- Quizzes
- Visual explanations

10. PERSONALIZED RESPONSE STRATEGY
Give 5 clear guidelines on how AI should respond to maximize this user's learning.

11. SUGGESTED NEXT LEARNING STEPS
Recommend topics or exercises tailored for this user.

IMPORTANT:
- Base everything ONLY on the provided data.
- Identify patterns instead of isolated examples.
- Be concise but insightful.
- Do not repeat the raw data.

DATASET STARTS BELOW:

{data_summary}"""
        
        # Generate the profile using Groq
        client = get_groq_client()
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You are an expert learning analyst. Generate detailed, insightful learning profiles based on user data."},
                {"role": "user", "content": analysis_prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        learning_profile = response.choices[0].message.content.strip()
        
        return {"learning_profile": learning_profile}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Generate personalized learning profile from interview
@app.post("/generate-profile-from-interview")
async def generate_profile_from_interview(request: dict):
    try:
        user_id = request.get("user_id")
        interview_responses = request.get("interview_responses", {})
        
        print(f"User ID: {user_id}")
        print(f"Interview responses: {interview_responses}")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        
        # Fetch existing profile if available
        supabase_client = get_supabase()
        try:
            existing_profile_response = supabase_client.table('profiles').select('learning_profile').eq('id', user_id).execute()
            existing_profile = ""
            if existing_profile_response.data and len(existing_profile_response.data) > 0 and existing_profile_response.data[0].get('learning_profile'):
                existing_profile = existing_profile_response.data[0]['learning_profile']
            print(f"Existing profile length: {len(existing_profile)}")
        except Exception as e:
            print(f"Error fetching existing profile: {e}")
            existing_profile = ""
        
        # Format interview responses for analysis
        interview_data = []
        for question_id, answer in interview_responses.items():
            interview_data.append(f"Question: {question_id}")
            interview_data.append(f"Answer: {answer.get('label', 'Unknown')} ({answer.get('value', 'unknown')})")
            interview_data.append("")
        
        formatted_data = "\n".join(interview_data)
        
        # Create analysis prompt
        analysis_prompt = f"""You are an AI learning analyst.

Below is a dataset containing a user's responses to a learning style interview.

Your task is to analyze this data and generate a concise but insightful PERSONALIZED LEARNING PROFILE for the user.

Focus on identifying patterns in:
- Learning style
- Knowledge level (assume beginner since this is initial assessment)
- Preferred teaching methods
- Motivation style
- Problem-solving approach
- Memory preferences
- Response to difficulty
- Study habits

Return the analysis in the following structured format:

1. USER SUMMARY
Brief 3–5 sentence overview of the user based on interview responses.

2. KNOWLEDGE LEVEL
Beginner (initial assessment)
Explain why based on responses.

3. LEARNING STYLE
Based on interview responses, identify primary learning style:
- Visual learner
- Auditory learner
- Reading/writing learner
- Kinesthetic/hands-on learner

4. STRENGTH AREAS
Based on preferences, what learning activities they might excel at.

5. WEAK AREAS / KNOWLEDGE GAPS
Areas they might struggle with based on their preferences.

6. COMMON MISTAKES
Potential mistakes they might make based on their learning style.

7. QUESTION BEHAVIOR
How they might ask questions based on their responses.

8. ENGAGEMENT PATTERN
Their likely engagement style in learning.

9. RECOMMENDED TEACHING STYLE
How AI should respond to this user based on their preferences.

10. PERSONALIZED RESPONSE STRATEGY
Give 5 clear guidelines on how AI should respond to maximize this user's learning.

11. SUGGESTED NEXT LEARNING STEPS
Recommend initial topics or exercises based on their profile.

IMPORTANT:
- Base everything ONLY on the provided interview responses.
- Be encouraging and positive.
- Focus on their stated preferences.
- Do not repeat the raw responses.

EXISTING LEARNING PROFILE (if any):
{existing_profile}

INTERVIEW RESPONSES START BELOW:

{formatted_data}"""
        
        # Generate the profile using Groq
        print("Calling Groq API...")
        client = get_groq_client()
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You are an expert learning analyst. Generate detailed, insightful learning profiles based on user interview responses."},
                {"role": "user", "content": analysis_prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        learning_profile = response.choices[0].message.content.strip()
        print(f"Generated profile length: {len(learning_profile)}")
        
        return {"learning_profile": learning_profile}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def format_user_data_for_analysis(user_data: dict) -> str:
    """Format user data into a readable string for analysis"""
    sections = []
    
    # Chat Messages
    if user_data.get("chat_messages"):
        sections.append("=== CHAT MESSAGES ===")
        for msg in user_data["chat_messages"][:20]:  # Limit to last 20 messages
            role = "USER" if msg["role"] == "user" else "AI"
            sections.append(f"{role}: {msg['content'][:200]}...")
        sections.append("")
    
    # Quiz Results
    if user_data.get("quizzes"):
        sections.append("=== QUIZ RESULTS ===")
        for quiz in user_data["quizzes"]:
            score_pct = (quiz["score"] / quiz["total"]) * 100 if quiz["total"] > 0 else 0
            sections.append(f"Quiz: {quiz.get('title', 'Untitled')} - Score: {quiz['score']}/{quiz['total']} ({score_pct:.1f}%)")
            if quiz.get("questions"):
                sections.append("Questions and answers:")
                for q in quiz["questions"][:5]:  # Limit questions
                    sections.append(f"Q: {q['question'][:100]}...")
                    sections.append(f"Correct: {q['correct']}, User chose: {quiz.get('answers', [])[q['id']] if q['id'] < len(quiz.get('answers', [])) else 'N/A'}")
        sections.append("")
    
    # YouTube Summaries
    if user_data.get("pdf_extractions"):
        sections.append("=== PDF EXTRACTIONS ===")
        for pdf in user_data["pdf_extractions"]:
            sections.append(f"Topic: {pdf.get('level', 'Unknown')} - Content: {pdf['result'][:300]}...")
        sections.append("")
    
    # Roadmap Progress
    if user_data.get("roadmaps"):
        sections.append("=== ROADMAP PROGRESS ===")
        for roadmap in user_data["roadmaps"]:
            subject_name = roadmap.get("subjects", {}).get("name", "Unknown Subject")
            sections.append(f"Subject: {subject_name}")
            # Parse roadmap JSON if available
            try:
                roadmap_data = json.loads(roadmap.get("roadmap_json", "{}"))
                if roadmap_data.get("phases"):
                    for phase in roadmap_data["phases"]:
                        completed = sum(1 for topic in phase.get("topics", []) if topic.get("done"))
                        total = len(phase.get("topics", []))
                        sections.append(f"Phase: {phase['title']} - Progress: {completed}/{total}")
            except:
                sections.append("Roadmap data parsing failed")
        sections.append("")
    
    return "\n".join(sections)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)