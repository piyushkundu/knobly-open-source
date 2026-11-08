'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface MCQ { q: string; options: string[]; correct: number; explanation: string; }

const mcqs: MCQ[] = [
  { "q": "IoT ka full form kya hai?", "options": ["Internet of Technology", "Internet of Things", "Internal Object Technology", "Intelligent of Things"], "correct": 1, "explanation": "IoT stands for Internet of Things." },
  { "q": "IoT term kisne diya tha?", "options": ["Bill Gates", "Steve Jobs", "Kevin Ashton", "Tim Berners Lee"], "correct": 2, "explanation": "Kevin Ashton coined the term Internet of Things." },
  { "q": "Kevin Ashton ne IoT term kab diya tha?", "options": ["1980", "1995", "1999", "2005"], "correct": 2, "explanation": "The term was coined in 1999." },
  { "q": "IoT me devices kis ke through connect hote hain?", "options": ["Electricity", "Internet", "Battery", "Wire only"], "correct": 1, "explanation": "Devices connect and communicate via the Internet." },
  { "q": "IoT ka main purpose kya hai?", "options": ["Gaming", "Smart communication and automation", "Printing", "Typing"], "correct": 1, "explanation": "The main purpose is smart communication and automation." },
  { "q": "IoT me “things” ka matlab kya hota hai?", "options": ["Humans", "Internet cables", "Devices or objects", "Programs"], "correct": 2, "explanation": "'Things' refers to devices or objects connected to the network." },
  { "q": "IoT ka sabse important feature kaunsa hai?", "options": ["Gaming", "Connectivity", "Painting", "Designing"], "correct": 1, "explanation": "Connectivity is the most essential feature of IoT." },
  { "q": "IoT devices data kaise bhejte hain?", "options": ["Wireless network", "Printer", "Keyboard", "Scanner"], "correct": 0, "explanation": "Data is primarily sent over wireless networks." },
  { "q": "IoT me intelligence kiski help se aati hai?", "options": ["Machine learning", "Mouse", "Typing", "Printer"], "correct": 0, "explanation": "Machine learning and AI provide intelligence to IoT." },
  { "q": "Sensors ka use kisliye hota hai?", "options": ["Video editing", "Environment data collect karne ke liye", "Typing", "Music sunne ke liye"], "correct": 1, "explanation": "Sensors collect environmental data like temperature, motion, etc." },
  { "q": "GPS kis type ka sensor hai?", "options": ["Location sensor", "Sound sensor", "Printer sensor", "Memory sensor"], "correct": 0, "explanation": "GPS is used to detect location." },
  { "q": "IoT ka nature kaisa hota hai?", "options": ["Static", "Dynamic", "Offline", "Manual"], "correct": 1, "explanation": "IoT is dynamic as the data and environment continuously change." },
  { "q": "IoT me security kyon important hai?", "options": ["Decoration ke liye", "Sensitive data ko safe rakhne ke liye", "Typing ke liye", "Drawing ke liye"], "correct": 1, "explanation": "Security protects sensitive data and prevents unauthorized access." },
  { "q": "Firewall ka use kisliye hota hai?", "options": ["Security", "Music", "Gaming", "Drawing"], "correct": 0, "explanation": "Firewall is used for network security." },
  { "q": "VPN ka use kisliye hota hai?", "options": ["Secure communication", "Video editing", "Typing", "Storage"], "correct": 0, "explanation": "VPN provides a secure encrypted communication tunnel." },
  { "q": "IoT system ka pehla component kya hota hai?", "options": ["Printer", "Sensors", "Mouse", "Speaker"], "correct": 1, "explanation": "Sensors are the first building block of an IoT system." },
  { "q": "Sensors kya collect karte hain?", "options": ["Games", "Live data", "Movies", "Songs"], "correct": 1, "explanation": "Sensors collect live environmental data." },
  { "q": "Data processing ka kaam kya hai?", "options": ["Data ko process karna", "Data delete karna", "Data paint karna", "Data draw karna"], "correct": 0, "explanation": "Data processing involves analyzing and converting raw data into useful info." },
  { "q": "User interface ka use kisliye hota hai?", "options": ["User ko information dikhane ke liye", "Cooking", "Gaming", "Washing"], "correct": 0, "explanation": "It allows users to view information and control the system." },
  { "q": "Smart watch kis category me aati hai?", "options": ["Wearable", "Agriculture", "Industry", "Traffic"], "correct": 0, "explanation": "Smart watches are wearable IoT devices." },
  { "q": "Smart beds ka use kaha hota hai?", "options": ["Agriculture", "Hospitals", "Schools", "Banks"], "correct": 1, "explanation": "Smart beds are used in hospitals to monitor patients." },
  { "q": "Traffic monitoring me IoT ka use kisliye hota hai?", "options": ["Cooking", "Traffic analyse karne ke liye", "Drawing", "Typing"], "correct": 1, "explanation": "It helps in analyzing traffic flow and preventing congestion." },
  { "q": "Agriculture me sensors kya check karte hain?", "options": ["Humidity", "Nutrients", "Acidity", "All of these"], "correct": 3, "explanation": "Sensors can check humidity, soil nutrients, and acidity." },
  { "q": "Smart home me kaunsi device use hoti hai?", "options": ["Smart TV", "Smart AC", "Smart Door", "All of these"], "correct": 3, "explanation": "All these are examples of smart home devices." },
  { "q": "Smart city me IoT ka use kisliye hota hai?", "options": ["Waste management", "Traffic control", "Pollution checking", "All of these"], "correct": 3, "explanation": "IoT is used for waste, traffic, and pollution management in smart cities." },
  { "q": "CCTV ka full form kya hai?", "options": ["Closed Circuit Television", "Computer Circuit Television", "Closed Camera TV", "Central Circuit TV"], "correct": 0, "explanation": "CCTV stands for Closed Circuit Television." },
  { "q": "Building blocks of IoT me kya include hota hai?", "options": ["Sensors", "Processor", "Gateway", "All of these"], "correct": 3, "explanation": "Sensors, Processor, Gateway, and Application are the building blocks." },
  { "q": "Processor ka kaam kya hai?", "options": ["Raw data process karna", "Washing", "Drawing", "Typing"], "correct": 0, "explanation": "The processor processes raw data received from sensors." },
  { "q": "Gateway ka use kisliye hota hai?", "options": ["Data transfer", "Gaming", "Music", "Storage"], "correct": 0, "explanation": "Gateway transfers data from devices to the cloud." },
  { "q": "PAN ka full form kya hai?", "options": ["Personal Area Network", "Public Area Network", "Private Access Network", "Packet Area Network"], "correct": 0, "explanation": "PAN is Personal Area Network." },
  { "q": "LAN ka full form kya hai?", "options": ["Local Area Network", "Long Area Network", "Limited Area Network", "Live Area Network"], "correct": 0, "explanation": "LAN is Local Area Network." },
  { "q": "MAN ka full form kya hai?", "options": ["Metropolitan Area Network", "Main Area Network", "Mobile Area Network", "Manual Area Network"], "correct": 0, "explanation": "MAN is Metropolitan Area Network." },
  { "q": "WAN ka full form kya hai?", "options": ["Wireless Area Network", "Wide Area Network", "Web Area Network", "World Area Node"], "correct": 1, "explanation": "WAN is Wide Area Network." },
  { "q": "Bluetooth kis type ki technology hai?", "options": ["Wired", "Short-range wireless", "Satellite", "Optical"], "correct": 1, "explanation": "Bluetooth is a short-range wireless technology." },
  { "q": "Bluetooth kis frequency par kaam karta hai?", "options": ["2.4 GHz", "5 GHz", "10 GHz", "100 MHz"], "correct": 0, "explanation": "Bluetooth operates at 2.4 GHz ISM band." },
  { "q": "BLE ka full form kya hai?", "options": ["Bluetooth Low Energy", "Basic Low Energy", "Broadband Low Ethernet", "Binary Low Energy"], "correct": 0, "explanation": "BLE stands for Bluetooth Low Energy." },
  { "q": "WiFi ka standard kya hai?", "options": ["IEEE 802.11", "IEEE 802.3", "IEEE 802.15", "IEEE 101"], "correct": 0, "explanation": "WiFi standard is IEEE 802.11." },
  { "q": "LiFi kis par based hota hai?", "options": ["Sound", "Light", "Wire", "Magnet"], "correct": 1, "explanation": "LiFi (Light Fidelity) uses light for data transmission." },
  { "q": "Zigbee ka standard kya hai?", "options": ["IEEE 802.15.4", "IEEE 802.11", "IEEE 802.3", "IEEE 100"], "correct": 0, "explanation": "Zigbee standard is IEEE 802.15.4." },
  { "q": "RFID ka full form kya hai?", "options": ["Radio Frequency Identification", "Rapid Frequency Internet Device", "Radio File Identification", "Random Frequency Identification"], "correct": 0, "explanation": "RFID stands for Radio Frequency Identification." },
  { "q": "RFID me kitne main components hote hain?", "options": ["1", "2", "3", "4"], "correct": 1, "explanation": "RFID has 2 main components: Reader and Tag." },
  { "q": "Passive RFID tag me battery hoti hai?", "options": ["Yes", "No"], "correct": 1, "explanation": "Passive tags do not have their own battery." },
  { "q": "NFC ka full form kya hai?", "options": ["Near Field Communication", "New Field Connection", "Network Fast Communication", "Near Fast Connection"], "correct": 0, "explanation": "NFC is Near Field Communication." },
  { "q": "GSM kis generation ki technology hai?", "options": ["2G", "3G", "4G", "5G"], "correct": 0, "explanation": "GSM is a 2G cellular technology." },
  { "q": "LTE kis generation se related hai?", "options": ["2G", "3G", "4G", "1G"], "correct": 2, "explanation": "LTE (Long Term Evolution) is a 4G technology." },
  { "q": "HTTP kis model par kaam karta hai?", "options": ["Publish-Subscribe", "Request-Response", "Push-Pull", "Queue"], "correct": 1, "explanation": "HTTP follows a Request-Response communication model." },
  { "q": "MQTT kis model par based hai?", "options": ["Request-Response", "Publish-Subscribe", "Push-Pull", "Exclusive Pair"], "correct": 1, "explanation": "MQTT uses a Publish-Subscribe model via a Broker." },
  { "q": "MQTT me mediator ka kaam kaun karta hai?", "options": ["Browser", "Broker", "Client", "Server"], "correct": 1, "explanation": "The Broker acts as a mediator between publishers and subscribers." },
  { "q": "IPv4 me kitne bit address hota hai?", "options": ["16-bit", "32-bit", "64-bit", "128-bit"], "correct": 1, "explanation": "IPv4 uses a 32-bit address." },
  { "q": "IPv6 me kitne bit address hota hai?", "options": ["32-bit", "64-bit", "128-bit", "256-bit"], "correct": 2, "explanation": "IPv6 uses a 128-bit address." }
];

