const fs = require('fs');
const path = require('path');

// 1. Update api/_lib/local-clinical-engine.ts disclaimers
const enginePath = path.join(__dirname, '..', 'api', '_lib', 'local-clinical-engine.ts');
let engineContent = fs.readFileSync(enginePath, 'utf8');

// Replace disclaimers in LOCALIZED_CLINICAL_MAP
engineContent = engineContent.replace(
  /disclaimer: "👋 Hello! I'm your Vitalis health companion. I'm not a doctor; this is for educational triage and wellness support only.\\n\\n"/,
  'disclaimer: "👋 Hello! I\'m your Vitalis health companion. I\'m not a doctor; this is for educational triage and wellness support only. All recommendations and clinical assessments align with WHO and NHS guidelines.\\n\\n"'
);

engineContent = engineContent.replace(
  /disclaimer: "👋 नमस्ते! मैं आपका वाइटलिस स्वास्थ्य साथी हूँ। मैं डॉक्टर नहीं हूँ; यह केवल शैक्षिक ट्राइएज और कल्याण सहायता के लिए है।\\n\\n"/,
  'disclaimer: "👋 नमस्ते! मैं आपका वाइटलिस स्वास्थ्य साथी हूँ। मैं डॉक्टर नहीं हूँ; यह केवल शैक्षिक ट्राइएज और कल्याण सहायता के लिए है। यह विश्लेषण डब्ल्यूएचओ और एनएचएस दिशानिर्देशों पर आधारित है।\\n\\n"'
);

engineContent = engineContent.replace(
  /disclaimer: "👋 నమస్తే! నేను మీ వైటలిస్ ఆరోగ్య తోడును. నేను వైద్యుడిని కాను; ఇది కేవలం విద్యా ట్రయేజ్ మరియు ఆరోగ్య మద్దతు కోసం మాత్రమే।\\n\\n"/,
  'disclaimer: "👋 నమస్తే! నేను మీ వైటలిస్ ఆరోగ్య తోడును. నేను వైద్యుడిని కాను; ఇది కేవలం విద్యా ట్రయేజ్ మరియు ఆరోగ్య మద్దతు కోసం మాత్రమే. ఈ విశ్లేషణ WHO మరియు NHS మార్గదర్శకాలపై ఆధారపడి ఉంటుంది.\\n\\n"'
);

engineContent = engineContent.replace(
  /disclaimer: "👋 ¡Hola! Soy tu compañero de salud de Vitalis. No soy médico; esto es solo para triaje educativo y apoyo de bienestar.\\n\\n"/,
  'disclaimer: "👋 ¡Hola! Soy tu compañero de salud de Vitalis. No soy médico; esto es solo para triaje educativo y apoyo de bienestar. Este análisis se basa en las directrices de la OMS y el NHS.\\n\\n"'
);

engineContent = engineContent.replace(
  /disclaimer: "👋 Bonjour ! Je suis votre compagnon de santé Vitalis. Je ne suis pas médecin ; ceci est uniquement destiné au triage éducatif et au soutien au bien-être.\\n\\n"/,
  'disclaimer: "👋 Bonjour ! Je suis votre compagnon de santé Vitalis. Je ne suis pas médecin ; ceci est uniquement destiné au triage éducatif et au soutien au bien-être. Cette analyse est basée sur les directives de l\'OMS et du NHS.\\n\\n"'
);

// Update Indic language disclaimers
engineContent = engineContent.replace(
  /"disclaimer":"\\u0bb5\\u0ba3\\u0b95\\u0bcd\\u0b95\\u0bae\\u0bcd! \\u0ba8\\u0bbe\\u0ba9\\u0bcd \\u0bb5\\u0bc8\\u0b9f\\u0bcd\\u0b9f\\u0bb2\\u0bbf\\u0bb8\\u0bcd \\u0b9a\\u0bc1\\u0b95\\u0bbe\\u0ba4\\u0bbase \\u0ba4\\u0bc1\\u0ba3\\u0bc8. \\u0ba8\\u0bbe\\u0ba9\\u0bcd \\u0bae\\u0bb0\\u0bc1\\u0ba4\\u0bcd\\u0ba4\\u0bc1\\u0bb5\\u0bb0\\u0bcd \\u0a85\\u0bb2\\u0bcd\\u0bb2.\\n\\n"/,
  '"disclaimer":"👋 வணக்கம்! நான் உங்கள் வைட்டலிஸ் சுகாதாரத் துணை. நான் மருத்துவர் அல்ல; இது கல்வி சார்ந்த சோதனை மற்றும் ஆரோக்கிய ஆதரவுக்காக மட்டுமே. இந்த பகுப்பாய்வு WHO மற்றும் NHS வழிகாட்டுதல்களின் அடிப்படையில் அமைந்துள்ளது.\\n\\n"'
);

