import { useState, useEffect } from 'react';
import { ArrowLeft, Brain } from 'lucide-react';

interface MemoryTestProps {
  onBack: () => void;
}

type TestMode = 'numbers' | 'colors' | 'sequence';

export function MemoryTest({ onBack }: MemoryTestProps) {
  const [stage, setStage] = useState<'intro' | 'showing' | 'recall' | 'results'>('intro');
  const [mode, setMode] = useState<TestMode>('numbers');
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  const colors = [
    { name: 'rojo', class: 'bg-red-500' },
    { name: 'azul', class: 'bg-blue-500' },
    { name: 'verde', class: 'bg-green-500' },
    { name: 'amarillo', class: 'bg-yellow-500' },
    { name: 'morado', class: 'bg-purple-500' },
    { name: 'naranja', class: 'bg-orange-500' }
  ];

  const generateSequence = () => {
    if (mode === 'numbers') {
      return Array.from({ length: currentLevel }, () =>
        Math.floor(Math.random() * 10).toString()
      );
    } else if (mode === 'colors') {
      return Array.from({ length: currentLevel }, () =>
        colors[Math.floor(Math.random() * colors.length)].name
      );
    } else {
      const items = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
      return Array.from({ length: currentLevel }, () =>
        items[Math.floor(Math.random() * items.length)]
      );
    }
  };

  const startTest = (selectedMode: TestMode) => {
    setMode(selectedMode);
    setCurrentLevel(3);
    setScore(0);
    setAttempts(0);
    startRound(selectedMode, 3);
  };

  const startRound = (testMode: TestMode, level: number) => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserInput([]);
    setStage('showing');

    setTimeout(() => {
      setStage('recall');
    }, 2000 + level * 500);
  };

  const handleInput = (value: string) => {
    const newInput = [...userInput, value];
    setUserInput(newInput);

    if (newInput.length === sequence.length) {
      checkAnswer(newInput);
    }
  };

  const checkAnswer = (input: string[]) => {
    const isCorrect = input.every((val, idx) => val === sequence[idx]);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      setScore(score + 1);
      if (newAttempts < maxAttempts) {
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          startRound(mode, currentLevel + 1);
        }, 1000);
      } else {
        setTimeout(() => setStage('results'), 1000);
      }
    } else {
      setTimeout(() => {
        if (newAttempts < maxAttempts) {
          startRound(mode, currentLevel);
        } else {
          setStage('results');
        }
      }, 1500);
    }
  };

  const getColorClass = (colorName: string) => {
    return colors.find(c => c.name === colorName)?.class || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
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
            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Memoria a Corto Plazo
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Selecciona el tipo de prueba de memoria
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => startTest('numbers')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3">🔢</div>
                <h3 className="font-semibold text-lg mb-2">Números</h3>
                <p className="text-sm opacity-90">Recuerda secuencias numéricas</p>
              </button>

              <button
                onClick={() => startTest('colors')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-semibold text-lg mb-2">Colores</h3>
                <p className="text-sm opacity-90">Recuerda secuencias de colores</p>
              </button>

              <button
                onClick={() => startTest('sequence')}
                className="bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-6 rounded-xl transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3">🔴</div>
                <h3 className="font-semibold text-lg mb-2">Secuencias</h3>
                <p className="text-sm opacity-90">Recuerda el orden exacto</p>
              </button>
            </div>
          </div>
        )}

        {stage === 'showing' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-600 mb-4">Nivel {currentLevel} - Memoriza la secuencia</p>
            <p className="text-gray-500 mb-8">Intento {attempts + 1} de {maxAttempts}</p>

            {mode === 'numbers' && (
              <div className="flex justify-center gap-4 flex-wrap">
                {sequence.map((num, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 bg-blue-500 text-white rounded-xl flex items-center justify-center text-3xl font-bold"
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}

            {mode === 'colors' && (
              <div className="flex justify-center gap-4 flex-wrap">
                {sequence.map((color, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-20 h-20 ${getColorClass(color)} rounded-xl mb-2`}></div>
                    <p className="text-sm text-gray-700 capitalize">{color}</p>
                  </div>
                ))}
              </div>
            )}

            {mode === 'sequence' && (
              <div className="flex justify-center gap-4 flex-wrap">
                {sequence.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-4xl"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {stage === 'recall' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-600 mb-4">Reproduce la secuencia</p>
            <p className="text-gray-500 mb-8">
              {userInput.length} de {sequence.length}
            </p>

            <div className="flex justify-center gap-4 flex-wrap mb-8">
              {userInput.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                    mode === 'colors'
                      ? getColorClass(item)
                      : 'bg-purple-500 text-white font-bold'
                  }`}
                >
                  {mode === 'colors' ? '' : item}
                </div>
              ))}
            </div>

            {mode === 'numbers' && (
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleInput(num.toString())}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl text-xl font-bold transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {mode === 'colors' && (
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleInput(color.name)}
                    className={`${color.class} hover:opacity-80 p-6 rounded-xl transition-opacity`}
                  >
                    <span className="text-white font-semibold capitalize">{color.name}</span>
                  </button>
                ))}
              </div>
            )}

            {mode === 'sequence' && (
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleInput(item)}
                    className="bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 p-6 rounded-xl text-4xl transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {stage === 'results' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resultados
            </h2>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-lg mb-2">Aciertos</p>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {score} / {maxAttempts}
              </p>
              <p className="text-xl font-semibold text-purple-600">
                {score === maxAttempts
                  ? '¡Perfecto!'
                  : score >= 3
                  ? 'Muy Bien'
                  : 'Sigue Practicando'}
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              Nivel máximo alcanzado: {currentLevel}
            </p>

            <button
              onClick={() => setStage('intro')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              Nueva Prueba
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
