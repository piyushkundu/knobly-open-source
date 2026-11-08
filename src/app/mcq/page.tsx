'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MCQ {
    q: string;
    opts: string[];
    ans: string;
    exp: string;
}

const QUESTIONS: MCQ[] = [
    { q: '1) A process is a _______ / एक प्रक्रिया _______ है।', opts: ['single thread of execution / निष्पादन की एकल थ्रेड', 'program in the execution / निष्पादन में कार्यक्रम', 'program in the memory / मेमोरी में कार्यक्रम', 'task / कार्य'], ans: 'program in the execution / निष्पादन में कार्यक्रम', exp: 'A process refers to a program in execution, different from a stored program.' },
    { q: '2) The word processing feature that catches most random typographical errors is known as ____ / वर्ड प्रोसेसिंग फीचर जो अधिकांश त्रुटियों को पकड़ता है:', opts: ['Grammar checker / व्याकरण परीक्षक', 'Spell checker / वर्तनी परीक्षक', 'Word checker / शब्द परीक्षक', 'None of the above'], ans: 'Spell checker / वर्तनी परीक्षक', exp: 'A spell checker helps detect and correct spelling errors in a document.' },
    { q: '3) What is the decimal equivalent of binary 10111? / बाइनरी 10111 का दशमलव समतुल्य क्या है?', opts: ['21', '39', '42', '23'], ans: '23', exp: 'Binary 10111 = 16+4+2+1 = 23 in decimal.' },
    { q: '4) What compensates for differences in data rate between devices? / डेटा दर अंतर की भरपाई क्या करता है?', opts: ['Buffer / बफर', 'Bus / बस', 'Channel / चैनल', 'Modem / मोडेम'], ans: 'Buffer / बफर', exp: 'A buffer temporarily holds data to compensate for differences in data rate between devices.' },
    { q: '5) How many color dots make up one color pixel? / एक रंगीन पिक्सेल में कितने डॉट होते हैं?', opts: ['265', '16', '8', '3'], ans: '3', exp: 'Each pixel on a color screen is made up of 3 dots (red, green, and blue - RGB).' },
    { q: '6) Correct value of hexadecimal 1F.01B? / हेक्साडेसिमल 1F.01B का सही मान?', opts: ['35.0065918', '32.0065918', '31.0065918', '30.0065918'], ans: '31.0065918', exp: 'Hexadecimal 1F.01B converts to 31.0065918 in decimal.' },
    { q: '7) How is data stored on a diskette? / डिस्केट पर डेटा कैसे संग्रहीत होता है?', opts: ['Ink / स्याही', 'Laser bubbles / लेजर बुलबुले', 'Magnetism / चुंबकत्व', 'Circuits / सर्किट्स'], ans: 'Magnetism / चुंबकत्व', exp: 'Data on a diskette is stored using magnetic fields to represent bits.' },
    { q: '8) Smallest visual element on a video monitor? / मॉनिटर पर सबसे छोटा दृश्य तत्व?', opts: ['Character / अक्षर', 'Pixel / पिक्सेल', 'Byte / बाइट', 'Bit / बिट'], ans: 'Pixel / पिक्सेल', exp: 'A pixel is the smallest visual element on a monitor, forming part of the display.' },
    { q: '9) Primary natural element in computer chips? / कंप्यूटर चिप्स में प्राथमिक तत्व?', opts: ['Silicon / सिलिकॉन', 'Carbon / कार्बन', 'Iron / लोहा', 'Uranium / यूरेनियम'], ans: 'Silicon / सिलिकॉन', exp: 'Silicon is widely used in the manufacturing of semiconductors and computer chips.' },
    { q: '10) Program to calculate numbers in rows and columns? / पंक्तियों और स्तंभों में गणना करने वाला प्रोग्राम?', opts: ['Window program', 'Spreadsheet program / स्प्रेडशीट', 'Graphics program', 'Word program'], ans: 'Spreadsheet program / स्प्रेडशीट', exp: 'A spreadsheet program calculates numbers and analyzes data in rows and columns.' },
    { q: '11) Which is NOT an example of hardware? / कौन हार्डवेयर नहीं है?', opts: ['Printer / प्रिंटर', 'Operating System / ऑपरेटिंग सिस्टम', 'Monitor / मॉनिटर', 'Mouse / माउस'], ans: 'Operating System / ऑपरेटिंग सिस्टम', exp: 'Operating system is software; printer, monitor, and mouse are hardware.' },
    { q: '12) What does GUI stand for? / GUI का संक्षिप्त रूप क्या है?', opts: ['Graphical User Instrument', 'Graphical User Interface', 'General User Instrument', 'General User Interface'], ans: 'Graphical User Interface', exp: 'GUI stands for Graphical User Interface.' },
    { q: '13) Which is volatile memory? / कौन सी वोलाटाइल मेमोरी है?', opts: ['ROM', 'RAM / रैम', 'Hard Disk', 'Flash Memory'], ans: 'RAM / रैम', exp: 'RAM is volatile memory — it loses contents when power is off.' },
    { q: '14) Connect PC to telephone line for internet? / इंटरनेट के लिए PC को टेलीफोन से कनेक्ट करता है?', opts: ['Modem / मोडेम', 'Scanner / स्कैनर', 'Printer / प्रिंटर', 'Joystick / जॉयस्टिक'], ans: 'Modem / मोडेम', exp: 'A modem converts digital signals to analog for telephone line transmission.' },
    { q: '15) Full form of CPU? / CPU का पूरा नाम?', opts: ['Central Processing Unit', 'Control Processing Unit', 'Central Program Unit', 'Control Program Unit'], ans: 'Central Processing Unit', exp: 'CPU stands for Central Processing Unit, the brain of the computer.' },
    { q: '16) Software for designing brochures & newsletters? / ब्रोशर डिजाइन के लिए सॉफ्टवेयर?', opts: ['Spreadsheet', 'Desktop Publishing / डेस्कटॉप पब्लिशिंग', 'Word Processing', 'Database'], ans: 'Desktop Publishing / डेस्कटॉप पब्लिशिंग', exp: 'Desktop publishing software is used to design brochures and newsletters.' },
    { q: '17) MS-DOS command to clear screen? / MS-DOS में स्क्रीन साफ करने के लिए?', opts: ['CLS', 'DEL', 'COPY', 'DIR'], ans: 'CLS', exp: 'The CLS command in MS-DOS is used to clear the screen.' },
    { q: '18) Type of non-volatile memory? / नॉन-वोलाटाइल मेमोरी का प्रकार?', opts: ['RAM', 'ROM / रोम', 'Cache Memory', 'Virtual Memory'], ans: 'ROM / रोम', exp: 'ROM is non-volatile memory, retains data even when powered off.' },
    { q: '19) Printer that uses laser beam? / लेजर बीम वाला प्रिंटर?', opts: ['Inkjet Printer', 'Laser Printer / लेजर प्रिंटर', 'Dot Matrix Printer', 'Thermal Printer'], ans: 'Laser Printer / लेजर प्रिंटर', exp: 'A laser printer uses a laser beam to create images on a drum, then transfers to paper.' },
    { q: '20) Primary function of Operating System? / ऑपरेटिंग सिस्टम का मुख्य कार्य?', opts: ['Manage resources and hardware / संसाधनों का प्रबंधन', 'Run application programs', 'Provide internet access', 'Store data'], ans: 'Manage resources and hardware / संसाधनों का प्रबंधन', exp: 'OS manages hardware resources like CPU, memory, and storage.' },
    { q: '21) Short-term storage memory? / अल्पकालिक भंडारण?', opts: ['RAM / रैम', 'ROM', 'Hard Drive', 'Flash Memory'], ans: 'RAM / रैम', exp: 'RAM is used for short-term storage of data actively being used.' },
    { q: '22) Protocol for transferring files on internet? / इंटरनेट पर फाइल ट्रांसफर?', opts: ['FTP / एफटीपी', 'HTTP', 'SMTP', 'IP'], ans: 'FTP / एफटीपी', exp: 'FTP (File Transfer Protocol) transfers files between computers on the internet.' },
    { q: '23) Full form of URL?', opts: ['Uniform Resource Locator', 'Uniform Retrieval Location', 'Universal Resource Locator', 'Universal Retrieval Location'], ans: 'Uniform Resource Locator', exp: 'URL stands for Uniform Resource Locator — the address used to access websites.' },
    { q: '24) Purpose of an IP address? / IP पते का उद्देश्य?', opts: ['To identify a specific webpage', 'To identify a device on a network', 'To encrypt network traffic', 'To connect to the internet'], ans: 'To identify a device on a network', exp: 'An IP address uniquely identifies a device on a network.' },
    { q: '25) 1 KB equals? / 1 KB बराबर होता है?', opts: ['1024 Bytes', '1000 Bytes', '512 Bytes', '2048 Bytes'], ans: '1024 Bytes', exp: '1 Kilobyte (KB) = 1024 Bytes in computing.' },
    { q: '26) Which of the following is a type of network topology? / निम्नलिखित में से कौन सा नेटवर्क टोपोलॉजी का प्रकार है?', opts: ['Tree', 'Star', 'Ring', 'All of the above / उपरोक्त सभी'], ans: 'All of the above / उपरोक्त सभी', exp: 'Tree, Star, and Ring are all types of network topologies, which define the structure and layout of connections between devices in a network.' },
    { q: '27) What is the primary function of DNS in networking? / नेटवर्किंग में DNS का प्राथमिक कार्य क्या है?', opts: ['Transferring data packets', 'Resolving domain names to IP addresses', 'Encrypting web traffic', 'Routing emails'], ans: 'Resolving domain names to IP addresses', exp: 'DNS (Domain Name System) translates domain names (like www.example.com) into IP addresses, allowing users to access websites without needing to remember numeric IP addresses.' },
    { q: '28) What is the speed of a computer measured in? / कंप्यूटर की गति किसमें मापी जाती है?', opts: ['Nanoseconds / नैनोसेकंड', 'Kilo-seconds / किलो-सेकंड', 'Gigahertz / गीगाहर्ट्ज़', 'Megabytes / मेगाबाइट्स'], ans: 'Gigahertz / गीगाहर्ट्ज़', exp: 'Computer speed is generally measured in gigahertz (GHz), which refers to the clock speed of the CPU.' },
    { q: '29) What is the full form of RAM? / RAM का पूरा नाम क्या है?', opts: ['Random Access Memory / रैंडम एक्सेस मेमोरी', 'Remote Access Memory / रिमोट एक्सेस मेमोरी', 'Rapid Access Memory / रैपिड एक्सेस मेमोरी', 'Read Access Memory / रीड एक्सेस मेमोरी'], ans: 'Random Access Memory / रैंडम एक्सेस मेमोरी', exp: 'RAM stands for Random Access Memory, which temporarily stores data for quick access by the CPU.' },
    { q: '30) What is the full form of DRAM? / DRAM का पूरा नाम क्या है?', opts: ['Dynamic Random-Access Memory / डायनेमिक रैंडम एक्सेस मेमोरी', 'Dynamic Remote Access Memory / डायनेमिक रिमोट एक्सेस मेमोरी', 'Dependent Random Access Memory / डिपेंडेंट रैंडम एक्सेस मेमोरी', 'Dependent Remote Access Memory / डिपेंडेंट रिमोट एक्सेस मेमोरी'], ans: 'Dynamic Random-Access Memory / डायनेमिक रैंडम एक्सेस मेमोरी', exp: 'DRAM is a type of RAM that stores each bit of data in a separate capacitor.' },
    { q: '31) Which one of the following software applications would be the most appropriate for performing numerical and statistical calculations? / निम्नलिखित में से कौन सा सॉफ़्टवेयर संख्यात्मक और सांख्यिकीय गणनाओं के लिए सबसे उपयुक्त होगा?', opts: ['Database / डेटाबेस', 'Document processor / दस्तावेज़ प्रोसेसर', 'Graphics package / ग्राफिक्स पैकेज', 'Spreadsheet / स्प्रेडशीट'], ans: 'Spreadsheet / स्प्रेडशीट', exp: 'Spreadsheets are widely used for performing numerical and statistical calculations.' },
    { q: '32) Which of the following is not considered hardware? / निम्नलिखित में से किसे हार्डवेयर नहीं माना जाता है?', opts: ['Operating system / ऑपरेटिंग सिस्टम', 'CPU / सीपीयू', 'Keyboard / कीबोर्ड', 'Hard disk / हार्ड डिस्क'], ans: 'Operating system / ऑपरेटिंग सिस्टम', exp: 'An operating system is software, while the other options are hardware components.' },
    { q: '33) Which of the following is exclusively a sequential access storage device? / निम्नलिखित में से कौन सा विशेष रूप से अनुक्रमिक पहुंच भंडारण उपकरण है?', opts: ['Hard disk / हार्ड डिस्क', 'Floppy disk / फ्लॉपी डिस्क', 'Magnetic tape / चुंबकीय टेप', 'DVD / डीवीडी'], ans: 'Magnetic tape / चुंबकीय टेप', exp: 'Magnetic tape is a sequential access storage device, meaning data is accessed in a set sequence.' },
    { q: '34) Akshat has created a story of ten pages, but only wants to print the first two pages. Which printer command should he choose? / अक्षत ने दस पन्नों की कहानी बनाई है, लेकिन वह केवल पहले दो पन्ने प्रिंट करना चाहता है। उसे कौन सा कमांड चुनना चाहिए?', opts: ['Print all / सभी प्रिंट करें', 'Print from 1 to 2 / 1 से 2 तक प्रिंट करें', 'Page setup / पृष्ठ सेटअप', 'Print Preview / प्रिंट पूर्वावलोकन'], ans: 'Print from 1 to 2 / 1 से 2 तक प्रिंट करें', exp: 'To print only the first two pages, select the option "Print from 1 to 2."' },
    { q: '35) What is the full form of SRAM? / SRAM का पूरा नाम क्या है?', opts: ['Static Random-Access Memory / स्टैटिक रैंडम-एक्सेस मेमोरी', 'Static Remote-Access Memory / स्टैटिक रिमोट-एक्सेस मेमोरी', 'Setup Random-Access Memory / सेटअप रैंडम-एक्सेस मेमोरी', 'Setup Remote-Access Memory / सेटअप रिमोट-एक्सेस मेमोरी'], ans: 'Static Random-Access Memory / स्टैटिक रैंडम-एक्सेस मेमोरी', exp: 'SRAM is a type of memory that retains data bits in a static state, without needing to refresh.' },
    { q: '36) What is the full form of USB? / USB का पूरा नाम क्या है?', opts: ['Unshielded System Board / अनशील्डेड सिस्टम बोर्ड', 'Universal System Board / यूनिवर्सल सिस्टम बोर्ड', 'Unidentified System Bus / अनआइडेंटिफाइड सिस्टम बस', 'Universal Serial Bus / यूनिवर्सल सीरियल बस'], ans: 'Universal Serial Bus / यूनिवर्सल सीरियल बस', exp: 'USB stands for Universal Serial Bus, used to connect various devices to a computer.' },
    { q: '37) Which one of the following is not a form of data storage media? / निम्नलिखित में से कौन सा डेटा स्टोरेज मीडिया का रूप नहीं है?', opts: ['A database / एक डेटाबेस', 'Magnetic tape / चुंबकीय टेप', 'Magnetic disc / चुंबकीय डिस्क', 'Optical disc / ऑप्टिकल डिस्क'], ans: 'A database / एक डेटाबेस', exp: 'A database is not a physical storage media, it is a system to organize and manage data.' },
    { q: '38) Which of the following is not a type of programming language? / निम्नलिखित में से कौन सा प्रोग्रामिंग भाषा का प्रकार नहीं है?', opts: ['Assembly / असेंबली', 'High-level language / उच्च स्तरीय भाषा', 'Machine language / मशीन भाषा', 'GUI / जीयूआई'], ans: 'GUI / जीयूआई', exp: 'GUI stands for Graphical User Interface, which is not a programming language.' },
    { q: '39) The operating system manages what types of resources in a computer? / ऑपरेटिंग सिस्टम कंप्यूटर में किस प्रकार के संसाधनों को प्रबंधित करता है?', opts: ['Hardware / हार्डवेयर', 'Software / सॉफ्टवेयर', 'Data / डेटा', 'All of the above / उपरोक्त सभी'], ans: 'All of the above / उपरोक्त सभी', exp: 'The operating system manages hardware, software, and data in a computer system.' },
    { q: '40) What is the primary function of the ALU in a computer? / कंप्यूटर में ALU का मुख्य कार्य क्या है?', opts: ['Performing arithmetic operations / अंकगणितीय कार्य करना', 'Performing logic operations / तार्किक कार्य करना', 'Both A and B / दोनों A और B', 'Memory management / मेमोरी प्रबंधन'], ans: 'Both A and B / दोनों A और B', exp: 'ALU (Arithmetic Logic Unit) is responsible for performing both arithmetic and logic operations.' },
    { q: '41) What type of memory is used for long-term storage in a computer? / कंप्यूटर में दीर्घकालिक भंडारण के लिए किस प्रकार की मेमोरी का उपयोग किया जाता है?', opts: ['RAM / रैम', 'ROM / रोम', 'Secondary storage / द्वितीयक भंडारण', 'Cache memory / कैश मेमोरी'], ans: 'Secondary storage / द्वितीयक भंडारण', exp: 'Secondary storage, such as hard drives and SSDs, is used for long-term storage of data.' },
    { q: '42) What does the term \'booting\' refer to in a computer? / कंप्यूटर में \'बूटिंग\' शब्द का क्या अर्थ है?', opts: ['Shutting down the computer / कंप्यूटर को बंद करना', 'Starting the computer / कंप्यूटर को चालू करना', 'Installing software / सॉफ़्टवेयर स्थापित करना', 'Updating the operating system / ऑपरेटिंग सिस्टम को अपडेट करना'], ans: 'Starting the computer / कंप्यूटर को चालू करना', exp: 'Booting is the process of starting a computer and loading the operating system.' },
    { q: '43) What type of device is a monitor? / मॉनिटर किस प्रकार का उपकरण है?', opts: ['Input device / इनपुट डिवाइस', 'Output device / आउटपुट डिवाइस', 'Processing device / प्रोसेसिंग डिवाइस', 'Storage device / स्टोरेज डिवाइस'], ans: 'Output device / आउटपुट डिवाइस', exp: 'A monitor is an output device used to display information from a computer.' },
    { q: '44) What is the main purpose of a firewall in a computer system? / कंप्यूटर सिस्टम में फ़ायरवॉल का मुख्य उद्देश्य क्या है?', opts: ['To block viruses / वायरसों को रोकने के लिए', 'To prevent unauthorized access / अनधिकृत पहुंच को रोकने के लिए', 'To monitor system performance / सिस्टम प्रदर्शन की निगरानी के लिए', 'To manage data storage / डेटा स्टोरेज को प्रबंधित करने के लिए'], ans: 'To prevent unauthorized access / अनधिकृत पहुंच को रोकने के लिए', exp: 'A firewall prevents unauthorized access to or from a private network.' },
    { q: '45) Which of the following is an example of system software? / निम्नलिखित में से कौन सा सिस्टम सॉफ़्टवेयर का उदाहरण है?', opts: ['Spreadsheet / स्प्रेडशीट', 'Operating system / ऑपरेटिंग सिस्टम', 'Word processor / वर्ड प्रोसेसर', 'Database / डेटाबेस'], ans: 'Operating system / ऑपरेटिंग सिस्टम', exp: 'An operating system is a type of system software that manages computer hardware and software resources.' },
    { q: '46) What type of storage is a USB flash drive? / यूएसबी फ्लैश ड्राइव किस प्रकार का स्टोरेज है?', opts: ['Primary storage / प्राथमिक भंडारण', 'Secondary storage / द्वितीयक भंडारण', 'Tertiary storage / तृतीयक भंडारण', 'Volatile storage / अस्थिर भंडारण'], ans: 'Secondary storage / द्वितीयक भंडारण', exp: 'USB flash drives are a type of secondary storage, used to store data externally.' },
    { q: '47) Which part of the computer is considered its \'brain\'? / कंप्यूटर का कौन सा हिस्सा उसका \'मस्तिष्क\' माना जाता है?', opts: ['RAM / रैम', 'Hard drive / हार्ड ड्राइव', 'CPU / सीपीयू', 'Motherboard / मदरबोर्ड'], ans: 'CPU / सीपीयू', exp: 'The CPU (Central Processing Unit) is considered the brain of the computer as it processes all instructions.' },
    { q: '48) What is a key function of RAM in a computer? / कंप्यूटर में RAM का मुख्य कार्य क्या है?', opts: ['Storing files long-term / फ़ाइलों को लंबे समय तक स्टोर करना', 'Executing programs / प्रोग्राम निष्पादित करना', 'Backing up data / डेटा का बैकअप लेना', 'Cooling the processor / प्रोसेसर को ठंडा करना'], ans: 'Executing programs / प्रोग्राम निष्पादित करना', exp: 'RAM (Random Access Memory) temporarily stores data and instructions needed to execute programs.' },
    { q: '49) Which of the following is not an example of an input device? / निम्नलिखित में से कौन इनपुट डिवाइस का उदाहरण नहीं है?', opts: ['Keyboard / कीबोर्ड', 'Mouse / माउस', 'Printer / प्रिंटर', 'Scanner / स्कैनर'], ans: 'Printer / प्रिंटर', exp: 'A printer is an output device, not an input device.' },
    { q: '50) What is the purpose of a network switch? / नेटवर्क स्विच का उद्देश्य क्या है?', opts: ['To connect different networks / विभिन्न नेटवर्कों को जोड़ने के लिए', 'To transfer data between devices on the same network / एक ही नेटवर्क पर उपकरणों के बीच डेटा स्थानांतरित करने के लिए', 'To secure a network / एक नेटवर्क को सुरक्षित करने के लिए', 'To route data across the internet / इंटरनेट पर डेटा को रूट करने के लिए'], ans: 'To transfer data between devices on the same network / एक ही नेटवर्क पर उपकरणों के बीच डेटा स्थानांतरित करने के लिए', exp: 'A network switch transfers data between devices on the same network.' },
];

