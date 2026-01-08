import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-slate-50 dark:bg-zinc-950 font-display text-[#171111] dark:text-white antialiased overflow-x-hidden pt-2">
            {/* 
              Note: The Material Symbols and Lexend font should ideally be added to index.html 
              for optimal performance. For now, we use standard Tailwind classes that match 
              the requested aesthetic.
            */}
            
            <main className="flex flex-col w-full">
                {/* Hero Section */}
                <section className="relative w-full bg-zinc-900 overflow-hidden min-h-[650px] flex flex-col">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/30 z-10"></div>
                        <div 
                            className="w-full h-full bg-cover bg-center transform scale-105" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKOsuykyny8rKenMs6Lsa1XeTE-06koTtWl5e_TPCtMwSbnxDBgvIlmAovQAZX4lyeLPjypEIIe0UM3s03Tu9-UGcG23yTZxUPT5fzp-B4kDqR7rS3f6uYdeIwmsODbr10eBUFIq8BVoG2DNN8ZR2mlD-ycTTAsRGj7xMJPtPYwWoBNqh812HaYV_TPL7NljKrHe1DGxnT136Q_SVGI5Q7hhnjahmZErdezAYDXNP0GFkpl50qMWpcztHjd0NZejTQf9DgOB1LQww')" }}
                        ></div>
                    </div>
                    <div className="relative overflow-hidden text-left z-10 grow flex flex-col justify-center max-w-[1400px]  px-10 sm:px-14 lg:px-44 py-20">
                        <div className="w-full text-left">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-px w-12 bg-red-600"></span>
                                <span className="text-red-600 font-bold tracking-[0.2em] uppercase text-sm">World-Class Education</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
                                Where Ambition Meets <br/>
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400">Limitless Opportunity</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
                                Experience a unified digital campus designed to elevate learning, foster collaboration, and streamline academic management for the entire university community.
                            </p>
                            <div className="flex flex-wrap gap-5">
                                <button className="h-14 px-8 rounded-md bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 flex items-center gap-3 group">
                                    Start Your Journey
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                                <button className="h-14 px-8 rounded-md bg-white/5 backdrop-blur-md text-white font-bold hover:bg-white/10 transition-colors border border-white/20 flex items-center gap-3">
                                    Watch Campus Tour
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-20 w-full bg-linear-to-t from-slate-50 dark:from-zinc-950 to-transparent pt-12 pb-6">
                        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                            <div className="bg-white dark:bg-zinc-900 rounded-md shadow-2xl p-2 max-w-5xl mx-auto border border-gray-100 dark:border-gray-800 overflow-x-auto">
                                <div className="flex min-w-max md:w-full space-x-2">
                                    {['Student', 'Teacher', 'Parent', 'Admin'].map((role, idx) => (
                                        <label key={role} className="flex-1 cursor-pointer group relative">
                                            <input defaultChecked={idx === 0} className="peer sr-only" name="persona" type="radio" value={role.toLowerCase()}/>
                                            <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-6 py-4 rounded-md text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 peer-checked:bg-red-600 peer-checked:text-white transition-all duration-300">
                                                <div className="text-center md:text-left">
                                                    <span className="block font-bold text-sm">{role}</span>
                                                    <span className="hidden md:block text-[10px] opacity-80 font-normal">
                                                        {role === 'Student' && 'Courseware & Grades'}
                                                        {role === 'Teacher' && 'Classroom Mgmt'}
                                                        {role === 'Parent' && 'Progress Tracking'}
                                                        {role === 'Admin' && 'System Control'}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gateway Section */}
                <section className="py-24 bg-slate-50 dark:bg-zinc-950">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-black text-[#171111] dark:text-white mb-4 tracking-tight">Your Personalized Gateway</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                                Access tools and resources tailored to your specific role within our vibrant university ecosystem.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: 'Student Portal', tag: 'Achieve Excellence', desc: 'Track assignments, view grades, and access course materials seamlessly.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Ef9_X4fP2AKeqfXw7yUwdi_JtOU9mjEEUOTJEftdoDWrwCgPKjeNFmLueY2mGoHOaZ-17m1DLi7Wg9gcyUEugJ9v1XXc2puU9gLv76Iack2arJ9JJWU4YqnYPBqDVX1m5cPFBR_j0Lbr6UC-wrfAey-v5lEcjoZu0a1OzyS5GpueS_wZ4Etbwx8F4yaHuuf_6D4Is2xibabOL_sa3V35snTugw6MaZRDTk9EqsDMKgF8Fl9F0EWi8XMgnPCOBVHFfjMsuH59bQE' },
                                { title: 'Teacher Hub', tag: 'Inspire & Educate', desc: 'Manage curriculum, grade assessments, and engage with students efficiently.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMUezkIA054EJUtP_Hnw2g_xjUKU3ki_zGgdrjZYGiKeJ__4XrFbKWt0lcIHuES7Leme3GALBJrjEKx1bvuPLLgN_zxqx_B47FAuhosGQCWyYC0Blc1tavaU0JDQbZPXzBPXd5TbnEjpmMfRxYzetWlzFjlm6hg6W3tLbCU-k7d7jTVjFMBoyt2ezdWNoNJgbY0AfbX4JJf38WkBp0LQYj6E2-PEnvdwUk2Q3E5CAKs0itCAVghQilS2ZN_FU_-bwH3uTARIEllRs' },
                                { title: 'Parent Connect', tag: 'Partner in Success', desc: 'Stay informed on academic milestones, attendance, and important campus news.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3A4X7hFgSitsDytSvsCtxZqmtyMRXqvBmZIlNCqKIMt2GYoBvZYvBZ2TBMOiUcVP_f2H6-WLbycLyyrrI6Hp_HVxgNY0wFP-LQzUhOaIBkw14lC4HfYFrWUeX3c0kgbe78rE_5X4W3vq9CYEPvo067Gu1xzOriBWMZwZJRAHtbsuTfPiGBDNlkVFS4x_WgCzqn6YPpTA8ffF4u6cNI9A8jOdGAdTzd3V16R9h1QSOFPsjOBL4CXO1IOlh9xs_59Nm0wIfra3nGeI' },
                                { title: 'Admin Control', tag: 'Streamline Operations', desc: 'Oversee institutional data, manage users, and ensure system integrity.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRtnsi6EB0rkcRT0xYYeP7vxvmAu0rAI_kiFTPXkHKgCgi3KP5upnk_EYCbuHHYSa_fkaB-VZSpbxNQLvBvpjnMru-t1h-4lUL8oVRoQcYwGhwGmAS9m4870zGp0SsHD9HSyioqaCcJU5k24eoR1_-YqizVhz11_-GcS5igY7ErSNmY3g4JW9VNHLkAudSw8ikw0w9hgaPjJAWq_5POSkSqLiCCGz491b-dxzyQTnIqQXQt-na50UfgseyyfZV4sUFU1cYEi_Qhh4' }
                            ].map((item) => (
                                <div key={item.title} className="group relative bg-white dark:bg-zinc-900 rounded-md shadow-lg hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
                                    <div className="aspect-4/3 w-full overflow-hidden relative">
                                        <div className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${item.img}')` }}></div>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                                    </div>
                                    <div className="p-8 pt-6 relative">
                                        <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">{item.tag}</h4>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{item.desc}</p>
                                        <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-4"></div>
                                        <span className="text-[#171111] dark:text-white text-sm font-bold flex items-center justify-between group-hover:text-red-600 transition-colors">
                                            Access Dashboard <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-gray-800">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                            <div className="lg:w-1/2 order-2 lg:order-1 relative">
                                <div className="relative rounded-md overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDED12qYvZEKBr4FbcKwgzq1ADT61Yr5nJH8Fe_QibNS2Fy7jwvkOTmqr2PhXubbeubN6hgPe0YnLTEMMYZGt92YYgCXypZ70TSMyOgvjcV8Lfncmp9tlUgqhnouHaEnQ2CVJ4Bf61ScHCXszYko-gh6BFB-UzMHHD7drGQxFs1DS5c371OyW_8DqbZ5N51rHIaWqubM0eEsZz6F2RVs6OaJ0WDyenHn-51-saK4CKYdkH_CJ5GzjZ3fcpCN6d5zk4IkZBRNjMPUkQ" alt="Students" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"/>
                                    <div className="absolute bottom-6 right-6 bg-white dark:bg-zinc-800 p-4 rounded-md shadow-lg max-w-[200px] border border-gray-100 dark:border-gray-600">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Live Activity</span>
                                        </div>
                                        <div className="text-2xl font-bold text-[#171111] dark:text-white">12,450+</div>
                                        <div className="text-xs text-gray-500">Active sessions now</div>
                                    </div>
                                </div>
                                <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-red-600/10 rounded-md blur-3xl"></div>
                            </div>
                            <div className="lg:w-1/2 order-1 lg:order-2">
                                <h3 className="text-4xl lg:text-5xl font-black text-[#171111] dark:text-white mb-6 leading-tight">Seamless Connectivity for Modern Learning</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                    Our platform bridges the gap between physical and digital classrooms. Students can collaborate on projects in real-time, share resources instantly, and participate in discussion forums from anywhere in the world.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Project Workspaces', desc: 'Dedicated virtual rooms for group assignments.' },
                                        { title: 'HD Video Integration', desc: 'Crystal clear conferencing built directly into the flow.' },
                                        { title: 'Peer Messaging', desc: 'Instant secure chat for student-to-student support.' },
                                        { title: 'Resource Sharing', desc: 'Drag-and-drop library for sharing notes and research.' }
                                    ].map(feature => (
                                        <div key={feature.title} className="flex flex-col p-4 bg-gray-50 dark:bg-zinc-950 rounded-md border border-gray-100 dark:border-zinc-800 hover:border-red-600/50 transition-colors">
                                            <span className="font-bold text-[#171111] dark:text-white mb-1">{feature.title}</span>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-red-600 text-white text-center">
                    <div className="max-w-[1000px] mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to shape the future of learning?</h2>
                        <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">Join an ecosystem where technology meets tradition to create unparalleled educational experiences.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button className="px-10 py-4 bg-white text-red-600 rounded-md font-bold hover:bg-gray-50 transition-all shadow-xl text-lg">
                                Apply for Admission
                            </button>
                            <button className="px-10 py-4 bg-transparent border-2 border-white/40 text-white rounded-md font-bold hover:bg-white/10 hover:border-white transition-all text-lg">
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#121212] text-gray-400 py-12 border-t border-gray-900">
                <div className="max-w-[1400px] mx-auto px-4 text-center">
                    <p className="text-sm">© 2024 University LMS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
