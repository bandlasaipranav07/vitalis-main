# Vitalis: Triage & Wellness Companion 🏥

**Clinical-Grade AI Triage | Safety-First Architecture | Multimodal Support**

Vitalis is a production-ready wellness and triage application designed to bridge the gap between patient symptoms and professional medical care. Built with a "Safety-First" philosophy, it uses advanced AI to analyze symptoms, images, and voice inputs to provide evidence-based triage guidance.

---

## 🌟 Key Features

### 🛡️ Safety & Triage
- **Real-Time Red Flag Monitor**: Instant detection of life-threatening symptoms (chest pain, stroke, etc.) with immediate emergency redirection.
- **Evidence-Based Categorization**: Every interaction ends with a clear triage category: *Self-Care, Consult Pharmacist, Schedule GP Visit, Urgent Care, or Emergency Room*.
- **Medication Weight-Check**: Mandatory weight verification for all medication-related queries to ensure safety awareness.

### 📸 Multimodal Analysis
- **Visual Triage**: Analyze photos of rashes, swelling, or injuries using Gemini's vision capabilities.
- **Voice Interaction**: Full voice-to-voice support for hands-free triage, supporting multiple languages (English, Hindi, Telugu, etc.).

### 🩺 Clinical Utility
- **Export to Doctor**: Generates a structured, professional clinical summary of the interaction, ready to be shared with a healthcare provider.
- **Smart Suggestions**: Contextual quick-replies that help users describe symptoms accurately and efficiently.
- **Emergency Offline Mode**: Persistent access to emergency contact numbers that work regardless of AI or internet status.

---

## 🛠️ Tech Stack

- **Frontend**: React js, TypeScript, Tailwind CSS
- **AI Engine**: Google Gemini 3.1 Pro & Flash (via `@google/genai`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Voice**: Web Speech API (SpeechRecognition & Synthesis)

---

## 📋 Clinical Directives (The "Doctor's Rules")

The AI operates under strict clinical constraints:
1. **Not a Doctor**: Mandatory disclaimer on every response.
2. **No Dosages**: Strictly forbidden from providing specific drug dosages.
3. **No Assumptions**: Must ask at least 2 clarifying questions for vague inputs.
4. **Objective Vision**: Describes images objectively without definitive diagnosis.
5. **WHO/NHS Standards**: All wellness information is sourced from global health guidelines.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Gemini API Key (from Google AI Studio)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## ⚠️ Disclaimer

**Vitalis is an AI-powered educational tool for wellness triage and is NOT a substitute for professional medical advice, diagnosis, or treatment.** Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.

---

*Built with ❤️ for a safer, healthier world.*
