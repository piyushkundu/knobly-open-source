'use client';

import Link from 'next/link';

const SYLLABUS = [
    {
        title: 'M1-R5: Information Technology Tools and Network Basics',
        color: 'from-blue-600 to-cyan-500',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-700',
        units: [
            { unit: 1, topic: 'Introduction to Computer' },
            { unit: 2, topic: 'Introduction to Operating System' },
            { unit: 3, topic: 'Word Processing' },
            { unit: 4, topic: 'Spreadsheet' },
            { unit: 5, topic: 'Presentation' },
            { unit: 6, topic: 'Introduction to Internet and WWW' },
            { unit: 7, topic: 'E-mail, Social Networking and e-Governance Services' },
            { unit: 8, topic: 'Digital Financial Tools and Applications' },
            { unit: 9, topic: 'Overview of Futureskills and Cyber Security' },
        ],
    },
    {
        title: 'M2-R5: Web Designing & Publishing',
        color: 'from-pink-600 to-purple-500',
        bgLight: 'bg-pink-50',
        textColor: 'text-pink-700',
        units: [
            { unit: 1, topic: 'Introduction to Web Design' },
            { unit: 2, topic: 'Editors' },
            { unit: 3, topic: 'HTML Basics' },
            { unit: 4, topic: 'Cascading Style Sheets (CSS)' },
            { unit: 5, topic: 'CSS Framework' },
            { unit: 6, topic: 'JavaScript and Angular Js' },
            { unit: 7, topic: 'Photo Editor' },
            { unit: 8, topic: 'Web Publishing and Browsing' },
        ],
    },
    {
        title: 'M3-R5: Programming and Problem Solving through Python',
        color: 'from-amber-500 to-orange-500',
        bgLight: 'bg-amber-50',
        textColor: 'text-amber-700',
        units: [
            { unit: 1, topic: 'Introduction to Programming' },
            { unit: 2, topic: 'Algorithm and Flowcharts to Solve Problems' },
            { unit: 3, topic: 'Introduction to Python' },
            { unit: 4, topic: 'Operators, Expressions and Python Statements' },
            { unit: 5, topic: 'Sequence Data Types' },
            { unit: 6, topic: 'Functions' },
            { unit: 7, topic: 'File Processing' },
            { unit: 8, topic: 'Modules' },
            { unit: 9, topic: 'NumPy Basics' },
        ],
    },
    {
        title: 'M4-R5: Internet of Things and its Applications',
        color: 'from-emerald-600 to-teal-500',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        units: [
            { unit: 1, topic: 'Introduction to IoT - Applications/Devices, Protocols and Communication Model' },
            { unit: 2, topic: 'Things and Connections' },
            { unit: 3, topic: 'Sensors, Actuators and Microcontrollers' },
            { unit: 4, topic: 'Building IoT Applications' },
            { unit: 5, topic: 'Security and Future of IoT Ecosystem' },
            { unit: 6, topic: 'Soft skills-Personality Development' },
        ],
    },
];

export default function SyllabusPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            NIELIT O Level Syllabus
                        </h1>
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                            Revision 5.1 (Latest Curriculum)
                        </p>
                    </div>
                    <Link 
                        href="/" 
                        className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <span>&larr;</span> Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight">Course Modules</h2>
                    <p className="text-slate-500 text-lg leading-relaxed">Comprehensive curriculum covering IT tools, web development, Python programming, and Internet of Things.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {SYLLABUS.map((subject, si) => (
                        <section 
                            key={si} 
                            className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 group flex flex-col"
                        >
                            <div className={`bg-gradient-to-r ${subject.color} px-8 py-6 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
                                <h2 className="text-xl font-bold text-white relative z-10 leading-snug pr-4">{subject.title}</h2>
                            </div>
                            
                            <div className="flex-1 p-8 flex flex-col gap-2.5">
                                {subject.units.map((u) => (
                                    <div 
                                        key={u.unit} 
                                        className={`flex items-start gap-4 p-3 rounded-2xl transition-colors duration-300 hover:${subject.bgLight} group/item cursor-default`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 group-hover/item:${subject.textColor} group-hover/item:bg-white shadow-sm transition-all duration-300`}>
                                            {u.unit}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-slate-600 font-medium text-[15px] leading-relaxed group-hover/item:text-slate-900 transition-colors duration-300">{u.topic}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Additional Information Section */}
                <div className="mt-20 space-y-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Examination & Grading System</h2>
                        <p className="text-slate-500 text-base leading-relaxed">Important details regarding the assessment, project, and certification process conducted by NIELIT.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Weightage Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Marks Weightage</h3>
                            <ul className="space-y-2 text-slate-600 text-sm">
                                <li className="flex justify-between items-center"><span className="font-medium">Theory Exam:</span> <span className="text-slate-900 font-bold">60%</span></li>
                                <li className="flex justify-between items-center"><span className="font-medium">Practical Exam:</span> <span className="text-slate-900 font-bold">40%</span></li>
                                <div className="h-px bg-slate-100 my-2"></div>
                                <li className="text-xs text-slate-500 italic mt-2">Minimum 33% required individually in Theory and Practical, and 50% aggregate to pass a module.</li>
                            </ul>
                        </div>

                        {/* Grading System Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Grading System</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="flex justify-between"><span className="font-bold text-emerald-600">S Grade</span> <span className="text-slate-600">≥ 85%</span></div>
                                <div className="flex justify-between"><span className="font-bold text-blue-600">A Grade</span> <span className="text-slate-600">75% - 84%</span></div>
                                <div className="flex justify-between"><span className="font-bold text-indigo-600">B Grade</span> <span className="text-slate-600">65% - 74%</span></div>
                                <div className="flex justify-between"><span className="font-bold text-amber-600">C Grade</span> <span className="text-slate-600">55% - 64%</span></div>
                                <div className="flex justify-between"><span className="font-bold text-orange-600">D Grade</span> <span className="text-slate-600">50% - 54%</span></div>
                                <div className="flex justify-between"><span className="font-bold text-red-600">F Grade</span> <span className="text-slate-600">&lt; 50%</span></div>
                            </div>
                        </div>

                        {/* Project & Authority Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Project & Authority</h3>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p><span className="font-semibold text-slate-900">Project Work:</span> It is compulsory to submit one project (PJ1-R5) after completing the modules. No marks are assigned, but successful submission is mandatory.</p>
                                <p><span className="font-semibold text-slate-900">Authority:</span> All examinations, syllabus design, and certifications are officially conducted by <strong>NIELIT</strong> (National Institute of Electronics & Information Technology), Govt. of India.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
