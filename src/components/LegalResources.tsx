import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  FileText, 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  HeartHandshake, 
  PhoneCall, 
  ExternalLink,
  Gavel,
  BookOpen,
  Info
} from 'lucide-react';
import { cn } from '../utils';

const LEGAL_SECTIONS = [
  {
    id: 'cdsco-banned',
    title: 'CDSCO Banned Drugs & Safety',
    icon: <ShieldAlert className="text-rose-600" />,
    description: 'Critical safety alerts on medications banned or restricted by the CDSCO (India).',
    url: 'https://cdsco.gov.in/opencms/opencms/en/Notifications/Banned-Drugs/',
    content: [
      'Fixed Dose Combinations (FDCs): Over 300+ FDCs banned due to lack of therapeutic justification.',
      'Nimesulide: Banned for pediatric use (children under 12) due to liver toxicity risks.',
      'Analgin: Restricted use due to risk of agranulocytosis (severe white blood cell drop).',
      'Pioglitazone: Strictly regulated; must not be used as first-line therapy for diabetes.',
      'Dextropropoxyphene: Banned due to potential for abuse and cardiac risks.',
      'Safety Check: Always verify the "Schedule" of the drug (H, H1, or X) on the packaging.'
    ],
    details: 'The Central Drugs Standard Control Organisation (CDSCO) periodically reviews the safety and efficacy of drugs. Fixed Dose Combinations (FDCs) are often banned when they are found to have no therapeutic advantage over individual drugs. Patients should look for the red line on medicine strips, which indicates "Schedule H" drugs that should only be taken under medical supervision.'
  },
  {
    id: 'patient-rights',
    title: 'Your Rights as a Patient',
    icon: <Users className="text-brand-600" />,
    description: 'Empowering you with the Charter of Patient Rights (NHRC & Ministry of Health).',
    url: 'https://main.mohfw.gov.in/sites/default/files/Charter%20of%20Patient%20Rights.pdf',
    content: [
      'Right to Records: You have the legal right to receive your medical reports within 24 hours.',
      'Right to Consent: No surgery or high-risk treatment can be done without your written permission.',
      'Right to Choice: You can choose where to buy medicines or get diagnostic tests done.',
      'Right to Privacy: Your medical condition cannot be discussed with others without your consent.',
      'Right to Redressal: You can file complaints against hospitals for overcharging or negligence.'
    ],
    details: 'The Charter of Patient Rights, adopted by the Ministry of Health and Family Welfare, outlines 17 basic rights. This includes the right to a second opinion, the right to transparency in rates, and the right to non-discrimination based on HIV status, religion, or caste. Hospitals are legally bound to provide an itemized bill and cannot hold a patient or a body hostage for unpaid bills.'
  },
  {
    id: 'mental-health',
    title: 'Mental Health Rights (2017 Act)',
    icon: <BookOpen className="text-indigo-600" />,
    description: 'Protection and support framework for mental well-being.',
    url: 'https://main.mohfw.gov.in/acts-rules-and-standards-health-sector/acts/mental-healthcare-act-2017',
    content: [
      'Right to Equality: Mental illness must be treated on par with physical illness.',
      'Advance Directive: You can document how you want to be treated if you face a crisis later.',
      'Nominated Rep: You can legally appoint a friend/relative to handle your medical decisions.',
      'Suicide Decriminalization: Attempting suicide is no longer a crime; it is a call for help.',
      'Confidentiality: Mental health records are strictly protected under law.'
    ],
    details: 'The Mental Healthcare Act, 2017, shifted the focus from institutionalization to community-based care. It provides the "Right to Access Mental Healthcare" funded by the government for those below the poverty line. Crucially, it prohibits the use of electroconvulsive therapy (ECT) without anesthesia and bans the use of chains or physical restraints in mental health establishments.'
  },
  {
    id: 'telemedicine',
    title: 'Tele-Consultation Rules',
    icon: <PhoneCall className="text-emerald-600" />,
    description: 'Legal standards for video and phone doctor visits.',
    url: 'https://www.nmc.org.in/rules-regulations/telemedicine-practice-guidelines/',
    content: [
      'Identity Check: Both the doctor and patient must verify their identity at the start.',
      'Prescription Format: Digital prescriptions must have the doctor\'s registration number.',
      'Restricted Drugs: Doctors CANNOT prescribe habit-forming drugs (Schedule X) via video call.',
      'Consent: Starting a consultation implies consent, but explicit consent is better.',
      'Data Safety: Platforms must use encrypted channels to protect your health data.'
    ],
    details: 'Telemedicine guidelines issued by the National Medical Commission (NMC) allow doctors to provide consultations via video, audio, or text. However, doctors are prohibited from prescribing "List O" drugs (habit-forming, narcotics) through tele-consultation. All digital prescriptions must be signed and include the doctor\'s MCI/NMC registration number to be valid at pharmacies.'
  },
  {
    id: 'negligence',
    title: 'Medical Malpractice & Redressal',
    icon: <Gavel className="text-slate-600" />,
    description: 'How to seek justice in cases of medical errors or negligence.',
    url: 'https://ncdrc.nic.in/',
    content: [
      'Consumer Protection: You are a "consumer" of health services and can sue for poor service.',
      'State Medical Council: You can report doctors for unethical behavior or misconduct.',
      'Compensation: Consumer courts can award financial damages for proven negligence.',
      'Legal Aid: Free legal services are available for those who cannot afford a lawyer.',
      'Mediation: Many disputes can be settled faster through neutral mediation boards.'
    ],
    details: 'Medical negligence occurs when a healthcare professional fails to provide the standard of care expected, resulting in harm. Patients can approach District, State, or National Consumer Commissions depending on the claim amount. The Supreme Court has ruled that doctors cannot be held criminally liable unless "gross negligence" is proven, but civil compensation is common for errors.'
  },
  {
    id: 'schemes',
    title: 'Financial Aid & Govt. Schemes',
    icon: <ShieldCheck className="text-amber-600" />,
    description: 'Accessing affordable healthcare through national initiatives.',
    url: 'https://nha.gov.in/PM-JAY',
    content: [
      'PM-JAY (Ayushman Bharat): Provides ₹5 Lakh/year for secondary & tertiary hospital care.',
      'Janaushadhi: Access to high-quality generic medicines at 50-90% lower costs.',
      'Health ID (ABHA): A digital health record to store all your prescriptions and reports.',
      'Maternal Benefits: Financial support for institutional deliveries (JSY scheme).',
      'Free Diagnostics: Available at many government primary health centers.'
    ],
    details: 'Ayushman Bharat (PM-JAY) is the world\'s largest health insurance scheme, covering over 50 crore citizens. For those not covered, Janaushadhi Kendras provide generic versions of expensive branded drugs that are chemically identical but significantly cheaper. The ABHA ID helps in creating a longitudinal health record that can be shared across hospitals digitally.'
  }
];

