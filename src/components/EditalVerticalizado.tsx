import React, { useState, useMemo } from 'react';
import { EditalTopic } from '../types';
import { 
  Play, Check, Heart, HelpCircle, ArrowUpRight, Search, Sparkles,
  Layers, Filter, ChevronDown, ChevronUp, BookOpen, AlertCircle, FileText, RefreshCw
} from 'lucide-react';

interface EditalVerticalizadoProps {
  topics: EditalTopic[];
  onToggleTopic: (topicId: string, field: 'studied' | 'summary' | 'reviewed' | 'simulated') => void;
  onSetAllTopicsOfSubject: (subjectName: string, state: boolean) => void;
  onNavigateToTrain: (discipline: string) => void;
  theme: 'dark' | 'light';
}

export default function EditalVerticalizado({
  topics,
  onToggleTopic,
  onSetAllTopicsOfSubject,
  onNavigateToTrain,
  theme
}: EditalVerticalizadoProps) {
  // Filters state
  const [selectedBloco, setSelectedBloco] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collapse controller for subjects
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({});

  // Mini quiz popup state for instant practice
  const [quickQuizTopic, setQuickQuizTopic] = useState<EditalTopic | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);

  // List of unique subjects available based on selected Bloco
  const subjectList = useMemo(() => {
    const list = new Set<string>();
    topics.forEach(t => {
      if (selectedBloco === 'all' || t.bloco === selectedBloco) {
        list.add(t.subject);
      }
    });
    return Array.from(list);
  }, [topics, selectedBloco]);

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const total = topics.length;
    if (total === 0) return { estudio: 0, resumos: 0, revisoes: 0, simulados: 0, overall: 0, overallPercent: 0 };
    
    const countEstudio = topics.filter(t => t.studied).length;
    const countResumos = topics.filter(t => t.summary).length;
    const countRevisoes = topics.filter(t => t.reviewed).length;
    const countSimulados = topics.filter(t => t.simulated).length;

    // A meta has 4 sub-checkpoints. Total goals = total * 4
    const totalMetas = total * 4;
    const checkedMetas = countEstudio + countResumos + countRevisoes + countSimulados;
    const overallPercent = totalMetas > 0 ? (checkedMetas / totalMetas) * 100 : 0;

    return {
      total,
      countEstudio,
      countResumos,
      countRevisoes,
      countSimulados,
      totalMetas,
      checkedMetas,
      estudioPercent: Math.round((countEstudio / total) * 100),
      resumoPercent: Math.round((countResumos / total) * 100),
      revisaoPercent: Math.round((countRevisoes / total) * 100),
      simuladoPercent: Math.round((countSimulados / total) * 100),
      overallPercent: parseFloat(overallPercent.toFixed(1))
    };
  }, [topics]);

  // Filter topics based on search query, bloco and subject selections
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBloco = selectedBloco === 'all' || t.bloco === selectedBloco;
      const matchesSubject = selectedSubject === 'all' || t.subject === selectedSubject;
      return matchesSearch && matchesBloco && matchesSubject;
    });
  }, [topics, searchQuery, selectedBloco, selectedSubject]);

  // Grouped filtered topics by Subject
  const groupedBySubject = useMemo(() => {
    const groups: Record<string, EditalTopic[]> = {};
    filteredTopics.forEach(t => {
      if (!groups[t.subject]) {
        groups[t.subject] = [];
      }
      groups[t.subject].push(t);
    });
    return groups;
  }, [filteredTopics]);

  const toggleCollapseSubject = (subj: string) => {
    setCollapsedSubjects(prev => ({
      ...prev,
      [subj]: !prev[subj]
    }));
  };

  // Helper to trigger mini quiz simulation on click Praticar
  const handlePracticeTopic = (topic: EditalTopic) => {
    setQuickQuizTopic(topic);
    setQuizAnswer(null);
    setQuizChecked(false);
  };

  const handleAnswerSubmit = (option: 'C' | 'E') => {
    if (quizChecked) return;
    setQuizAnswer(option);
    setQuizChecked(true);

    // If correct, automatically mark the 'simulated' checkpoint for this topic as well!
    if (quickQuizTopic) {
      // Simulate checking the 'simulated' checkpoint automatically
      if (!quickQuizTopic.simulated) {
        onToggleTopic(quickQuizTopic.id, 'simulated');
      }
    }
  };

  return (
    <div className="space-y-6" id="edital-verticalizado-view">
      
      {/* HEADER SECTION IN SLATE COLD COLORING (MATCHING GRAPHICAL REFERENCE) */}
      <div className={`${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-[#1b263e]'} border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden`} id="edital-intelligent-banner">
        
        {/* Abstract graphic accents */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${theme === 'light' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
            <span className={`font-mono text-[9px] uppercase tracking-wider font-extrabold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Rastreamento Tático de Edital • PRF
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Edital Verticalizado Inteligente
          </h2>
          <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'} leading-relaxed`}>
            Mapeamos o edital do concurso da PRF (Legislação de Trânsito completa, as Resoluções do CONTRAN exigidas pelas bancas e toda a parte teórica). Marque manualmente seu progresso ou deixe a IA da Athena computar automaticamente enquanto você estuda!
          </p>
        </div>

        {/* Circular Progress Gauge Card */}
        <div className={`${theme === 'light' ? 'bg-[#f8fafc]' : 'bg-[#111a2e]'} border border-slate-800/60 px-5 py-4 rounded-xl flex items-center gap-4 shrink-0 w-full md:w-auto shadow-md`} id="outer-coverage-card">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={theme === 'light' ? '#e2e8f0' : '#18223d'}
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={theme === 'light' ? '#eab308' : '#fbbf24'}
                strokeWidth="5.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - Math.max(0.01, stats.overallPercent / 100))}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-white">
              {stats.overallPercent}%
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono font-extrabold text-slate-500 tracking-wider block">Cobertura do Edital</span>
            <span className="text-sm font-black text-white font-mono block">
              {stats.checkedMetas} <span className="text-xs text-slate-400 font-normal">/ {stats.totalMetas} Metas</span>
            </span>
            <span className="text-[10px] text-amber-500 font-mono font-semibold flex items-center gap-1 mt-0.5 animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-400" /> IA Monitorando Ativo
            </span>
          </div>
        </div>

      </div>

      {/* INLINE COMPACT METRICS ROW (no individual cards) */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-1" id="indicators-inline-row">
        {[
          { label: 'Estudo', pct: stats.estudioPercent, color: '#2563eb' },
          { label: 'Resumo', pct: stats.resumoPercent, color: '#f59e0b' },
          { label: 'Revisão', pct: stats.revisaoPercent, color: '#a855f7' },
          { label: 'Simulado', pct: stats.simuladoPercent, color: '#64748b' },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-2 min-w-[150px] flex-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
            <span className="text-xs font-medium text-slate-300 w-16 shrink-0">{m.label}</span>
            <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden min-w-[40px]">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${m.pct}%`, background: m.color }} />
            </div>
            <span className="text-xs font-semibold tabular-nums w-10 text-right" style={{ color: m.color }}>{m.pct}%</span>
          </div>
        ))}
      </div>

      {/* FILTER CONTROLS & COMPACT SEARCH BAR */}
      <div className={`${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-900'} border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between`} id="syllabus-filters-bar">
        
        {/* Bloco Toggles (pill buttons matching mockup image exactly) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none" id="blocos-tab-toggles">
          <button
            onClick={() => { setSelectedBloco('all'); setSelectedSubject('all'); }}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedBloco === 'all' 
                ? 'text-white font-black' 
                : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
            }`}
            style={selectedBloco === 'all' ? { background: '#003DA5' } : undefined}
          >
            Ver todos blocos
          </button>
          {[1, 2, 3].map(bn => (
            <button
              key={bn}
              onClick={() => { setSelectedBloco(bn as 1|2|3); setSelectedSubject('all'); }}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedBloco === bn 
                  ? 'text-white font-black' 
                  : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
              }`}
              style={selectedBloco === bn ? { background: '#003DA5' } : undefined}
            >
              Bloco {bn}
            </button>
          ))}
        </div>

        {/* Right filters: Subject Select & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          
          {/* Subject Selector */}
          <div className="relative w-full sm:w-56 shrink-0">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 text-slate-300 border border-slate-850 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="all">Todas as matérias</option>
              {subjectList.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search text input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tópico ou resolução..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-850 rounded-lg text-xs py-2 pl-9 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

        </div>

      </div>

      {/* DISCIPLINE GROUPS ACCORDIONS LIST */}
      <div className="space-y-4" id="disciplines-list-root">
        {Object.keys(groupedBySubject).length === 0 ? (
          <div className="text-center py-10 bg-slate-900/20 border border-slate-900 rounded-xl space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">Nenhum subtópico localizado</h4>
            <p className="text-xs text-slate-500">Tente buscar por um termo diferente ou mude seus filtros de bloco.</p>
          </div>
        ) : (
          (Object.entries(groupedBySubject) as [string, EditalTopic[]][]).map(([subjectName, subjTopics]) => {
            const isCollapsed = !!collapsedSubjects[subjectName];
            
            // Calculate subject-specific dynamic coverage percentage
            const totalOnSubject = subjTopics.length;
            const completedOnSubject = subjTopics.reduce((acc, curr) => {
              let weight = 0;
              if (curr.studied) weight++;
              if (curr.summary) weight++;
              if (curr.reviewed) weight++;
              if (curr.simulated) weight++;
              return acc + weight;
            }, 0);
            const subjectPercent = totalOnSubject > 0 ? Math.round((completedOnSubject / (totalOnSubject * 4)) * 100) : 0;
            const blockNumber = subjTopics[0]?.bloco || 1;

            return (
              <div 
                key={subjectName} 
                className="overflow-hidden"
                id={`accordion-group-${subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                
                {/* LIGHT BLOCK HEADER BAR */}
                <div 
                  onClick={() => toggleCollapseSubject(subjectName)}
                  className="px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/80 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-500 hover:text-slate-700 p-1 rounded transition-colors">
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wide">
                          Bloco {blockNumber}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">
                          {subjectName}
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {totalOnSubject} tópicos
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: '#003DA5' }}>
                        {subjectPercent}% coberto
                      </span>
                      <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${subjectPercent}%`, background: '#003DA5' }} />
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const someUnchecked = subjTopics.some(t => !t.studied || !t.summary || !t.reviewed || !t.simulated);
                        onSetAllTopicsOfSubject(subjectName, someUnchecked);
                      }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Marcar concluído →
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE TABLE */}
                {!isCollapsed && (
                  <div className="overflow-x-auto mt-1">
                    <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] font-normal" style={{ color: '#94A3B8' }}>
                          <th className="py-2 px-4 w-16 text-center font-normal">Código</th>
                          <th className="py-2 px-4 font-normal">Subtópico do edital oficial</th>
                          <th className="py-2 px-4 text-center w-20 font-normal" style={{ color: '#60a5fa' }}>Estudo</th>
                          <th className="py-2 px-4 text-center w-20 font-normal" style={{ color: '#fbbf24' }}>Resumo</th>
                          <th className="py-2 px-4 text-center w-20 font-normal" style={{ color: '#c084fc' }}>Revisão</th>
                          <th className="py-2 px-4 text-center w-20 font-normal">Simulado</th>
                          <th className="py-2 px-4 text-center w-28 font-normal">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjTopics.map((topic) => {
                          const isComplete = topic.studied && topic.summary && topic.reviewed && topic.simulated;
                          return (
                          <tr 
                            key={topic.id} 
                            className="text-xs border-b border-slate-200/70 transition-colors hover:bg-blue-50/30"
                            style={isComplete ? { opacity: 0.65 } : undefined}
                          >
                            
                            {/* CODE */}
                            <td className="py-3 px-4 text-center font-mono font-medium text-slate-500" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              {topic.code}
                            </td>

                            {/* SUBTOPIC DETAIL */}
                            <td className="px-4 font-medium text-slate-800" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              <div>{topic.description}</div>
                              {isComplete && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1.5 font-semibold">
                                  <Check className="w-2.5 h-2.5" /> Concluído
                                </span>
                              )}
                            </td>

                            {/* ESTUDO CHECKBOX */}
                            <td className="px-4 text-center" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              <button
                                onClick={() => onToggleTopic(topic.id, 'studied')}
                                className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all cursor-pointer ${
                                  topic.studied 
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-inner' 
                                    : (theme === 'light' ? 'border-slate-300 hover:border-slate-400 bg-white shadow-sm' : 'border-slate-800 hover:border-slate-600 bg-slate-950')
                                }`}
                              >
                                {topic.studied && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            </td>

                            {/* RESUMO CHECKBOX */}
                            <td className="px-4 text-center" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              <button
                                onClick={() => onToggleTopic(topic.id, 'summary')}
                                className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all cursor-pointer ${
                                  topic.summary 
                                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-inner' 
                                    : (theme === 'light' ? 'border-slate-300 hover:border-slate-400 bg-white shadow-sm' : 'border-slate-800 hover:border-slate-600 bg-slate-950')
                                }`}
                              >
                                {topic.summary && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            </td>

                            {/* REVISÃO CHECKBOX */}
                            <td className="px-4 text-center" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              <button
                                onClick={() => onToggleTopic(topic.id, 'reviewed')}
                                className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all cursor-pointer ${
                                  topic.reviewed 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-inner' 
                                    : (theme === 'light' ? 'border-slate-300 hover:border-slate-400 bg-white shadow-sm' : 'border-slate-800 hover:border-slate-600 bg-slate-950')
                                }`}
                              >
                                {topic.reviewed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            </td>

                            {/* SIMULADO CHECKBOX */}
                            <td className="px-4 text-center" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              <button
                                onClick={() => onToggleTopic(topic.id, 'simulated')}
                                className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all cursor-pointer ${
                                  topic.simulated 
                                    ? 'bg-slate-600 border-slate-500 text-white shadow-inner' 
                                    : (theme === 'light' ? 'border-slate-300 hover:border-slate-400 bg-white shadow-sm' : 'border-slate-800 hover:border-slate-600 bg-slate-950')
                                }`}
                              >
                                {topic.simulated && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            </td>

                            {/* PRACTICE ACTION BUTTON */}
                            <td className="px-4 text-center" style={{ paddingTop: 12, paddingBottom: 12 }}>
                              <button
                                onClick={() => handlePracticeTopic(topic)}
                                className="px-3 py-1 rounded text-[11px] font-medium transition-all inline-flex items-center gap-1 cursor-pointer"
                                style={{ color: '#003DA5', background: 'rgba(0,61,165,0.08)' }}
                                title="Praticar questões agora"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Praticar</span>
                              </button>
                            </td>

                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}


              </div>
            );
          })
        )}
      </div>

      {/* QUICK SIMULATION INTEGRATION MODAL (IMMEDIATE FEEDBACK LOOP) */}
      {quickQuizTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-slide-up text-slate-200">
            
            <div className="bg-[#111a2e] border-b border-slate-800 p-4 shrink-0 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider block">Mini Simulado Imediato • Athena AI</span>
                <span className="text-xs font-black text-white">{quickQuizTopic.subject}</span>
              </div>
              <button 
                onClick={() => setQuickQuizTopic(null)}
                className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 rounded text-xs text-slate-400 hover:text-white"
              >
                Voltar
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-black block mb-1">Subtópico de Referência:</span>
                <span className="text-slate-300 font-semibold">{quickQuizTopic.description}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-550/10 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold uppercase font-mono rounded">
                    Questão Modelo Cebraspe
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Foco PRF</span>
                </div>
                
                {/* Custom questions matching the subject */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                  {quickQuizTopic.subject === 'Legislação de Trânsito' ? (
                    "No que concerne à fiscalização de alcoolemia, de acordo com o CTB e resoluções do CONTRAN, configura crime de trânsito a condução de veículo com teor alcoólico aferido por etilômetro igual ou superior a 0,34 miligrama de álcool por litro de ar expirado."
                  ) : quickQuizTopic.subject === 'Direito Constitucional' ? (
                    "A inviolabilidade domiciliar de asilo só admite penetração sem consentimento do morador à noite, em flagrante delito ou desastre, e durante o dia, mediante mandado judicial."
                  ) : quickQuizTopic.subject === 'Língua Portuguesa' ? (
                    "O emprego do sinal indicativo de crase em frases em que o artigo é feminino antecedido por preposição é obrigatório, independentemente de se tratar de nomes próprios de cidades ou pronomes possessivos femininos."
                  ) : (
                    `Julgue o item teórico subjacente, referente a estudos sistemáticos de ${quickQuizTopic.subject} aplicados nas diretivas da banca examinadora CEBRASPE para provimento de cargos públicos federais.`
                  )}
                </p>
              </div>

              {/* ANSWER INPUTS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit('C')}
                  className={`py-3 px-4 rounded-xl font-bold font-mono text-center text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    quizAnswer === 'C'
                      ? 'bg-emerald-600 border-emerald-500 text-white font-extrabold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-white">Certo (C)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit('E')}
                  className={`py-3 px-4 rounded-xl font-bold font-mono text-center text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    quizAnswer === 'E'
                      ? 'bg-red-600 border-red-500 text-white font-extrabold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-white font-bold">Errado (E)</span>
                </button>
              </div>

              {/* CORRECTION FEEDBACK POPUP */}
              {quizChecked && (
                <div className="animate-fade-in p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-emerald-500">
                      GABARITO COMENTADO
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      Resposta correta:{' '}
                      {quickQuizTopic.subject === 'Legislação de Trânsito' ? 'CERTO' : 
                       quickQuizTopic.subject === 'Direito Constitucional' ? 'ERRADO (à noite não entra por ordem judicial!)' : 
                       quickQuizTopic.subject === 'Língua Portuguesa' ? 'ERRADO' : 'CERTO'}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px] pt-1">
                    {quickQuizTopic.subject === 'Legislação de Trânsito' ? (
                      "Correto! O limite em etilômetro para configuração do tipo penal do Art.306 do CTB é de fato maior ou igual a 0.34 mg/L. A sua IA marcou automaticamente a seção de 'Simulado' no Edital Verticalizado!"
                    ) : quickQuizTopic.subject === 'Direito Constitucional' ? (
                      "Incorreto! O mandado do juiz autoriza entrada APENAS durante o DIA. À noite, a inviolabilidade é absoluta diante de decreto do judiciário. Meta de 'Simulado' atualizada com o teste!"
                    ) : (
                      "Simulação pontuada e computada! A prática de questões ativa a sinapse neuronal ideal para decodificar distratores de múltipla escolha ou assertivas binárias."
                    )}
                  </p>
                </div>
              )}

            </div>

            <div className="bg-[#111a2e]/50 border-t border-slate-800 p-4 flex gap-3 justify-end shrink-0">
              <button
                type="button"
                onClick={() => {
                  setQuickQuizTopic(null);
                  onNavigateToTrain(quickQuizTopic.subject);
                }}
                className="py-1.5 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Fazer mais questões na Central</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