export default function MCQPage() {
    const [revealed, setRevealed] = useState<Set<number>>(new Set());

    const toggleReveal = (idx: number) => {
        setRevealed(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) newSet.delete(idx);
            else newSet.add(idx);
            return newSet;
        });
    };

    return (
        <div className="min-h-screen text-slate-100 bg-gradient-to-b from-[#0a0a1a] to-[#0f172a] overflow-y-auto">
            <header className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                            Computer Fundamental MCQ
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">CCC / O-Level / SSC Practice</p>
                    </div>
                    <Link href="/" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all">
                        ← Home
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                {QUESTIONS.map((mcq, i) => (
                    <div key={i} className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <p className="text-sm font-semibold text-white mb-3 leading-relaxed">{mcq.q}</p>
                        <ol className="space-y-2 mb-4" type="a">
                            {mcq.opts.map((opt, oi) => {
                                const isAnswer = revealed.has(i) && opt === mcq.ans;
                                const isWrong = revealed.has(i) && opt !== mcq.ans;
                                return (
                                    <li key={oi} className={`text-sm px-3 py-2 rounded-lg border transition-all ${isAnswer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                                        isWrong ? 'bg-white/[0.02] border-white/5 text-gray-500' :
                                            'bg-white/[0.03] border-white/5 text-gray-300'
                                        }`}>
                                        <span className="font-bold text-gray-500 mr-2">{String.fromCharCode(97 + oi)})</span>
                                        {opt}
                                    </li>
                                );
                            })}
                        </ol>
                        <button
                            onClick={() => toggleReveal(i)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${revealed.has(i)
                                ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                                }`}>
                            {revealed.has(i) ? 'Hide Answer' : 'Show Answer'}
                        </button>
                        {revealed.has(i) && (
                            <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                                <p className="text-xs text-blue-300"><strong>Answer:</strong> {mcq.ans}</p>
                                <p className="text-xs text-gray-400 mt-1">{mcq.exp}</p>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
}
