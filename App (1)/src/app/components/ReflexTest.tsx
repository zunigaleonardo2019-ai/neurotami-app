import { useState, useEffect } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';

interface ReflexTestProps {
  onBack: () => void;
}

export function ReflexTest({ onBack }: ReflexTestProps) {
  const [stage, setStage] = useState<'intro' | 'waiting' | 'ready' | 'results'>('intro');
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const totalAttempts = 5;

  useEffect(() => {
    if (stage === 'waiting') {
      const delay = Math.random() * 3000 + 2000; // 2-5 segundos
      const timer = setTimeout(() => {
        setStage('ready');
        setStartTime(Date.now());
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  const startTest = () => {
    setResults([]);
    setCurrentAttempt(0);
    setStage('waiting');
  };

  const handleClick = () => {
    if (stage === 'ready') {
      const reactionTime = Date.now() - startTime;
      const newResults = [...results, reactionTime];
      setResults(newResults);

      if (currentAttempt + 1 < totalAttempts) {
        setCurrentAttempt(currentAttempt + 1);
        setStage('waiting');
      } else {
        setStage('results');
      }
    } else if (stage === 'waiting') {
      alert('¡Demasiado pronto! Espera a que la pantalla se ponga verde.');
      setStage('intro');
    }
  };

  const averageTime = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
    : 0;

  const getPerformanceRating = (avg: number) => {
    if (avg < 200) return { text: 'Excelente', color: 'text-green-600' };
    if (avg < 300) return { text: 'Muy Bueno', color: 'text-blue-600' };
    if (avg < 400) return { text: 'Bueno', color: 'text-yellow-600' };
    return { text: 'Necesita Práctica', color: 'text-orange-600' };
  };

  const rating = getPerformanceRating(averageTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8">
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
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prueba de Reflejos
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Haz clic lo más rápido posible cuando la pantalla se ponga verde.
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                • Espera a que la pantalla se ponga verde<br />
                • No hagas clic antes de tiempo<br />
                • Haz clic lo más rápido posible<br />
                • Se realizarán {totalAttempts} intentos
              </p>
            </div>
            <button
              onClick={startTest}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              Comenzar Prueba
            </button>
          </div>
        )}

        {(stage === 'waiting' || stage === 'ready') && (
          <div
            onClick={handleClick}
            className={`${
              stage === 'waiting' ? 'bg-red-500' : 'bg-green-500'
            } rounded-2xl h-[600px] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
          >
            <p className="text-white text-3xl font-bold mb-4">
              {stage === 'waiting' ? 'Espera...' : '¡HAZ CLIC AHORA!'}
            </p>
            <p className="text-white text-xl">
              Intento {currentAttempt + 1} de {totalAttempts}
            </p>
          </div>
        )}

        {stage === 'results' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Resultados
            </h2>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-6 text-center">
              <p className="text-gray-700 text-lg mb-2">Tiempo Promedio</p>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {averageTime} ms
              </p>
              <p className={`text-xl font-semibold ${rating.color}`}>
                {rating.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Tiempos Individuales:
              </h3>
              {results.map((time, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                >
                  <span className="text-gray-700">Intento {index + 1}</span>
                  <span className="font-semibold text-gray-900">{time} ms</span>
                </div>
              ))}
            </div>

            <button
              onClick={startTest}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              Repetir Prueba
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
