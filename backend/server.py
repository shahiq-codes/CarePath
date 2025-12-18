from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class SymptomAnalysisRequest(BaseModel):
    symptoms: str
    language: str = "en"
    session_id: Optional[str] = None

class SymptomAnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    session_id: str
    possible_conditions: List[dict]
    recommended_specialists: List[str]
    urgency_level: str
    confidence: str
    disclaimer: str

class DoctorSuggestion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    specialty: str
    experience_years: int
    rating: float
    distance: str
    availability: str
    hospital: str
    image_url: str

class CarePathway(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    steps: List[dict]
    estimated_timeline: str
    follow_up_required: bool

class SearchHistoryEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    symptoms: str
    language: str
    analysis_result: dict
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper Functions
async def get_ai_symptom_analysis(symptoms: str, language: str, session_id: str) -> dict:
    """Use OpenAI GPT-5.1 to analyze symptoms and provide recommendations"""
    
    system_message = f"""You are a medical navigation assistant helping patients understand their symptoms and find appropriate care.
    
IMPORTANT: You are NOT providing medical diagnosis. You are helping patients navigate to the right healthcare professionals.

When analyzing symptoms, provide:
1. Possible related conditions (2-4 options)
2. Recommended specialist types
3. Urgency level (Emergency, Consult Soon, Routine)
4. Confidence level (High, Medium, Low)

Respond in {language} language.

Format your response as JSON with this structure:
{{
    "possible_conditions": [
        {{"name": "condition name", "probability": "high/medium/low", "description": "brief description"}}
    ],
    "recommended_specialists": ["Cardiologist", "General Physician"],
    "urgency_level": "Routine",
    "confidence": "Medium",
    "general_advice": "brief advice"
}}"""
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5.1")
        
        user_message = UserMessage(
            text=f"Patient symptoms: {symptoms}. Please analyze and provide navigation guidance."
        )
        
        response = await chat.send_message(user_message)
        
        # Parse the JSON response
        import json
        # Extract JSON from response if it's wrapped in markdown code blocks
        response_text = response.strip()
        if response_text.startswith("```"):
            # Remove markdown code blocks
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:-1]) if len(lines) > 2 else response_text
            response_text = response_text.replace("```json", "").replace("```", "")
        
        analysis = json.loads(response_text)
        return analysis
        
    except Exception as e:
        logging.error(f"AI Analysis Error: {str(e)}")
        # Return a fallback response
        return {
            "possible_conditions": [
                {"name": "General Health Concern", "probability": "medium", "description": "Based on your symptoms, you should consult a healthcare professional."}
            ],
            "recommended_specialists": ["General Physician"],
            "urgency_level": "Consult Soon",
            "confidence": "Low",
            "general_advice": "Please consult with a healthcare provider for proper evaluation."
        }

def get_mock_doctors(specialists: List[str]) -> List[dict]:
    """Return mock doctor data based on specialist types"""
    mock_doctors = [
        {
            "id": "doc1",
            "name": "Dr. Sarah Mitchell",
            "specialty": "General Physician",
            "experience_years": 15,
            "rating": 4.8,
            "distance": "2.3 km",
            "availability": "Available Today",
            "hospital": "City General Hospital",
            "image_url": "https://images.unsplash.com/photo-1622253694238-3b22139576c6"
        },
        {
            "id": "doc2",
            "name": "Dr. James Chen",
            "specialty": "Cardiologist",
            "experience_years": 20,
            "rating": 4.9,
            "distance": "3.1 km",
            "availability": "Tomorrow 10 AM",
            "hospital": "Heart Care Center",
            "image_url": "https://images.unsplash.com/photo-1622253694238-3b22139576c6"
        },
        {
            "id": "doc3",
            "name": "Dr. Maria Rodriguez",
            "specialty": "Neurologist",
            "experience_years": 18,
            "rating": 4.7,
            "distance": "4.5 km",
            "availability": "Available Today",
            "hospital": "Neuro Wellness Institute",
            "image_url": "https://images.unsplash.com/photo-1622253694238-3b22139576c6"
        },
        {
            "id": "doc4",
            "name": "Dr. Rajesh Kumar",
            "specialty": "Orthopedic Surgeon",
            "experience_years": 22,
            "rating": 4.9,
            "distance": "1.8 km",
            "availability": "Tomorrow 2 PM",
            "hospital": "Bone & Joint Clinic",
            "image_url": "https://images.unsplash.com/photo-1622253694238-3b22139576c6"
        },
        {
            "id": "doc5",
            "name": "Dr. Emily Thompson",
            "specialty": "Dermatologist",
            "experience_years": 12,
            "rating": 4.6,
            "distance": "3.7 km",
            "availability": "Available Today",
            "hospital": "Skin Care Specialists",
            "image_url": "https://images.unsplash.com/photo-1622253694238-3b22139576c6"
        },
        {
            "id": "doc6",
            "name": "Dr. Ahmed Hassan",
            "specialty": "Gastroenterologist",
            "experience_years": 16,
            "rating": 4.8,
            "distance": "2.9 km",
            "availability": "Tomorrow 11 AM",
            "hospital": "Digestive Health Center",
            "image_url": "https://images.unsplash.com/photo-1622253694238-3b22139576c6"
        }
    ]
    
    # Filter doctors based on recommended specialists
    if specialists:
        filtered = [doc for doc in mock_doctors if doc["specialty"] in specialists]
        if filtered:
            return filtered
    
    return mock_doctors[:4]  # Return first 4 as default