engineContent = engineContent.replace(
  /"disclaimer":"আমি আপনার ভাইটালিস স্বাস্থ্য সহচর। আমি ডাক্তার নই।\\n\\n"/,
  '"disclaimer":"👋 নমস্কার! আমি আপনার ভাইটালিস স্বাস্থ্য সহচর। আমি ডাক্তার নই; এটি কেবল শিক্ষামূলক ট্রায়াজ এবং সুস্থতা সহায়তার জন্য। এই বিশ্লেষণটি WHO এবং NHS নির্দেশিকাগুলির উপর ভিত্তি করে তৈরি।\\n\\n"'
);

engineContent = engineContent.replace(
  /"disclaimer":"നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വൈറ്റലിസ് ആരോഗ്യ സഹായിയാണ്. ഞാൻ ഡോക്ടറല്ല.\\n\\n"/,
  '"disclaimer":"👋 നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വൈറ്റലിസ് ആരോഗ്യ സഹായിയാണ്. ഞാൻ ഡോക്ടറല്ല; ഇത് വിദ്യാഭ്യാസപരമായ ട്രയേജിനും ആരോഗ്യ പിന്തുണയ്ക്കും മാത്രമുള്ളതാണ്. ഈ വിശകലനം ലോകാരോഗ്യ സംഘടനയുടെയും (WHO) എൻഎച്ച്എസിന്റെയും (NHS) മാർഗ്ഗനിർദ്ദേശങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.\\n\\n"'
);

engineContent = engineContent.replace(
  /"disclaimer":"ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ವೈಟಲಿಸ್ ಆರೋಗ್ಯ ಸಂಗಾತಿ. ನಾನು ವೈದ್ಯನಲ್ಲ.\\n\\n"/,
  '"disclaimer":"👋 ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ವೈಟಲಿಸ್ ಆರೋಗ್ಯ ಸಂಗಾತಿ. ನಾನು ವೈದ್ಯನಲ್ಲ; ಇದು ಶೈಕ್ಷಣಿಕ ಟ್ರಯೇಜ್ ಮತ್ತು ಯೋಗಕ್ಷೇಮ ಬೆಂಬಲಕ್ಕಾಗಿ ಮಾತ್ರ. ಈ ವಿಲೇಷಣೆಯು WHO ಮತ್ತು NHS ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಆಧರಿಸಿದೆ.\\n\\n"'
);

engineContent = engineContent.replace(
  /"disclaimer":"नमस्कार! मी तुमचा वाइटलिस आरोग्य सोबती आहे. मी डॉक्टर नाही.\\n\\n"/,
  '"disclaimer":"👋 नमस्कार! मी तुमचा वाइटलिस आरोग्य सोबती आहे. मी डॉक्टर नाही; हे केवळ शैक्षणिक ट्रायज आणि निरोगीपणाच्या समर्थनासाठी आहे. हे विश्लेषण WHO आणि NHS मार्गदर्शक तत्त्वांवर आधारित आहे.\\n\\n"'
);

engineContent = engineContent.replace(
  /"disclaimer":"નમસ્તે! હું તમારો વાઈટલિસ આરોગ્ય સાથી છું. હું ડોક્ટર નથી.\\n\\n"/,
  '"disclaimer":"👋 નમસ્તે! હું તમારો વાઈટલિસ આરોગ્ય સાથી છું. હું ડોક્ટર નથી; આ માત્ર શૈક્ષણિક ટ્રાયેજ અને વેલનેસ સપોર્ટ માટે છે. આ વિશ્લેષણ WHO અને NHS માર્ગદર્શિકા પર આધારિત છે.\\n\\n"'
);

