import React, { useState, useEffect } from 'react';
import { StudySchedule, ProgressData, StudyTask } from '../types';
import { Check, Play, ArrowRight, Shield, Target, Zap, MinusCircle, CalendarDays, Clock, Brain, AlertTriangle, BarChart2 } from 'lucide-react';

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

const BLUE       = '#1B4FD8';
const BLUE_DARK  = '#1339A8';
const BLUE_SOFT  = '#EEF3FF';
const BLUE_BORDER = '#BFDBFE';
const BLUE_ICON_BG = '#DBEAFE';
const BLUE_ICON_BORDER = '#93C5FD';
const ORANGE     = '#E8A020';
const GREEN      = '#2D9E6B';
const RED        = '#C0392B';
const RED_SOFT   = '#E74C3C';
const TEXT       = '#1A1A1A';
const MUTED      = '#888';

export default function Dashboard({
  onboardingName,
  testDate,
  progress,
  schedule,
  onNavigate,
  onSelectTaskToTrain,
  theme = 'dark',
}: DashboardProps) {
  const isDark = theme === 'dark';

  // Real spaced repetition urgent count from localStorage
  const [urgentRevisaoCount, setUrgentRevisaoCount] = useState(0);
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('prf_spaced_repetition_items') || '[]');
      const today = new Date().toISOString().split('T')[0];
      setUrgentRevisaoCount(items.filter((i: any) => i.nextReviewDate <= today).length);
    } catch {}
  }, []);

  const getDaysRemaining = () => {
    const target = new Date(testDate || '2026-09-01');
    const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const totalAnswered = progress?.totalQuestionsAnswered ?? 0;
  const taxa          = progress?.overallAccuracyRate ?? 0;
  const streak        = progress?.daysConsecutive ?? 0;
  const totalCorrect  = progress?.totalCorrect ?? 0;
  const totalIncorrect = progress?.totalIncorrect ?? 0;
  const notaLiquida   = totalCorrect - totalIncorrect;
  const approvalProb  = progress?.currentApprovalProbability ?? 0;
  const CUT_SCORE     = 82;
  const minutosHoje   = progress?.minutosHoje ?? 0;
  const horasHoje     = Math.floor(minutosHoje / 60);
  const minsResto     = minutosHoje % 60;
  const hasEnoughData = totalAnswered >= 5;

  // Diagnostics
  const dp = progress?.disciplinePerformance || {};
  const withAnswers = Object.entries(dp)
    .filter(([, v]) => v.total > 0)
    .map(([name, v]) => ({ name, rate: v.efficiency }))
    .sort((a, b) => a.rate - b.rate);

  const diagnostics =
    withAnswers.length > 0
      ? withAnswers.slice(0, 3)
      : [
          { name: 'Física Geral', rate: 0 },
          { name: 'Legislação', rate: 0 },
          { name: 'Língua Port.', rate: 0 },
        ];

  const worst = diagnostics[0];
  const missionDiscipline = withAnswers.length > 0 ? worst.name : 'Legislação de Trânsito';

  const diagColor  = (r: number) => (r < 50 ? RED_SOFT : r < 70 ? ORANGE : GREEN);
  const diagStatus = (r: number) => r < 50 ? 'Revisar urgente' : r < 70 ? 'Atenção' : 'Em dia ✓';

  // Mission goals — dynamic
  const goals = [
    {
      id: 'g1',
      label: `10 questões de ${missionDiscipline}`,
      done: totalAnswered >= 10,
      status: totalAnswered >= 10 ? 'concluído' : `${Math.min(totalAnswered, 10)}/10`,
      onClick: () => {
        onSelectTaskToTrain({
          id: 'dash-mission-questoes',
          discipline: missionDiscipline,
          activityType: 'questões',
          durationMinutes: 60,
          completed: false,
          impactScore: 0.8,
          title: `10 questões de ${missionDiscipline}`,
          athenaJustification: `Foco em ${missionDiscipline} — disciplina com maior lacuna identificada.`,
        });
        onNavigate('treinar');
      },
    },
    {
      id: 'g2',
      label: urgentRevisaoCount > 0 ? `Revisão Espaçada (${urgentRevisaoCount} pendentes)` : 'Revisão Espaçada',
      done: urgentRevisaoCount === 0 && totalAnswered > 0,
      status: urgentRevisaoCount > 0 ? `${urgentRevisaoCount} cards` : totalAnswered > 0 ? 'em dia ✓' : 'pendente',
      onClick: () => onNavigate('treinar'),
    },
    {
      id: 'g3',
      label: 'Sessão Modo Foco — 25 min',
      done: minutosHoje >= 25,
      status: minutosHoje >= 25 ? 'concluído' : minutosHoje > 0 ? `${minutosHoje}min` : 'pendente',
      onClick: () => {
        onSelectTaskToTrain({
          id: 'dash-mission-foco',
          discipline: 'Modo Foco',
          activityType: 'teoria',
          durationMinutes: 25,
          completed: false,
          impactScore: 0.5,
          title: 'Sessão Modo Foco — 25 minutos',
          athenaJustification: 'Bloco de concentração profunda para fixação do conteúdo do dia.',
        });
        onNavigate('treinar');
      },
    },
  ];

  const completedGoals = goals.filter((g) => g.done).length;
  const goalPercent    = (completedGoals / goals.length) * 100;

  // Athena recommendation — specific and data-driven
  const athenaText =
    totalAnswered === 0
      ? 'Comece respondendo questões para que eu possa analisar seu desempenho. Sugiro iniciar com Legislação de Trânsito — maior peso na PRF.'
      : worst.rate < 50
      ? `${worst.name} está com ${Math.round(worst.rate)}% de aproveitamento e ${totalIncorrect} erros acumulados. Dedique 15 min hoje para a Revisão Espaçada — os erros já foram adicionados automaticamente à fila de reforço.`
      : `Bom desempenho com ${Math.round(taxa)}% de acerto global.${streak > 2 ? ` Sua sequência de ${streak} dias é excelente.` : ''} Mantenha foco em ${worst.name} para consolidar aprovação no próximo simulado.`;

  // Streak config
  const streakConfig =
    streak === 0
      ? { color: MUTED, bg: isDark ? '#1A2540' : '#F5F3EE', label: 'Comece sua sequência hoje!', emoji: '🎯' }
      : streak < 3
      ? { color: BLUE, bg: isDark ? '#0D1F3C' : BLUE_SOFT, label: 'Bom início — continue amanhã', emoji: '⚡' }
      : streak < 7
      ? { color: ORANGE, bg: isDark ? '#2A1E0A' : '#FFF6E5', label: 'Em ritmo — não perca o fio!', emoji: '🔥' }
      : { color: RED_SOFT, bg: isDark ? '#2A1010' : '#FDECEC', label: 'Sequência de elite — incrível!', emoji: '🏆' };

  const BG          = isDark ? '#0B1120' : '#F5F3EE';
  const SURFACE     = isDark ? '#111827' : '#ffffff';
  const BORDER      = isDark ? '#1F2D45' : '#E8E0D0';
  const TXT         = isDark ? '#F1F5F9' : TEXT;
  const MTXT        = isDark ? '#64748B' : MUTED;
  const TRACK       = isDark ? '#1F2D45' : '#E5EAF2';
  const DIAG_TRACK  = isDark ? '#1F2D45' : '#F1ECE1';
  const ITEM_BG     = isDark ? '#1A2540' : '#FAF7F0';
  const BLUE_SOFT_D = isDark ? '#0D1F3C' : BLUE_SOFT;
  const BLUE_BOR_D  = isDark ? '#1F2D45' : BLUE_BORDER;
  const BLUE_TEXT   = isDark ? '#93C5FD' : BLUE;

  const card: React.CSSProperties = {
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.07)',
    padding: 18,
  };

  return (
    <div style={{ background: BG, minHeight: '100%', padding: '18px 16px', fontFamily: '"DM Sans", system-ui, sans-serif', color: TXT }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {getGreeting()} — Suíte de Planejamento Estratégico
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px', color: TXT, letterSpacing: '-0.01em' }}>
              Foco na Meta, <span style={{ color: BLUE_TEXT }}>{onboardingName || 'Recruta'}</span>
            </h1>
            <p style={{ fontSize: 13, color: MTXT, margin: 0 }}>
              Athena compilou sua agenda de alto impacto para hoje.
            </p>
          </div>
          <div style={{ ...card, padding: '10px 16px', textAlign: 'center', minWidth: 110 }}>
            <div style={{ fontSize: 10, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Prova Oficial
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: TXT, lineHeight: 1.1, margin: '2px 0' }}>
              {getDaysRemaining()}
            </div>
            <div style={{ fontSize: 11, color: MTXT }}>dias restantes</div>
          </div>
        </div>

        {/* MISSION */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <span style={{ background: BLUE_SOFT_D, color: BLUE_TEXT, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 999 }}>
              ● Plano ativo de alto impacto
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', margin: 0, color: TXT }}>
            Missão de Hoje
          </h2>
          <p style={{ textAlign: 'center', color: MTXT, fontSize: 12, margin: '4px 0 12px' }}>
            {missionDiscipline} · 60 min · +50 XP
          </p>
          <div style={{ height: 4, background: TRACK, borderRadius: 999, overflow: 'hidden', margin: '0 auto 14px' }}>
            <div style={{ height: '100%', width: `${goalPercent}%`, background: BLUE, transition: 'width 0.3s' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={g.onClick}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 12, background: SURFACE, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = ITEM_BG)}
                onMouseLeave={(e) => (e.currentTarget.style.background = SURFACE)}
              >
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: g.done ? GREEN : 'transparent', border: g.done ? `1px solid ${GREEN}` : '1.5px solid #CFC8B8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {g.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </span>
                <span style={{ flex: 1, fontSize: 14, color: TXT, fontWeight: 500 }}>{g.label}</span>
                <span style={{ fontSize: 11, color: g.done ? GREEN : MUTED, fontWeight: 600, background: g.done ? (isDark ? '#0D2B1E' : '#E7F6EE') : DIAG_TRACK, padding: '3px 8px', borderRadius: 999 }}>
                  {g.status}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              type="button"
              onClick={() => onNavigate('treinar')}
              style={{ flex: 1, padding: '12px 16px', background: BLUE, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(27,79,216,0.25)' }}
            >
              <Play size={14} fill="#fff" /> Iniciar sessão de hoje
            </button>
            <button
              type="button"
              onClick={() => onNavigate('simulados')}
              style={{ padding: '12px 16px', background: isDark ? '#1A2540' : '#F5F3EE', color: ORANGE, fontWeight: 700, fontSize: 13, border: `1px solid ${isDark ? '#2A3A5C' : '#E8D9B8'}`, borderRadius: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              <Zap size={13} /> Mini Simulado
            </button>
          </div>
        </div>

        {/* SPACED REPETITION ALERT — real data from localStorage */}
        {urgentRevisaoCount > 0 && (() => {
          const urgency = urgentRevisaoCount >= 5 ? 'high' : urgentRevisaoCount >= 2 ? 'mid' : 'low';
          const palette = {
            high: { bg: isDark ? '#2A1010' : '#FDECEC', border: isDark ? '#4A1515' : '#F5B7B1', accent: RED, iconBg: isDark ? '#3A1515' : '#FADBD8' },
            mid:  { bg: isDark ? '#2A1E0A' : '#FFF6E5', border: isDark ? '#4A3010' : '#F5D8A0', accent: ORANGE, iconBg: isDark ? '#3A2810' : '#FCE9C7' },
            low:  { bg: BLUE_SOFT_D, border: BLUE_BOR_D, accent: BLUE, iconBg: isDark ? '#0D1F3C' : BLUE_ICON_BG },
          }[urgency];

          return (
            <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderLeft: `4px solid ${palette.accent}`, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: palette.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                <Brain size={20} color={palette.accent} />
                {urgency === 'high' && (
                  <span style={{ position: 'absolute', top: -4, right: -4, background: RED, color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={9} />
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 10, color: palette.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
                  Revisão Espaçada · Algoritmo Ativo
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TXT, lineHeight: 1.35 }}>
                  <span style={{ color: palette.accent }}>{urgentRevisaoCount} card{urgentRevisaoCount > 1 ? 's' : ''}</span> aguardando revisão agora
                </div>
                <div style={{ fontSize: 11, color: MTXT, marginTop: 2 }}>
                  {urgency === 'high'
                    ? 'Risco de esquecimento alto. Revise antes da próxima sessão de questões.'
                    : urgency === 'mid'
                    ? 'Cartões entrando na zona de esquecimento — 8 min resolvem.'
                    : 'Mantenha o ciclo. Curva de retenção em dia.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('treinar')}
                style={{ background: palette.accent, color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', flexShrink: 0 }}
              >
                Revisar agora <ArrowRight size={13} />
              </button>
            </div>
          );
        })()}

        {/* PROBABILIDADE DE APROVAÇÃO */}
        <div
          style={{
            ...card,
            background: !hasEnoughData
              ? isDark ? '#111827' : '#fff'
              : approvalProb >= CUT_SCORE
                ? isDark ? 'linear-gradient(135deg, #0D2B1E 0%, #111827 100%)' : 'linear-gradient(135deg, #E7F6EE 0%, #fff 100%)'
                : isDark ? `linear-gradient(135deg, ${BLUE_SOFT_D} 0%, #111827 100%)` : `linear-gradient(135deg, ${BLUE_SOFT} 0%, #fff 100%)`,
            border: `1px solid ${!hasEnoughData ? BORDER : approvalProb >= CUT_SCORE ? (isDark ? '#1A4731' : '#A7F3D0') : BLUE_BOR_D}`,
          }}
        >
          {!hasEnoughData ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 10, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>
                Probabilidade de Aprovação PRF
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: MTXT, margin: '4px 0' }}>— %</div>
              <div style={{ fontSize: 12, color: MTXT }}>
                Complete 5+ questões para calcular sua probabilidade real
              </div>
              <button
                type="button"
                onClick={() => onNavigate('treinar')}
                style={{ marginTop: 10, background: BLUE, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Começar agora →
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: approvalProb >= CUT_SCORE ? GREEN : BLUE_TEXT, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                    Probabilidade de Aprovação PRF
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 42, fontWeight: 900, color: approvalProb >= CUT_SCORE ? GREEN : BLUE_TEXT, lineHeight: 1 }}>
                      {approvalProb.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: 12, color: MTXT }}>
                      {approvalProb >= CUT_SCORE ? 'acima da nota de corte ✓' : `faltam ${(CUT_SCORE - approvalProb).toFixed(1)}% para o corte`}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: MTXT, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Corte estimado PRF</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>{CUT_SCORE}%</div>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ height: 10, background: TRACK, borderRadius: 999, overflow: 'visible', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${Math.min(approvalProb, 100)}%`, background: approvalProb >= CUT_SCORE ? `linear-gradient(90deg, ${GREEN}, #34D399)` : `linear-gradient(90deg, ${BLUE_DARK}, ${BLUE})`, borderRadius: 999, transition: 'width 0.5s ease' }} />
                  <div style={{ position: 'absolute', left: `${CUT_SCORE}%`, top: -4, bottom: -4, width: 2, background: ORANGE, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: MTXT }}>0%</span>
                  <span style={{ fontSize: 10, color: ORANGE, fontWeight: 700 }}>▲ Corte {CUT_SCORE}%</span>
                  <span style={{ fontSize: 10, color: MTXT }}>100%</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* STREAK BANNER */}
        <div style={{ background: streakConfig.bg, border: `1px solid ${isDark ? '#1F2D45' : '#E8E0D0'}`, borderLeft: `4px solid ${streakConfig.color}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{streakConfig.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: streakConfig.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Sequência de Estudos
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 1 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: streakConfig.color, lineHeight: 1 }}>
                {streak}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                {streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: MTXT, marginTop: 2 }}>{streakConfig.label}</div>
          </div>
          {streak > 0 && (
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                <div key={i} style={{ width: 8, height: 8 + i * 2, borderRadius: 3, background: streakConfig.color, opacity: 0.6 + (i / 7) * 0.4 }} />
              ))}
            </div>
          )}
        </div>

        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Taxa de acerto */}
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Target size={15} color={GREEN} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Taxa de acerto</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: Math.round(taxa) >= 60 ? GREEN : ORANGE }}>{Math.round(taxa)}%</div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>
              <span style={{ color: GREEN, fontWeight: 600 }}>{totalCorrect}C</span>
              {' '}<span style={{ color: RED, fontWeight: 600 }}>{totalIncorrect}E</span>
              {' '}<span>de {totalAnswered} · meta ≥60%</span>
            </div>
          </div>

          {/* Nota Líquida CEBRASPE */}
          <div style={{ ...card, borderRadius: 14, border: `1px solid ${notaLiquida >= 0 ? (isDark ? '#1A4731' : '#BBF7D0') : (isDark ? '#4A1515' : '#FECACA')}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MinusCircle size={15} color={notaLiquida >= 0 ? GREEN : RED} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Nota Líquida</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: notaLiquida >= 0 ? GREEN : RED }}>
              {notaLiquida > 0 ? `+${notaLiquida}` : notaLiquida}
            </div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>acertos − erros · ≥0 aprovado</div>
          </div>

          {/* Total de questões */}
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <BarChart2 size={15} color={BLUE_TEXT} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Total de questões</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: BLUE_TEXT }}>{totalAnswered}</div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>
              {totalAnswered < 100 ? `faltam ${100 - totalAnswered} p/ meta de 100` : 'meta de 100 atingida ✓'}
            </div>
          </div>

          {/* Foco hoje */}
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Clock size={15} color={ORANGE} />
              <span style={{ fontSize: 10, color: MTXT, fontWeight: 600 }}>Foco hoje</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: minutosHoje >= 25 ? ORANGE : MUTED }}>
              {horasHoje > 0 ? `${horasHoje}h` : ''}{minsResto > 0 ? `${minsResto}m` : minutosHoje === 0 ? '—' : ''}
            </div>
            <div style={{ fontSize: 10, color: MTXT, marginTop: 2 }}>
              {minutosHoje >= 25 ? 'meta diária atingida ✓' : `meta: 25min · faltam ${Math.max(0, 25 - minutosHoje)}min`}
            </div>
          </div>
        </div>

        {/* DIAGNOSTICS */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE_TEXT, display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: MTXT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Diagnósticos estratégicos ativos
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {diagnostics.map((d) => {
              const color = diagColor(d.rate);
              return (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{d.name}</span>
                    <span style={{ fontSize: 12, color, fontWeight: 700 }}>{Math.round(d.rate)}% — {diagStatus(d.rate)}</span>
                  </div>
                  <div style={{ height: 6, background: DIAG_TRACK, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(d.rate, 2)}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WEEKLY DISTRIBUTION */}
        {(() => {
          const DAYS  = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
          const SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
          const jsToIdx = [6, 0, 1, 2, 3, 4, 5];
          const todayIdx    = jsToIdx[new Date().getDay()];
          const tomorrowIdx = (todayIdx + 1) % 7;

          const weekly = schedule?.weekly || [];
          const byDay: Record<string, { name: string; duration: number; activityType: string; topic: string }[]> = {};
          DAYS.forEach((d) => (byDay[d] = []));
          weekly.forEach((day) => {
            const dw = (day.dayOfWeek || '').toLowerCase();
            const key = DAYS.find((d) => dw.startsWith(d.toLowerCase()));
            if (key) byDay[key] = day.disciplines || [];
          });

          const totalsPerDay = DAYS.map((d) => byDay[d].reduce((acc, it) => acc + (it.duration || 0), 0));
          const maxTotal = Math.max(...totalsPerDay, 1);
          const hasAny   = totalsPerDay.some((t) => t > 0);

          const actColor: Record<string, string> = { teoria: BLUE, questões: '#7C3AED', revisão: ORANGE, simulado: RED };
          const actLabel: Record<string, string>  = { teoria: 'Teoria', questões: 'Questões', revisão: 'Revisão', simulado: 'Simulado' };

          return (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarDays size={16} color={BLUE_TEXT} />
                  <span style={{ fontSize: 11, color: MTXT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Distribuição da semana
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('cronograma')}
                  style={{ background: 'transparent', color: BLUE_TEXT, border: `1px solid ${BLUE_BOR_D}`, padding: '5px 10px', borderRadius: 8, fontWeight: 700, fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}
                >
                  Ver cronograma <ArrowRight size={12} />
                </button>
              </div>

              {!hasAny ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: MTXT, fontSize: 13 }}>
                  Cronograma ainda não gerado.{' '}
                  <button type="button" onClick={() => onNavigate('cronograma')} style={{ color: BLUE_TEXT, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                    Gerar agora →
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                    {Object.keys(actLabel).map((k) => (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: MTXT, fontWeight: 600 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: actColor[k] }} />
                        {actLabel[k]}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                    {DAYS.map((d, i) => {
                      const items    = byDay[d];
                      const total    = totalsPerDay[i];
                      const isToday  = i === todayIdx;
                      const isTomorrow = i === tomorrowIdx;
                      const heightPct  = (total / maxTotal) * 100;

                      return (
                        <div key={d} style={{ border: isToday ? `2px solid ${BLUE}` : isTomorrow ? `1.5px dashed ${BLUE_BOR_D}` : `1px solid ${BORDER}`, borderRadius: 10, padding: 8, background: isToday ? BLUE_SOFT_D : SURFACE, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 160 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: isToday ? BLUE_TEXT : TXT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{SHORT[i]}</span>
                            {isToday && <span style={{ fontSize: 8, color: BLUE_TEXT, fontWeight: 800, textTransform: 'uppercase' }}>Hoje</span>}
                            {isTomorrow && <span style={{ fontSize: 8, color: MTXT, fontWeight: 700, textTransform: 'uppercase' }}>Amanhã</span>}
                          </div>

                          <div style={{ height: 3, background: TRACK, borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${heightPct}%`, background: isToday ? BLUE_TEXT : BLUE_BOR_D }} />
                          </div>

                          {items.length === 0 ? (
                            <div style={{ fontSize: 10, color: MTXT, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>Descanso</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                              {items.slice(0, 4).map((it, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    onSelectTaskToTrain({
                                      id: `dash-week-${d}-${idx}`,
                                      discipline: it.name,
                                      activityType: it.activityType as any,
                                      durationMinutes: it.duration,
                                      completed: false,
                                      impactScore: 0.7,
                                      title: it.topic || it.name,
                                      athenaJustification: `Atividade agendada para ${d}.`,
                                    });
                                    onNavigate('treinar');
                                  }}
                                  style={{ background: ITEM_BG, borderLeft: `3px solid ${actColor[it.activityType] || BLUE}`, borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderRadius: 4, padding: '4px 5px', fontSize: 9.5, lineHeight: 1.25, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}
                                  title={`Treinar: ${it.name} — ${it.topic} (${it.duration}min)`}
                                >
                                  <div style={{ fontWeight: 700, color: TXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                                  <div style={{ color: MTXT, display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                                    <Clock size={8} /> {it.duration}min
                                  </div>
                                </button>
                              ))}
                              {items.length > 4 && (
                                <div style={{ fontSize: 9, color: MTXT, textAlign: 'center', fontWeight: 600 }}>+{items.length - 4} mais</div>
                              )}
                            </div>
                          )}

                          {total > 0 && (
                            <div style={{ fontSize: 10, color: isToday ? BLUE_TEXT : MTXT, fontWeight: 700, textAlign: 'center', marginTop: 'auto', paddingTop: 4, borderTop: `1px dashed ${BORDER}` }}>
                              {(total / 60).toFixed(1)}h
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* ATHENA */}
        <div style={{ background: BLUE_SOFT_D, border: `1px solid ${BLUE_BOR_D}`, borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: isDark ? '#1A3060' : BLUE_ICON_BG, border: `1px solid ${isDark ? '#2D4F9A' : BLUE_ICON_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={18} color={BLUE_TEXT} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: BLUE_TEXT, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Recomendação Athena IA
            </div>
            <p style={{ fontSize: 13, color: TXT, margin: '4px 0 0', lineHeight: 1.5 }}>{athenaText}</p>
          </div>
        </div>

        {/* CONTRAN */}
        <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ background: isDark ? '#2A1010' : '#FDECEC', color: RED, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                Foco PRF
              </span>
              <span style={{ background: isDark ? '#2A1E0A' : '#FFF1D6', color: ORANGE, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                5 resoluções críticas
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px', color: TXT }}>Radar do CONTRAN</h3>
            <p style={{ fontSize: 12, color: MTXT, margin: 0 }}>
              Res. 432, 960 e 789 — as mais cobradas pelo CEBRASPE
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contran')}
            style={{ background: BLUE, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
          >
            Estudar <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