def generate_care_pathway(urgency: str, specialists: List[str]) -> dict:
    """Generate a care pathway based on urgency and specialists"""
    
    if urgency == "Emergency":
        return {
            "steps": [
                {"step": 1, "action": "Seek immediate medical attention", "description": "Go to nearest emergency room or call emergency services", "icon": "ambulance"},
                {"step": 2, "action": "Initial assessment", "description": "Emergency physician will evaluate your condition", "icon": "stethoscope"},
                {"step": 3, "action": "Specialist consultation", "description": "Specialist will be called if needed", "icon": "user-doctor"},
                {"step": 4, "action": "Follow-up care", "description": "Schedule follow-up appointments as directed", "icon": "calendar"}
            ],
            "estimated_timeline": "Immediate - Same Day",
            "follow_up_required": True
        }
    elif urgency == "Consult Soon":
        return {
            "steps": [
                {"step": 1, "action": "Book appointment", "description": f"Schedule with {specialists[0] if specialists else 'General Physician'} within 24-48 hours", "icon": "calendar-check"},
                {"step": 2, "action": "Initial consultation", "description": "Doctor will examine and discuss your symptoms", "icon": "stethoscope"},
                {"step": 3, "action": "Diagnostic tests", "description": "May require blood work, imaging, or other tests", "icon": "vial"},
                {"step": 4, "action": "Treatment plan", "description": "Receive personalized treatment recommendations", "icon": "prescription"},
                {"step": 5, "action": "Follow-up", "description": "Monitor progress and adjust treatment as needed", "icon": "heart-pulse"}
            ],
            "estimated_timeline": "1-2 weeks",
            "follow_up_required": True
        }
    else:  # Routine
        return {
            "steps": [
                {"step": 1, "action": "Schedule appointment", "description": f"Book with {specialists[0] if specialists else 'General Physician'} at your convenience", "icon": "calendar"},
                {"step": 2, "action": "Consultation", "description": "Discuss your health concerns with the doctor", "icon": "comments"},
                {"step": 3, "action": "Preventive care", "description": "Get recommendations for maintaining good health", "icon": "shield-heart"},
                {"step": 4, "action": "Lifestyle guidance", "description": "Receive advice on diet, exercise, and wellness", "icon": "leaf"}
            ],
            "estimated_timeline": "Flexible - Within 1-2 weeks",
            "follow_up_required": False
        }

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "CarePath API - Healthcare Navigation System"}

@api_router.post("/analyze-symptom", response_model=SymptomAnalysisResponse)
async def analyze_symptom(request: SymptomAnalysisRequest):
    """Analyze symptoms using AI and provide recommendations"""
    
    session_id = request.session_id or str(uuid.uuid4())
    
    try:
        # Get AI analysis
        analysis = await get_ai_symptom_analysis(
            request.symptoms,
            request.language,
            session_id
        )
        
        # Store in database
        history_entry = SearchHistoryEntry(
            session_id=session_id,
            symptoms=request.symptoms,
            language=request.language,
            analysis_result=analysis
        )
        
        doc = history_entry.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.search_history.insert_one(doc)
        
        # Prepare response
        response = SymptomAnalysisResponse(
            session_id=session_id,
            possible_conditions=analysis.get("possible_conditions", []),
            recommended_specialists=analysis.get("recommended_specialists", []),
            urgency_level=analysis.get("urgency_level", "Routine"),
            confidence=analysis.get("confidence", "Medium"),
            disclaimer="This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and treatment."
        )
        
        return response
        
    except Exception as e:
        logging.error(f"Error in symptom analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Error analyzing symptoms")

@api_router.get("/doctors", response_model=List[DoctorSuggestion])
async def get_doctors(specialists: Optional[str] = None):
    """Get doctor suggestions based on specialist types"""
    
    specialist_list = specialists.split(",") if specialists else []
    doctors = get_mock_doctors(specialist_list)
    
    return [DoctorSuggestion(**doc) for doc in doctors]

@api_router.get("/care-pathway", response_model=CarePathway)
async def get_care_pathway(urgency: str = "Routine", specialists: str = ""):
    """Get care pathway based on urgency level"""
    
    specialist_list = specialists.split(",") if specialists else []
    pathway = generate_care_pathway(urgency, specialist_list)
    
    return CarePathway(**pathway)

@api_router.get("/search-history/{session_id}")
async def get_search_history(session_id: str):
    """Get search history for a session"""
    
    history = await db.search_history.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(10)
    
    return history

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()