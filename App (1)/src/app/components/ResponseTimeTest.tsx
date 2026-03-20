import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Circle } from 'lucide-react';

interface ResponseTimeTestProps {
  onBack: () => void;
}

type Direction = 'left' | 'right' | 'up' | 'down';

export function ResponseTimeTest({ onBack }: ResponseTimeTestProps) {
  const [stage, setStage] = useState<'intro' | 'testing' | 'results'>('intro');
  const [currentDirection, setCurrentDirection] = useState<Direction>('left');
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const totalAttempts = 10;

  const directions: Direction[] = ['left', 'right', 'up', 'down'];

  const startNewAttempt = () => {
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    setCurrentDirection(randomDirection);
    setStartTime(Date.now());
  };

  const startTest = () => {
    setResults([]);
    setCurrentAttempt(0);
    setStage('testing');
    startNewAttempt();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (stage !== 'testing') return;

    const keyMap: Record<string, Direction> = {
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowUp': 'up',
      'ArrowDown': 'down'
    };

    const pressedDirection = keyMap[e.key];
    if (!pressedDirection) return;

    const responseTime = Date.now() - startTime;

    if (pressedDirection === currentDirection) {
      const newResults = [...results, responseTime];
      setResults(newResults);

      if (currentAttempt + 1 < totalAttempts) {
        setCurrentAttempt(currentAttempt + 1);
        startNewAttempt();
      } else {
        setStage('results');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage, currentDirection, startTime, results, currentAttempt]);

  const handleDirectionClick = (direction: Direction) => {
    if (stage !== 'testing') return;

    const responseTime = Date.now() - startTime;

    if (direction === currentDirection) {
      const newResults = [...results, responseTime];
      setResults(newResults);

      if (currentAttempt + 1 < totalAttempts) {
        setCurrentAttempt(currentAttempt + 1);
        startNewAttempt();
      } else {
        setStage('results');
      }
    }
  };

  const averageTime = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
    : 0;

  const getDirectionIcon = (direction: Direction) => {
    const arrows = {
      left: '←',
      right: '→',
      up: '↑',
      down: '↓'
    };
    return arrows[direction];
  };

  const getDirectionText = (direction: Direction) => {
    const texts = {
      left: 'Izquierda',
      right: 'Derecha',
      up: 'Arriba',
      down: 'Abajo'
    };
    return texts[direction];
  };

  const getPerformanceRating = (avg: number) => {
    if (avg < 250) return { text: 'Excelente', color: 'text-green-600' };
    if (avg < 350) return { text: 'Muy Bueno', color: 'text-blue-600' };
    if (avg < 500) return { text: 'Bueno', color: 'text-yellow-600' };
    return { text: 'Necesita Práctica', color: 'text-orange-600' };
  };

  const rating = getPerformanceRating(averageTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
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
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tiempo de Respuesta
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Presiona la flecha correcta lo más rápido posible según la dirección mostrada.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                • Observa la flecha que aparece en pantalla<br />
                • Presiona la tecla de flecha correspondiente<br />
                • O toca el botón en pantalla<br />
                • Se realizarán {totalAttempts} intentos
              </p>
            </div>
            <button
              onClick={startTest}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              Comenzar Prueba
            </button>
          </div>
        )}

        {stage === 'testing' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">
                Intento {currentAttempt + 1} de {totalAttempts}
              </p>
              <div className="text-8xl mb-6">
                {getDirectionIcon(currentDirection)}
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                ¡Presiona {getDirectionText(currentDirection)}!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div></div>
              <button
                onClick={() => handleDirectionClick('up')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl text-3xl transition-colors"
              >
                ↑
              </button>
              <div></div>

              <button
                onClick={() => handleDirectionClick('left')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl text-3xl transition-colors"
              >
                ←
              </button>
              <div></div>
              <button
                onClick={() => handleDirectionClick('right')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl text-3xl transition-colors"
              >
                →
              </button>

              <div></div>
              <button
                onClick={() => handleDirectionClick('down')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl text-3xl transition-colors"
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        )}

        {stage === 'results' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Resultados
            </h2>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6 mb-6 text-center">
              <p className="text-gray-700 text-lg mb-2">Tiempo Promedio de Respuesta</p>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {averageTime} ms
              </p>
              <p className={`text-xl font-semibold ${rating.color}`}>
                {rating.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {results.map((time, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                >
                  <span className="text-gray-700">#{index + 1}</span>
                  <span className="font-semibold text-gray-900">{time} ms</span>
                </div>
              ))}
            </div>

            <button
              onClick={startTest}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              Repetir Prueba
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