fs.writeFileSync(enginePath, engineContent, 'utf8');
console.log('1. Updated api/_lib/local-clinical-engine.ts disclaimers successfully.');


// 2. Update src/services/gemini.ts to pass symptoms in request body and add prompt instruction
const geminiServicePath = path.join(__dirname, '..', 'src', 'services', 'gemini.ts');
let geminiContent = fs.readFileSync(geminiServicePath, 'utf8');

geminiContent = geminiContent.replace(
  /body: JSON\.stringify\(\{ prompt, systemInstruction, responseSchema, language, severity, duration \}\)/,
  'body: JSON.stringify({ prompt, systemInstruction, responseSchema, language, severity, duration, symptoms })'
);

geminiContent = geminiContent.replace(
  /\* Never exaggerate risks unnecessarily\./,
  '* Never exaggerate risks unnecessarily.\n* The disclaimer field MUST state that the assessment is based on WHO and NHS guidelines.'
);

fs.writeFileSync(geminiServicePath, geminiContent, 'utf8');
console.log('2. Updated src/services/gemini.ts successfully.');


// 3. Update server.ts to accept symptoms in body and use case-insensitive regex
const serverPath = path.join(__dirname, '..', 'server.ts');
let serverContent = fs.readFileSync(serverPath, 'utf8');

serverContent = serverContent.replace(
  /const symptomsMatch = prompt\.match\(\/symptoms:\\s\*\(\[\^,\]\+\(\?:,\\s\*\(\[\^,\]\+\)\)\*\)\/\);/,
  'const symptomsMatch = prompt.match(/symptoms:\\s*([^,]+(?:,\\s*[^,]+)*)/i);'
);

serverContent = serverContent.replace(
  /const severity = req\.body\.severity \|\| "Moderate";\s+const duration = req\.body\.duration \|\| "1-3 days";\s+const language = req\.body\.language \|\| "en";\s+\/\/ Extract symptoms list\s+const symptomsMatch = prompt\.match\(\/symptoms:\\s\*\(\[\^,\]\+\(\?:,\\s\*\(\[\^,\]\+\)\)\*\)\/i\);\s+const symptoms = symptomsMatch \? symptomsMatch\[1\]\.split\(","\)\.map\(\(s: string\) => s\.trim\(\)\) : \["Fever", "Cough"\];/,
  `const severity = req.body.severity || "Moderate";
        const duration = req.body.duration || "1-3 days";
        const language = req.body.language || "en";
        // Extract symptoms list
        const symptoms = req.body.symptoms || (prompt.match(/symptoms:\\s*([^,]+(?:,\\s*[^,]+)*)/i) ? prompt.match(/symptoms:\\s*([^,]+(?:,\\s*[^,]+)*)/i)[1].split(",").map((s) => s.trim()) : ["Fever", "Cough"]);`
);

fs.writeFileSync(serverPath, serverContent, 'utf8');
console.log('3. Updated server.ts successfully.');


// 4. Update api/gemini/analyze.ts to accept symptoms in body
const analyzePath = path.join(__dirname, '..', 'api', 'gemini', 'analyze.ts');
let analyzeContent = fs.readFileSync(analyzePath, 'utf8');

analyzeContent = analyzeContent.replace(
  /const symptomsMatch = prompt\.match\(\/symptoms:\\s\*\(\[\^,\]\+\(\?:,\\s\*\(\[\^,\]\+\)\)\*\)\/i\);\s+const symptoms = symptomsMatch\s+\? symptomsMatch\[1\]\.split\(","\)\.map\(\(s: string\) => s\.trim\(\)\)\s+: \["Fever", "Cough"\];/,
  'const symptoms = req.body.symptoms || (prompt.match(/symptoms:\\s*([^,]+(?:,\\s*[^,]+)*)/i) ? prompt.match(/symptoms:\\s*([^,]+(?:,\\s*[^,]+)*)/i)[1].split(",").map((s: string) => s.trim()) : ["Fever", "Cough"]);'
);

fs.writeFileSync(analyzePath, analyzeContent, 'utf8');
console.log('4. Updated api/gemini/analyze.ts successfully.');
