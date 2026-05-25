import React from 'react';
import { StudySchedule, ProgressData, StudyTask } from '../types';
import { Check, Play, ArrowRight, Shield, Target, Zap } from 'lucide-react';

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

// Palette
const ORANGE = '#E8A020';
const GREEN = '#2D9E6B';
const RED = '#C0392B';
const RED_SOFT = '#E74C3C';
const TEXT = '#1A1A1A';
const MUTED = '#888';

export default function Dashboard({
  onboardingName,
  testDate,
  progress,
  onNavigate,
  onSelectTaskToTrain,
}: DashboardProps) {
  // Countdown — placeholder target 2026-09-01
  const getDaysRemaining = () => {
    const target = new Date(testDate || '2026-09-01');
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const totalAnswered = progress?.totalQuestionsAnswered ?? 0;
  const taxa = progress?.overallAccuracyRate ?? 0;
  const streak = progress?.daysConsecutive ?? 0;

  // Mission goals
  const goals = [
    {
      id: 'g1',
      label: '10 questões de Legislação',
      done: totalAnswered >= 10,
      status: totalAnswered >= 10 ? 'concluído' : `${Math.min(totalAnswered, 10)}/10`,
      onClick: () => {
        onSelectTaskToTrain({
          id: 'dash-mission-questoes',
          discipline: 'Legislação de Trânsito',
          activityType: 'questões',
          durationMinutes: 60,
          completed: false,
          impactScore: 0.8,
          title: '10 questões de Legislação de Trânsito',
          athenaJustification: 'Foco em legislação para consolidar o bloco de maior peso na PRF.',
        });
        onNavigate('treinar');
      },
    },
    {
      id: 'g2',
      label: 'Revisar 5 flashcards',
      done: false,
      status: '0/5',
      onClick: () => onNavigate('biblioteca'),
    },
    {
      id: 'g3',
      label: 'Sessão Modo Foco 25 min',
      done: false,
      status: 'pendente',
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
  const goalPercent = (completedGoals / goals.length) * 100;

  // Diagnostics — top 3 weakest disciplines that have answers
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

  const diagColor = (r: number) => (r < 50 ? RED_SOFT : r < 70 ? ORANGE : GREEN);
  const diagStatus = (r: number) =>
    r < 50 ? 'Revisar urgente' : r < 70 ? 'Atenção' : 'Em dia ✓';

  // Athena recommendation based on worst discipline
  const worst = diagnostics[0];
  const athenaText =
    worst.rate < 50
      ? `Seu ritmo semanal está consistente. Foque em ${worst.name} esta semana — 15 min/dia de prática ativa fecham o gap antes do próximo simulado.`
      : `Bom desempenho geral. Mantenha a constância em ${worst.name} para garantir aprovação no próximo simulado.`;

  // Inline styles for a guaranteed light wrapper
  const wrapperStyle: React.CSSProperties = {
    background: '#F5F3EE',
    minHeight: '100%',
    padding: '18px 16px',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    color: TEXT,
  };
  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
    padding: 18,
  };

  return (
    <div style={wrapperStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Suíte de Planejamento Estratégico
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px', color: TEXT, letterSpacing: '-0.01em' }}>
              Foco na Meta, <span style={{ color: ORANGE }}>{onboardingName || 'Recruta'}</span>
            </h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
              Athena compilou sua agenda de alto impacto para hoje.
            </p>
          </div>
          <div style={{ ...card, padding: '10px 16px', textAlign: 'center', minWidth: 110 }}>
            <div style={{ fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Prova Oficial
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: TEXT, lineHeight: 1.1, margin: '2px 0' }}>
              {getDaysRemaining()}
            </div>
            <div style={{ fontSize: 11, color: MUTED }}>dias restantes</div>
          </div>
        </div>

        {/* MISSION */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <span
              style={{
                background: '#FFF1D6',
                color: ORANGE,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              ● Plano ativo de alto impacto
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', margin: 0, color: TEXT }}>
            Missão de Hoje
          </h2>
          <p style={{ textAlign: 'center', color: MUTED, fontSize: 12, margin: '4px 0 12px' }}>
            Legislação de Trânsito · 60 min · +50 XP
          </p>
          <div style={{ height: 4, background: '#F1ECE1', borderRadius: 999, overflow: 'hidden', margin: '0 auto 14px' }}>
            <div style={{ height: '100%', width: `${goalPercent}%`, background: ORANGE, transition: 'width 0.3s' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={g.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  border: '1px solid #EFE8DA',
                  borderRadius: 12,
                  background: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: g.done ? GREEN : 'transparent',
                    border: g.done ? `1px solid ${GREEN}` : '1.5px solid #CFC8B8',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {g.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </span>
                <span style={{ flex: 1, fontSize: 14, color: TEXT, fontWeight: 500 }}>{g.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    color: g.done ? GREEN : MUTED,
                    fontWeight: 600,
                    background: g.done ? '#E7F6EE' : '#F1ECE1',
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  {g.status}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('treinar')}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '12px 16px',
              background: ORANGE,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              boxShadow: '0 2px 10px rgba(232,160,32,0.25)',
            }}
          >
            <Play size={14} fill="#fff" /> Iniciar sessão de hoje <ArrowRight size={14} />
          </button>
        </div>

        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Target size={16} color={GREEN} />
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Taxa de acerto</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: GREEN }}>{Math.round(taxa)}%</div>
          </div>
          <div style={{ ...card, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Zap size={16} color={ORANGE} />
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Streak ativo</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: ORANGE }}>
              {streak} <span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>dias</span>
            </div>
          </div>
        </div>

        {/* DIAGNOSTICS */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ORANGE,
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Diagnósticos estratégicos ativos
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {diagnostics.map((d) => {
              const color = diagColor(d.rate);
              return (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{d.name}</span>
                    <span style={{ fontSize: 12, color, fontWeight: 700 }}>{Math.round(d.rate)}%</span>
                  </div>
                  <div style={{ height: 6, background: '#F1ECE1', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(d.rate, 2)}%`, background: color }} />
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{diagStatus(d.rate)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ATHENA */}
        <div
          style={{
            background: '#FFF8EC',
            border: '1px solid #FFE4A0',
            borderRadius: 14,
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFE4A0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={18} color={ORANGE} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: ORANGE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Recomendação Athena IA
            </div>
            <p style={{ fontSize: 13, color: TEXT, margin: '4px 0 0', lineHeight: 1.5 }}>{athenaText}</p>
          </div>
        </div>

        {/* CONTRAN */}
        <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: '#FDECEC',
                  color: RED,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 999,
                }}
              >
                Foco PRF
              </span>
              <span
                style={{
                  background: '#FFF1D6',
                  color: ORANGE,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 999,
                }}
              >
                5 resoluções críticas
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px', color: TEXT }}>Radar do CONTRAN</h3>
            <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
              Res. 432, 960 e 789 — mais cobradas pelo CEBRASPE
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('treinar')}
            style={{
              background: ORANGE,
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            Estudar <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