export default function LegalResources() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col h-full space-y-8 overflow-y-auto pb-12 pr-2 custom-scrollbar">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-12 rounded-[3rem] bg-slate-900 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Scale size={14} />
              Legal & Compliance Framework
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Last Verified: {lastUpdated}
            </div>
          </div>
          <h2 className="font-display font-bold text-4xl text-white tracking-tight leading-tight">
            Medical Rights & <span className="text-indigo-400">Legal Resources</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Stay informed about your rights as a patient, government health schemes, and the legal framework governing healthcare in India.
          </p>
        </div>
      </motion.div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEGAL_SECTIONS.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col group"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-indigo-50"
              >
                {section.icon}
              </motion.div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">{section.title}</h3>
                <p className="text-xs text-slate-400 font-medium">{section.description}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {section.content.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index * 0.1) + (i * 0.05) }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 shrink-0 group-hover:bg-indigo-300 transition-colors" />
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source: Official Govt. Guidelines</span>
                <button 
                  onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                  className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest hover:underline text-left"
                >
                  {expandedId === section.id ? 'Hide Details' : 'View Summary'}
                </button>
              </div>
              <motion.button 
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(section.url, '_blank')}
                className="text-indigo-600 text-xs font-bold flex items-center gap-1 transition-all"
              >
                Learn More <ExternalLink size={14} />
              </motion.button>
            </div>

            <AnimatePresence>
              {expandedId === section.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      {section.details}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-[9px] text-slate-400 font-medium">
                      <Info size={10} />
                      If the external link above does not open, this summary provides the core legal context.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer Footer */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex items-start gap-6"
      >
        <motion.div 
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 5 
          }}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 shadow-sm"
        >
          <Info size={24} />
        </motion.div>
        <div className="space-y-2">
          <h4 className="font-bold text-indigo-900">Legal Disclaimer</h4>
          <p className="text-sm text-indigo-700 leading-relaxed">
            The information provided in this section is for educational purposes and general awareness only. It does not constitute legal advice. Laws and guidelines are subject to change by the respective authorities. For specific legal issues, please consult a qualified legal professional.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
