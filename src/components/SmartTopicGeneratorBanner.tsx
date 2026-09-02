import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronDown,
  Plus,
  BookOpen,
} from 'lucide-react';

export interface SmartTopicGeneratorBannerProps {
  isGeneratorSyntaxHelpOpen: boolean;
  setIsGeneratorSyntaxHelpOpen: (open: boolean) => void;
  generatorInputRef: React.RefObject<HTMLTextAreaElement | null>;
  generatorInput: string;
  setGeneratorInput: (val: string) => void;
  handleQuickAddTopic: (e: React.FormEvent) => void;
  isGenerating: boolean;
  getTopicTheme: (title: string) => any;
}

export function SmartTopicGeneratorBanner({
  isGeneratorSyntaxHelpOpen,
  setIsGeneratorSyntaxHelpOpen,
  generatorInputRef,
  generatorInput,
  setGeneratorInput,
  handleQuickAddTopic,
  isGenerating,
  getTopicTheme,
}: SmartTopicGeneratorBannerProps) {
  return (
    <div className="p-4 bg-white/70 dark:bg-[#090D16]/70 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.06] hover:border-[#CBD5E1] dark:hover:border-white/15 rounded-[8px] flex flex-col gap-2.5 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3B82F6] dark:text-blue-400" />
          <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Smart Topic Generator</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsGeneratorSyntaxHelpOpen(!isGeneratorSyntaxHelpOpen)}
          className="text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Syntax Guide</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isGeneratorSyntaxHelpOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Format Guide Help Box with 100% Native CSS Grid Animation */}
      <div
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isGeneratorSyntaxHelpOpen
            ? 'grid-rows-[1fr] opacity-100 mb-1'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 space-y-2 select-none">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-[11.5px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Supported Formatting Syntax:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-white dark:bg-slate-800/80 rounded border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-blue-600 dark:text-blue-400"># Topic Name</span>
                <p className="text-[10.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                  Creates Topic title & Topic Notes/Links
                </p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800/80 rounded border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">## Task Name</span>
                <p className="text-[10.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                  Creates Task under Topic
                </p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800/80 rounded border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">$ Task Description</span>
                <p className="text-[10.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                  Adds description to current Task
                </p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800/80 rounded border border-slate-200/80 dark:border-slate-700">
                <span className="font-bold text-amber-600 dark:text-amber-400">&gt; Note Text</span>
                <p className="text-[10.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                  Adds Note to Topic or Task
                </p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800/80 rounded border border-slate-200/80 dark:border-slate-700 col-span-1 sm:col-span-2">
                <span className="font-bold text-purple-600 dark:text-purple-400">@ Title | URL</span>
                <p className="text-[10.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5">
                  Adds Link to Topic or Task (e.g.,{' '}
                  <code className="text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-1 rounded">
                    @ Docs | drive.google.com/file
                  </code>
                  )
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <form onSubmit={handleQuickAddTopic} className="flex flex-row gap-2 sm:gap-3 items-center w-full">
          <textarea
            ref={el => {
              (generatorInputRef as any).current = el;
              if (el) {
                if (!el.value.includes('\n')) {
                  el.style.height = '34px';
                } else {
                  el.style.height = 'auto';
                  el.style.height = `${Math.max(34, Math.min(el.scrollHeight, 130))}px`;
                }
              }
            }}
            value={generatorInput}
            onChange={e => {
              setGeneratorInput(e.target.value);
              const el = e.target;
              if (!el.value.includes('\n')) {
                el.style.height = '34px';
              } else {
                el.style.height = 'auto';
                el.style.height = `${Math.max(34, Math.min(el.scrollHeight, 130))}px`;
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuickAddTopic(e);
              }
            }}
            placeholder="Type topic name (e.g. শতকরা, সংবিধান, Physics[3])..."
            rows={1}
            className="flex-1 min-w-0 h-[34px] min-h-[34px] max-h-[120px] box-border py-[6px] px-3 sm:px-3.5 bg-white dark:bg-slate-900/80 border border-[#E2E8F0] dark:border-slate-800 rounded-[6px] text-xs text-[#0F172A] dark:text-slate-100 placeholder-[#94A3B8] dark:placeholder-slate-500 placeholder:whitespace-nowrap placeholder:truncate shadow-2xs focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 resize-none leading-[20px] smart-tg-input overflow-y-auto m-0"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="relative overflow-hidden group h-[34px] min-h-[34px] max-h-[34px] box-border px-4 sm:px-5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] text-white rounded-[7px] text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 shrink-0 cursor-pointer m-0"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></span>
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.div>
            ) : (
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
            <span className="whitespace-nowrap relative z-10">{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
        </form>

        {/* Smart Topic Auto-Suggestions Popover Menu */}
        <AnimatePresence>
          {(() => {
            const query = generatorInput.trim().toLowerCase();
            if (
              !query ||
              query.length < 1 ||
              query.includes('\n') ||
              query.startsWith('#') ||
              query.startsWith('@') ||
              query.startsWith('$') ||
              query.startsWith('>')
            ) {
              return null;
            }

            // Comprehensive Syllabus Suggestion Dataset across all 25 Subjects
            const syllabusPool = [
              // 1. বাংলা ব্যাকরণ
              'বাংলা ব্যাকরণ (Bangla Grammar)', 'ধ্বনি ও বর্ণ প্রকরণ', 'সন্ধি বিচ্ছেদ ও নিয়ম', 'সমাস ও ব্যাসবাক্য', 'কারক ও বিভক্তি', 'প্রত্যয় ও উপসর্গ', 'বাগধারা ও প্রবাদ-প্রবচন', 'সমার্থক ও বিপরীতার্থক শব্দ', 'এককথায় প্রকাশ', 'শুদ্ধ বানান ও বাক্য শুদ্ধিকরণ', 'যতি ও বিরামচিহ্ন', 'বাচ্য ও উক্তি পরিবর্তন',
              // 2. বাংলা সাহিত্য
              'বাংলা সাহিত্য (Bangla Literature)', 'চর্যাপদ ও প্রাচীন যুগ', 'শ্রীকৃষ্ণকীর্তন ও মঙ্গলকাব্য', 'বৈষ্ণব পদাবলী ও রোমান্টিক প্রণয়োপাখ্যান', 'আধুনিক যুগ ও ঈশ্বরচন্দ্র বিদ্যাসাগর', 'মাইকেল মধুসূদন দত্ত', 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়', 'রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জীবনানন্দ দাশ', 'জসীম উদ্‌দীন', 'হুমায়ূন আহমেদ',
              // 3. English Grammar
              'English Grammar', 'Parts of Speech', 'Right Form of Verbs', 'Tense & Sequence of Tenses', 'Voice Change (Active & Passive)', 'Narration & Direct-Indirect Speech', 'Appropriate Preposition', 'Synonyms & Antonyms', 'Idioms & Phrases', 'One Word Substitution', 'Spelling Correction & Vocabulary', 'Conditional Sentences', 'Clauses & Phrases',
              // 4. English Literature
              'English Literature', 'Literary Terms & Figures of Speech', 'Elizabethan & Jacobean Age', 'William Shakespeare & Plays', 'Romantic Age & Poets', 'Victorian Age & Novels', 'Modern & Postmodern Literature', 'T.S. Eliot & W.B. Yeats', 'George Bernard Shaw',
              // 5. গণিত / Mathematics
              'গণিত (Mathematics)', 'শতকরা (Percentage)', 'লাভ-ক্ষতি (Profit & Loss)', 'অনুপাত ও সমানুপাত (Ratio & Proportion)', 'ঐকিক নিয়ম (Unitary Method)', 'ভগ্নাংশ ও দশমিক', 'ট্রেন সংক্রান্ত সমস্যা (Train)', 'নৌকা ও স্রোত (Boat & Stream)', 'নল ও চৌবাচ্চা (Pipe & Cistern)', 'কাজ ও সময় (Work & Time)', 'ঘড়ি ও ক্যালেন্ডার (Clock & Calendar)', 'বয়স সংক্রান্ত সমস্যা (Age)', 'জ্যামিতি ও ক্ষেত্রফল (Geometry)', 'ত্রিকোণমিতি ও উচ্চতা (Trigonometry)', 'বীজগণিতীয় সূত্র ও সমীকরণ (Algebra)', 'লগারিদম ও সূচক (Logarithm & Exponents)', 'বিন্যাস ও সমাবেশ (Permutation & Combination)', 'সম্ভাবনা ও পরিসংখ্যান (Probability & Statistics)',
              // 6. মানসিক দক্ষতা / Mental Ability
              'মানসিক দক্ষতা (Mental Ability)', 'ভাষাগত যৌক্তিক বিচার', 'রক্ত সম্পর্ক (Blood Relation)', 'দিক নির্ণয় ও কম্পাস (Direction Sense)', 'চিত্র ও প্রতিবিম্ব (Mirror & Water Images)', 'ঘনক ও পাশা (Cube & Dice)', 'যুক্তি ও ধাঁধা (Reasoning & Puzzles)', 'কোডিং ও ডিকোডিং (Coding-Decoding)', 'সংখ্যা ও বর্ণ সিরিজ (Number & Letter Series)',
              // 7. বাংলাদেশ বিষয়াবলি
              'বাংলাদেশ বিষয়াবলি (Bangladesh Affairs)', 'প্রাচীন বাংলার ইতিহাস ও জনপদ', 'পলাশীর যুদ্ধ ও ব্রিটিশ শাসন', 'ভাষা আন্দোলন ও যুক্তফ্রন্ট', '৬ দফা আন্দোলন ও গণঅভ্যুত্থান', 'বাংলাদেশের নদ-নদী ও ভূ-প্রকৃতি', 'আদমশুমারি ও উপজাতি',
              // 8. আন্তর্জাতিক বিষয়াবলি
              'আন্তর্জাতিক বিষয়াবলি (International Affairs)', 'জাতিসংঘ ও বিশ্ব সংস্থা (UN & Treaties)', 'বিশ্ব রাজনীতি ও ভূ-রাজনীতি (Geopolitics)', 'সার্ক, আসিয়ান ও ন্যাটো (SAARC, ASEAN, NATO)', 'প্রথম ও দ্বিতীয় বিশ্বযুদ্ধ', 'আন্তর্জাতিক চুক্তি ও সম্মেলন', 'বিশ্বের প্রণালী, খাল ও দ্বীপ',
              // 9. সাধারণ বিজ্ঞান
              'সাধারণ বিজ্ঞান (General Science)', 'পদার্থের অবস্থা ও গতিবিদ্যা (Physics)', 'আলো, শব্দ ও তরঙ্গ (Light & Sound)', 'রসায়ন ও রাসায়নিক বিক্রিয়া (Chemistry)', 'পরমাণু ও পর্যায় সারণি', 'জীববিজ্ঞান ও কোষ গঠন (Biology)', 'জিনতত্ত্ব ও ডিএনএ (Genetics & DNA)', 'মানবদেহ ও রোগব্যাধি (Health & Anatomy)', 'খাদ্য ও ভিটামিন (Nutrition)',
              // 10. ICT / Computer
              'তথ্য ও যোগাযোগ প্রযুক্তি (ICT & Computer)', 'কম্পিউটার হার্ডওয়্যার ও সিপিইউ (Hardware & CPU)', 'অপারেটিং সিস্টেম ও সফটওয়্যার', 'সাইবার নিরাপত্তা ও ম্যালওয়্যার (Cyber Security)', 'কম্পিউটার নেটওয়ার্ক ও টপোলজি (Networking)', 'ইন্টারনেট ও ডাটাবেজ (Database & SQL)', 'কৃত্রিম বুদ্ধিমত্তা ও ক্লাউড কম্পিউটিং (AI & Cloud)',
              // 11. ভূগোল
              'ভূগোল ও ভূ-প্রকৃতি (Geography)', 'বাংলাদেশের নদ-নদী ও জলপ্রপাত', 'বায়ুমণ্ডল ও জলবায়ু মণ্ডল', 'ভূমিকম্প ও ভূ-অভ্যন্তর',
              // 12. পরিবেশ
              'পরিবেশ ও বাস্তুসংস্থান (Environment & Ecology)', 'জীববৈচিত্র্য ও সুন্দরবন', 'পরিবেশ দূষণ ও প্রতিকার', 'জলবায়ু পরিবর্তন ও কপ সম্মেলন (COP)',
              // 13. দুর্যোগ ব্যবস্থাপনা
              'দুর্যোগ ব্যবস্থাপনা (Disaster Management)', 'ঘূর্ণিঝড় ও বন্যা ব্যবস্থাপনা', 'ভূমিকম্প ও ভূমিধস পূর্বপ্রস্তুতি', 'দুর্যোগ ঝুঁকি হ্রাস ও পুনর্বাসন',
              // 14. নৈতিকতা
              'নৈতিকতা ও সততা (Ethics & Integrity)', 'পেশাগত ও চিকিৎসা নৈতিকতা', 'দুর্নীতি প্রতিরোধ ও প্রতিকার',
              // 15. মূল্যবোধ
              'মূল্যবোধ ও শিষ্টাচার (Values & Morality)', 'গণতান্ত্রিক ও সামাজিক মূল্যবোধ', 'সহমর্মিতা ও দেশপ্রেম',
              // 16. সুশাসন
              'সুশাসন ও নাগরিক চার্টার (Good Governance)', 'আইনের শাসন ও মানবাধিকার', 'দুদক ও স্বচ্ছতা-জবাবদিহিতা', 'ই-গভর্ন্যান্স ও ডিজিটাল সেবা',
              // 17. Current Affairs / সাম্প্রতিক বিষয়
              'সাম্প্রতিক বিষয়াবলী (Current Affairs)', 'সাম্প্রতিক অর্থনৈতিক সমীক্ষা ও বাজেট', 'সাম্প্রতিক আন্তর্জাতিক চুক্তি ও শীর্ষ সম্মেলন', 'সাম্প্রতিক বিজ্ঞান উদ্ভাবন ও পদক',
              // 18. সাধারণ জ্ঞান
              'সাধারণ জ্ঞান (General Knowledge)', 'বিশ্বের প্রাচীনতম ও বৃহত্তম বিস্ময়', 'বিখ্যাত আবিষ্কার ও আবিষ্কারক', 'বিশ্বের রাজধানী, মুদ্রা ও সংসদ',
              // 19. ইতিহাস
              'বিশ্ব ইতিহাস ও প্রাচীন সভ্যতা (World History)', 'শিল্প বিপ্লব ও রেনেসাঁ', 'ফরাসি বিপ্লব ও রুশ বিপ্লব', 'উপনিবেশবাদ ও স্বাধীনতা সংগ্রাম',
              // 20. সংবিধান ও সরকার
              'বাংলাদেশের সংবিধান (Constitution of Bangladesh)', 'সংবিধানের মৌলিক অধিকার ও অনুচ্ছেদ', 'জাতীয় সংসদ ও সরকার ব্যবস্থা', 'বিচার বিভাগ ও সুপ্রিম কোর্ট', 'নির্বাচন কমিশন ও সাংবিধানিক পদ',
              // 21. অর্থনীতি
              'অর্থনীতি ও জাতীয় আয় (Economy & GDP)', 'মুদ্রাস্ফীতি ও রাজস্ব নীতি', 'আমদানি, রপ্তানি ও বৈদেশিক বাণিজ্য', 'পঞ্চবার্ষিক পরিকল্পনা ও বাজেট',
              // 22. ব্যাংকিং
              'ব্যাংকিং ব্যবস্থা ও কেন্দ্রীয় ব্যাংক (Banking System)', 'বাংলাদেশ ব্যাংক ও মুদ্রানীতি', 'বাণিজ্যিক ব্যাংক ও ইসলামী ব্যাংকিং', 'অনলাইন ব্যাংকিং ও এমএফএস (MFS)',
              // 23. কৃষি
              'কৃষি প্রযুক্তি ও প্রধান খাদ্যশস্য (Agriculture)', 'অর্থকরী ফসল ও উন্নত বীজ (উফশী)', 'মৎস্য ও প্রাণিসম্পদ উন্নয়ন',
              // 24. মুক্তিযুদ্ধ
              'মুক্তিযুদ্ধ ও স্বাধীনতা (Liberation War 1971)', '৭ই মার্চের ভাষণ ও ২৫শে মার্চ অপারেশন সার্চলাইট', 'মুজিবনগর সরকার ও ১১টি সেক্টর', 'বীরশ্রেষ্ঠ ও জাতীয় বীরগণ', '১৬ই ডিসেম্বর বিজয় দিবস ও বুদ্ধিজীবী দিবস',
              // 25. খেলাধুলা
              'খেলাধুলা ও আন্তর্জাতিক ক্রীড়া (Sports & Athletics)', 'ক্রিকেট ও আইসিসি বিশ্বকাপ', 'ফিফা বিশ্বকাপ ও ফুটবল টুর্নামেন্ট', 'অলিম্পিক গেমস ও বিশ্বরেকর্ড',
            ];

            const matched = syllabusPool.filter(item => item.toLowerCase().includes(query)).slice(0, 5);

            if (matched.length === 0) return null;

            return (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 p-1.5 z-50 flex flex-col gap-1 select-none"
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Smart Suggestions ({matched.length})
                  </span>
                  <span>Click to fill & preview</span>
                </div>
                {matched.map(item => {
                  const cleanName = item.split('(')[0].trim();
                  const theme = getTopicTheme(cleanName);
                  const IconComp = theme.icon || BookOpen;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setGeneratorInput(cleanName);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100/90 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6.5 h-6.5 rounded-lg ${theme.cardIconBg} flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                        >
                          <IconComp className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>
                        <span className="text-[11px] font-serif font-semibold text-slate-800 truncate group-hover:text-blue-600">
                          {item}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <div className={`w-2 h-2 rounded-full ${theme.bg}`} />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">
                          Use
                        </span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