export default function IoTChap1MCQ() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState<Record<number, boolean>>({});
    const [score, setScore] = useState<number | null>(null);

    const handleSelect = (qi: number, oi: number) => { if (showResults[qi]) return; setAnswers(p => ({ ...p, [qi]: oi })); };
    const handleCheck = (qi: number) => { setShowResults(p => ({ ...p, [qi]: true })); };
    const handleCheckAll = () => { const all: Record<number, boolean> = {}; let s = 0; mcqs.forEach((m, i) => { all[i] = true; if (answers[i] === m.correct) s++; }); setShowResults(all); setScore(s); };
    const handleReset = () => { setAnswers({}); setShowResults({}); setScore(null); };

    return (
        <div>
            {score !== null && (
                <div className="mb-5 p-4 rounded-2xl text-center font-bold text-sm" style={{
                    background: score >= 40 ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : score >= 25 ? 'linear-gradient(135deg, #fefce8, #fef9c3)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: `1px solid ${score >= 40 ? '#86efac' : score >= 25 ? '#fde047' : '#fca5a5'}`,
                    color: score >= 40 ? '#166534' : score >= 25 ? '#854d0e' : '#991b1b',
                }}>
                    🎯 Your Score: {score}/{mcqs.length} {score >= 40 ? '— Excellent! 🌟' : score >= 25 ? '— Good effort! 💪' : '— Keep practicing! 📚'}
                </div>
            )}
            <div className="space-y-4">
                {mcqs.map((m, qi) => {
                    const selected = answers[qi]; const revealed = showResults[qi];
                    return (
                        <div key={qi} className="rounded-2xl overflow-hidden transition-all duration-300" style={{
                            background: '#fff', boxShadow: revealed ? (selected === m.correct ? '0 0 0 2px #22c55e, 0 4px 12px rgba(34,197,94,0.1)' : '0 0 0 2px #ef4444, 0 4px 12px rgba(239,68,68,0.1)') : '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                            border: '1px solid #f1f5f9',
                        }}>
                            <div className="px-5 py-3.5 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderBottom: '1px solid #e2e8f0' }}>
                                <span className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', boxShadow: '0 2px 8px rgba(6,182,212,0.3)' }}>{qi + 1}</span>
                                <p className="text-sm font-semibold leading-relaxed pt-1" style={{ color: '#1e293b' }}>{m.q}</p>
                            </div>
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {m.options.map((opt, oi) => {
                                    const isSel = selected === oi, isCor = m.correct === oi;
                                    let bg = '#f8fafc', border = '#e2e8f0', tc = '#475569';
                                    if (revealed && isCor) { bg = '#ecfdf5'; border = '#86efac'; tc = '#166534'; }
                                    else if (revealed && isSel) { bg = '#fef2f2'; border = '#fca5a5'; tc = '#991b1b'; }
                                    else if (isSel) { bg = '#ecfeff'; border = '#67e8f9'; tc = '#0e7490'; }
                                    return (
                                        <button key={oi} onClick={() => handleSelect(qi, oi)} disabled={!!revealed}
                                            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left text-xs font-medium transition-all duration-200 hover:shadow-md"
                                            style={{ background: bg, border: `1.5px solid ${border}`, color: tc }}>
                                            <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{
                                                background: isSel ? (revealed ? (isCor ? '#22c55e' : '#ef4444') : '#06b6d4') : '#f1f5f9',
                                                color: isSel ? '#fff' : '#94a3b8', border: `1px solid ${isSel ? 'transparent' : '#e2e8f0'}`,
                                            }}>
                                                {revealed && isCor ? <CheckCircle2 size={14} /> : revealed && isSel ? <XCircle size={14} /> : String.fromCharCode(65 + oi)}
                                            </span>
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {!revealed && selected !== undefined && (
                                <div className="px-5 pb-4">
                                    <button onClick={() => handleCheck(qi)} className="text-xs font-bold px-5 py-2 rounded-xl transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', boxShadow: '0 2px 8px rgba(6,182,212,0.3)' }}>
                                        Check Answer <ChevronRight size={12} className="inline ml-1" />
                                    </button>
                                </div>
                            )}
                            {revealed && (
                                <div className="px-5 pb-4">
                                    <div className="text-xs p-3 rounded-xl" style={{ background: '#ecfeff', border: '1px solid #a5f3fc', color: '#0e7490' }}>
                                        💡 {m.explanation}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={handleCheckAll} disabled={Object.keys(answers).length === 0} className="text-sm font-bold px-6 py-3 rounded-2xl transition-all hover:shadow-xl disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', boxShadow: '0 4px 15px rgba(6,182,212,0.3)' }}>
                    Submit All ({Object.keys(answers).length}/{mcqs.length})
                </button>
                <button onClick={handleReset} className="text-sm font-bold px-6 py-3 rounded-2xl transition-all hover:shadow-md" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    Reset Quiz
                </button>
            </div>
        </div>
    );
}
