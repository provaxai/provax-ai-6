import React, { useState } from 'react';
import { StudySchedule, ProgressData, StudyTask } from '../types';
import { 
  CheckCircle, 
  Clock, 
  Award, 
  Flame, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Info, 
  Brain, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight, 
  FileText,
  Check
} from 'lucide-react';

interface DashboardProps {
  onboardingName: string;
  testDate: string;
  progress: ProgressData;
  schedule: StudySchedule;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
  onSelectTaskToTrain: (task: StudyTask) => void;
  theme?: 'light' | 'dark';
}

export default function Dashboard({
  onboardingName,
  testDate,
  progress,
  schedule,
  completedTasks,
  onToggleTask,
  onNavigate,
  onSelectTaskToTrain,
  theme = 'dark'
}: DashboardProps) {
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<StudyTask | null>(null);
  const [athenaStatus, setAthenaStatus] = useState('Analisando histórico de acertos');

  React.useEffect(() => {
    const statuses = [
      'Sincronizando curva de esquecimento',
      'Mapeando lacunas de fixação',
      'Analisando padrões do CEBRASPE',
      'Recalculando revisões prioritárias hoje',
      'Sintetizando carga horária tática',
      'Atualizando índice de prontidão'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % statuses.length;
      setAthenaStatus(statuses[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isLight = theme === 'light';

  // Calculates countdown
  const getDaysRemaining = () => {
    const today = new Date();
    const planned = new Date(testDate || '2026-12-15');
    const difference = planned.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Deduces current day schedule based on local day of week
  const getDailyTasksForToday = (): StudyTask[] => {
    const daysMap = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const currentDayName = daysMap[new Date().getDay()];
    const dayData = schedule?.weekly?.find(d => d.dayOfWeek.includes(currentDayName)) || schedule?.weekly?.[0];
    
    if (!dayData) return [];

    return dayData.disciplines.map((disc, idx) => ({
      id: `today-task-${idx}`,
      discipline: disc.name,
      activityType: disc.activityType,
      durationMinutes: disc.duration,
      completed: completedTasks.includes(`today-task-${idx}`),
      impactScore: Math.round((disc.activityType === 'simulado' ? 0.8 : disc.activityType === 'questões' ? 0.5 : 0.3) * 10) / 10,
      title: disc.topic,
      athenaJustification: `Esta sessão foca em ${disc.topic}. A CEBRASPE atribui peso de ${disc.name.includes('Trânsito') ? 'elevado (25% do certame)' : 'grau médio'} para este assunto, fazendo deste objetivo um passo crucial para consolidar sua aprovação hoje.`
    }));
  };

  const todayTasks = getDailyTasksForToday();
  const completedTodayCount = todayTasks.filter(t => completedTasks.includes(t.id)).length;
  const progressPercent = todayTasks.length > 0 ? (completedTodayCount / todayTasks.length) * 100 : 0;
  const potentialGainSum = todayTasks.reduce((sum, t) => sum + (completedTasks.includes(t.id) ? 0 : t.impactScore), 0);

  // Find next unfinished task for today to answer "What should I study right now?"
  const nextIncompleteTask = todayTasks.find(t => !completedTasks.includes(t.id));

  // Determine total remaining study time for today
  const totalMinutesRemaining = todayTasks
    .filter(t => !completedTasks.includes(t.id))
    .reduce((sum, t) => sum + t.durationMinutes, 0);

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="space-y-12 pb-14" id="dashboard-tab-view">
      
      {/* HEADER: Minimalist Greeting & Premium Countdown Badge Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 pb-6 mt-1" id="dashboard-header-simple">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-amber-500' : 'bg-amber-400 animate-pulse'}`} />
            <span className={`text-[10px] font-mono tracking-[0.2em] font-bold uppercase ${isLight ? 'text-slate-500' : 'text-[#8a9ab3]'}`}>
              SUÍTE DE PLANEJAMENTO ESTRATÉGICO
            </span>
          </div>
          <div className="space-y-1">
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Foco na Meta, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400">{onboardingName || 'Recruta'}</span>
            </h1>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400/90'} max-w-xl font-medium leading-relaxed`}>
              Algoritmo Athena compilou sua agenda de alto impacto para hoje visando a fixação de longo prazo.
            </p>
          </div>
        </div>

        {/* Dynamic Minimal Countdown Badge with loose breathing room */}
        <div className={`flex items-center gap-5 py-3.5 px-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
          isLight 
            ? 'bg-slate-50 border-slate-200 shadow-sm' 
            : 'bg-[#0f1424] border-[#1d263b] shadow-xl'
        }`} id="countdown-minimal-pill">
          <div className="text-left font-mono">
            <span className={`text-[9px] block uppercase tracking-wider font-extrabold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              CRONOGRAMA EDITADO
            </span>
            <span className={`text-xs block font-bold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Prova Oficial
            </span>
          </div>
          <div className="h-10 w-[1px] bg-slate-800" />
          <div className="text-right">
            <span className="text-3xl font-black font-mono text-amber-500 block leading-none">
              {getDaysRemaining()}
            </span>
            <span className="text-[9px] block uppercase tracking-wider font-mono font-bold text-slate-500 mt-1">
              Dias Restantes
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          CAMADA 1 — FOCO PRINCIPAL (Estudo do Dia)
          ==================================================================== */}
      <div className={`p-10 md:p-14 rounded-3xl border transition-all duration-300 transform hover:scale-[1.001] ${
        isLight 
          ? 'bg-gradient-to-b from-white to-slate-50/50 border-slate-200 shadow-xl' 
          : 'bg-[#0f1424] border-[#1d263b] shadow-2xl hover:border-amber-500/10'
      }`} id="main-hq-mission-block">
        
        {/* PREMIUM HEADER: Estudo do Dia em Destaque Total */}
        <div className="text-center max-w-2xl mx-auto mb-10 pb-6 border-b border-dashed border-slate-800/60" id="estudo-do-dia-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-mono tracking-[0.2em] font-extrabold text-amber-500 uppercase">
              PLANO ATIVO DE ALTO IMPACTO
            </span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase ${
            isLight 
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_px_2px_8px_rgba(245,158,11,0.15)]'
          }`}>
            Estudo do Dia
          </h2>
          <p className={`text-xs md:text-sm mt-3 ${isLight ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
            Mapeamento em tempo real do edital PRF com base no seu nível de fixação atual
          </p>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-8" id="premium-focus-body">
          {nextIncompleteTask ? (
            <div className="space-y-6">
              {/* Core Content Presentation */}
              <div className="space-y-3">
                <span className={`text-[11px] font-mono uppercase tracking-[0.25em] font-extrabold block ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {nextIncompleteTask.activityType === 'teoria' ? 'Sessão de Teoria' :
                   nextIncompleteTask.activityType === 'questões' ? 'Praticar Exercícios' :
                   nextIncompleteTask.activityType === 'revisão' ? 'Revisão Sistemática' :
                   'Simulado Diagnóstico'}
                </span>
                
                <h3 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {nextIncompleteTask.discipline}
                </h3>
                
                <p className={`text-lg sm:text-xl lg:text-2xl ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                } font-medium italic select-all py-1`}>
                  "{nextIncompleteTask.title}"
                </p>
              </div>

              {/* Seamless Inline Metadata */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400 border-t border-b border-slate-900/30 py-3.5 max-w-xl mx-auto">
                <span className="flex items-center gap-1.5">
                  ⏱️ <b>{nextIncompleteTask.durationMinutes} minutos</b>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  📈 <b>+{nextIncompleteTask.impactScore}% probabilidade</b>
                </span>
              </div>

              {/* Pulsing Sleek Start Exercise/Simulado CTA Button */}
              <div className="pt-4 flex flex-col items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTaskToTrain(nextIncompleteTask);
                    onNavigate('treinar');
                  }}
                  className="relative group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 text-sm uppercase tracking-wider cursor-pointer shadow-xl shadow-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]"
                >
                  <Play className="w-4 h-4 fill-current text-slate-950 group-hover:scale-110 transition-transform duration-300" />
                  <span>Iniciar Sessão de Hoje</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 mb-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Roteiro do Dia Cumprido!
                </h3>
                <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-xl leading-relaxed mx-auto`}>
                   Sua constância impede que o declínio de fixação cerebral comprometa os tópicos estudados. Todas as tarefas diárias foram assimiladas perfeitamente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('treinar')}
                className="bg-[#1b263e]/40 hover:bg-[#253556]/60 text-white font-bold py-3.5 px-8 rounded-xl border border-slate-700/40 transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Módulos de Exercícios & Simulados
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          CAMADA 3 — RECOMENDAÇÕES DA AMBIENTE ATHENA AI
          Active artificial intelligence feel with rapid-diagnostics
          ==================================================================== */}
      <div className={`p-8 sm:p-10 rounded-2xl border transition-all duration-300 ${
        isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-[#0b0f1d] border-slate-900 shadow-xl'
      } relative overflow-hidden`} id="athena-agent-insights-deck">
        
        {/* Subtle decorative pulsing network ring */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 dark:bg-amber-400/[0.01] rounded-full blur-xl pointer-events-none animate-pulse" />
        
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 text-amber-400 border-amber-500/20'
            }`}>
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs uppercase tracking-widest font-mono text-[#F59E0B] font-extrabold">ATHENA INTELLIGENCE MODULE</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 lowercase font-extrabold italic transition-all duration-500 leading-none">
                  {athenaStatus}...
                </span>
              </div>
              <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Diagnósticos Estratégicos Ativos
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('athena')}
            className={`text-xs font-mono font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-950 hover:bg-slate-900 text-amber-500 border border-slate-800'
            }`}
          >
            <span>Central Athena IA</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>

        {/* Dynamic / High Action Diagnostics List with improved legibility */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" id="athena-diagnostics-deck">
          
          {/* Diagnostic Card 1: Física */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            isLight ? 'bg-white border-slate-150 shadow-sm' : 'bg-slate-950/45 border-[#161d31] hover:border-red-500/10'
          } space-y-3 text-left`}>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-sm">📉</span>
              <span className={`text-xs sm:text-[13px] font-mono uppercase font-black tracking-widest ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                FÍSICA GERAL
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed font-normal">
              Aproveitamento apresentou oscilação de 18% nos últimos simulados integrados sobre dinâmica do movimento e cinemática vetorial. Recomendada revisão teórica tática imediata.
            </p>
          </div>

          {/* Diagnostic Card 2: Legislação */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            isLight ? 'bg-white border-slate-150 shadow-sm' : 'bg-slate-950/45 border-[#161d31] hover:border-emerald-500/10'
          } space-y-3 text-left`}>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-sm">✔</span>
              <span className={`text-xs sm:text-[13px] font-mono uppercase font-black tracking-widest ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                LEGISLAÇÃO DE TRÂNSITO
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed font-normal">
              Estabilidade consolidada em ~84% de retenção geral. Excelente fixação tática do CTB e das resoluções prioritárias do CONTRAN indicadas para o concurso da PRF.
            </p>
          </div>

          {/* Diagnostic Card 3: Português */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            isLight ? 'bg-white border-slate-150 shadow-sm' : 'bg-slate-950/45 border-[#161d31] hover:border-amber-500/10'
          } space-y-3 text-left`}>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-sm">⚠️</span>
              <span className={`text-xs sm:text-[13px] font-mono uppercase font-black tracking-widest ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                LÍNGUA PORTUGUESA
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed font-normal">
              Entrando no limiar de declínio da curva de esquecimento passivo CEP. Último mapeamento estruturado ocorreu há 4 dias. Recomendado exercitar 15 flashcards curtos hoje.
            </p>
          </div>

        </div>

        {/* Central Tactical Recommendation Plate with wider margins and breathing room */}
        <div className={`mt-6 p-5 rounded-2xl border italic leading-relaxed ${
          isLight 
            ? 'bg-amber-500/5 border-amber-500/20 text-slate-800 shadow-sm' 
            : 'bg-[#1b2135]/30 border-amber-500/10 text-slate-350 shadow-md'
        } text-[13px] text-left font-sans flex items-start gap-3`}>
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <b className="font-extrabold uppercase font-mono tracking-wider text-amber-400 mr-1.5">RECOMENDAÇÃO INTELIGENTE DA ATHENA IA:</b> "Priorize as revisões sugeridas no roteiro de hoje antes de iniciar novos tópicos. O incremento preditivo atual aponta que manter sua sequência semanal ativa assegura sua integridade nos pontos cruciais do edital."
          </div>
        </div>

      </div>

      {/* ====================================================================
          4. Radar de Resoluções do CONTRAN Bento Shortcut Widget
          ==================================================================== */}
      <div 
        onClick={() => onNavigate('contran')}
        className={`border rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 select-none ${
          isLight 
            ? 'bg-slate-50 border-amber-500/30 hover:border-amber-500 shadow-sm' 
            : 'bg-[#0f1424] border-amber-500/20 hover:border-amber-400/40 hover:shadow-amber-950/10'
        }`}
        id="contran-radar-shortcut-widget"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0 mt-1">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono tracking-widest text-[#F59E0B] font-extrabold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Foco Exclusivo PRF
              </span>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-extrabold uppercase bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40">
                5 Resoluções Críticas
              </span>
            </div>
            <h3 className={`text-md font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Radar de Resoluções do CONTRAN
            </h3>
            <p className={`text-xs leading-relaxed max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Mapeamento tático direcionado às conhecidas pegadinhas de trânsito do CEBRASPE. Estude as Resoluções **432 (Lei Seca)**, **960 (Insulfilm)** e **789 (Habilitação)** de forma objetiva!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/[0.04] pt-3 md:pt-0">
          <div className="text-right font-mono text-[9px] text-slate-500 hidden sm:block">
            <span>Diagnóstico CONTRAN</span>
            <span className="text-amber-500 font-extrabold block">PRONTIDÃO: 70%</span>
          </div>
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
            <span>Estudar CONTRAN</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </div>
      </div>

      {/* ====================================================================
          5. Athena's Task Justification Dialog / Drawer popup
          ==================================================================== */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border max-w-md w-full rounded-2xl p-6 shadow-2xl relative animate-scale-up ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-emerald-900/30'
          }`}>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 text-md shrink-0">
                🦉
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#F59E0B] font-extrabold block">
                  Justificativa da Athena AI
                </span>
                <h3 className={`text-md font-extrabold leading-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedTaskDetail.discipline}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1 italic">
                  "{selectedTaskDetail.title}"
                </p>
              </div>
            </div>

            <div className={`p-4 border rounded-xl mb-6 text-xs text-left font-sans leading-relaxed italic ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              "{selectedTaskDetail.athenaJustification}"
            </div>

            <div className={`flex items-center justify-between text-[11px] font-mono mb-6 pb-2 border-b ${
              isLight ? 'border-slate-100 text-slate-500' : 'border-slate-850 text-slate-400'
            }`}>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Carga: {selectedTaskDetail.durationMinutes} min
              </span>
              <span className="text-emerald-500 font-bold">
                +{selectedTaskDetail.impactScore}% na Aprovidade
              </span>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setSelectedTaskDetail(null)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold hover:text-white transition-colors border ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Voltar
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  onSelectTaskToTrain(selectedTaskDetail);
                  setSelectedTaskDetail(null);
                  onNavigate('treinar');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                  completedTasks.includes(selectedTaskDetail.id)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                disabled={completedTasks.includes(selectedTaskDetail.id)}
              >
                <span>Treinar Agora</span>
                <Play className="w-3 h-3 text-white fill-current" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
