import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Target } from 'lucide-react';

interface CoordinationTestProps {
  onBack: () => void;
}

type TestMode = 'follow' | 'tap';

interface TargetPosition {
  x: number;
  y: number;
}

export function CoordinationTest({ onBack }: CoordinationTestProps) {
  const [stage, setStage] = useState<'intro' | 'testing' | 'results'>('intro');
  const [mode, setMode] = useState<TestMode>('follow');
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({ x: 50, y: 50 });
  const [userPosition, setUserPosition] = useState<TargetPosition>({ x: 0, y: 0 });
  const [targets, setTargets] = useState<TargetPosition[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [accuracy, setAccuracy] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (stage === 'testing' && mode === 'follow') {
      let time = 0;
      const animate = () => {
        time += 0.02;
        const newX = 50 + Math.sin(time) * 30;
        const newY = 50 + Math.cos(time * 1.5) * 30;
        setTargetPosition({ x: newX, y: newY });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [stage, mode]);

  useEffect(() => {
    if (stage === 'testing') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'testing' && mode === 'tap') {
      generateNewTarget();
    }
  }, [stage, mode]);

  const generateNewTarget = () => {
    const newTarget = {
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    };
    setTargets([newTarget]);
  };

  const startTest = (selectedMode: TestMode) => {
    setMode(selectedMode);
    setScore(0);
    setTimeLeft(30);
    setAccuracy([]);
    setStage('testing');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== 'testing' || mode !== 'follow' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setUserPosition({ x, y });

    const distance = Math.sqrt(
      Math.pow(x - targetPosition.x, 2) + Math.pow(y - targetPosition.y, 2)
    );

    if (distance < 5) {
      setScore((s) => s + 1);
      setAccuracy((acc) => [...acc, 100]);
    } else if (distance < 15) {
      setAccuracy((acc) => [...acc, 50]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (stage !== 'testing' || mode !== 'follow' || !containerRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setUserPosition({ x, y });

    const distance = Math.sqrt(
      Math.pow(x - targetPosition.x, 2) + Math.pow(y - targetPosition.y, 2)
    );

    if (distance < 5) {
      setScore((s) => s + 1);
      setAccuracy((acc) => [...acc, 100]);
    } else if (distance < 15) {
      setAccuracy((acc) => [...acc, 50]);
    }
  };

  const handleTargetClick = (target: TargetPosition) => {
    if (stage !== 'testing' || mode !== 'tap') return;

    setScore((s) => s + 1);
    generateNewTarget();
  };

  const averageAccuracy = accuracy.length > 0
    ? Math.round(accuracy.reduce((a, b) => a + b, 0) / accuracy.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al menú
        </button>

        {stage === 'intro' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coordinación Motora
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Selecciona el tipo de prueba de coordinación
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => startTest('follow')}
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-8 rounded-xl transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">👆</div>
                <h3 className="font-semibold text-xl mb-3">Seguir el Punto</h3>
                <p className="text-sm opacity-90">
                  Mantén el cursor sobre el punto en movimiento
                </p>
              </button>

              <button
                onClick={() => startTest('tap')}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-8 rounded-xl transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="font-semibold text-xl mb-3">Tocar Objetivos</h3>
                <p className="text-sm opacity-90">
                  Haz clic en los objetivos que aparecen
                </p>
              </button>
            </div>
          </div>
        )}

        {stage === 'testing' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">Puntuación</p>
                <p className="text-3xl font-bold text-gray-900">{score}</p>
              </div>
              <div>
                <p className="text-gray-600">Tiempo</p>
                <p className="text-3xl font-bold text-gray-900">{timeLeft}s</p>
              </div>
            </div>

            <div
              ref={containerRef}
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden"
              style={{ height: '500px' }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {mode === 'follow' && (
                <>
                  <div
                    className="absolute w-8 h-8 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                    style={{
                      left: `${targetPosition.x}%`,
                      top: `${targetPosition.y}%`
                    }}
                  />
                  <div
                    className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${userPosition.x}%`,
                      top: `${userPosition.y}%`
                    }}
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-700">
                      🔴 Objetivo • 🔵 Tu cursor
                    </p>
                  </div>
                </>
              )}

              {mode === 'tap' && targets.map((target, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTargetClick(target)}
                  className="absolute w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg transition-all hover:scale-110 flex items-center justify-center text-2xl"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`
                  }}
                >
                  🎯
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'results' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resultados
            </h2>

            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-lg mb-2">
                {mode === 'follow' ? 'Puntos de Contacto' : 'Objetivos Alcanzados'}
              </p>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {score}
              </p>
              {mode === 'follow' && (
                <p className="text-xl font-semibold text-green-600">
                  Precisión: {averageAccuracy}%
                </p>
              )}
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                {score > 50
                  ? '¡Excelente coordinación!'
                  : score > 30
                  ? 'Buena coordinación'
                  : 'Sigue practicando para mejorar'}
              </p>
            </div>

            <button
              onClick={() => setStage('intro')}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              Nueva Prueba
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
