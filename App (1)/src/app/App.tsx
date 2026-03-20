import { useState } from 'react';
import { Brain, Zap, Eye, Target, Home } from 'lucide-react';
import { ReflexTest } from './components/ReflexTest';
import { ResponseTimeTest } from './components/ResponseTimeTest';
import { MemoryTest } from './components/MemoryTest';
import { CoordinationTest } from './components/CoordinationTest';

type TestType = 'home' | 'reflex' | 'response' | 'memory' | 'coordination';

export default function App() {
  const [currentTest, setCurrentTest] = useState<TestType>('home');

  const tests = [
    {
      id: 'reflex' as TestType,
      title: 'Prueba de Reflejos',
      description: 'Evalúa tu velocidad de reacción',
      icon: Zap,
      color: 'bg-yellow-500'
    },
    {
      id: 'response' as TestType,
      title: 'Tiempo de Respuesta',
      description: 'Mide tu tiempo de reacción',
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      id: 'memory' as TestType,
      title: 'Memoria a Corto Plazo',
      description: 'Prueba tu capacidad de recordar secuencias',
      icon: Brain,
      color: 'bg-purple-500'
    },
    {
      id: 'coordination' as TestType,
      title: 'Coordinación Motora',
      description: 'Evalúa tu coordinación ojo-mano',
      icon: Target,
      color: 'bg-green-500'
    }
  ];

  const renderTest = () => {
    switch (currentTest) {
      case 'reflex':
        return <ReflexTest onBack={() => setCurrentTest('home')} />;
      case 'response':
        return <ResponseTimeTest onBack={() => setCurrentTest('home')} />;
      case 'memory':
        return <MemoryTest onBack={() => setCurrentTest('home')} />;
      case 'coordination':
        return <CoordinationTest onBack={() => setCurrentTest('home')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Brain className="w-12 h-12 text-indigo-600" />
                  <h1 className="text-4xl font-bold text-gray-900">NeuroTa</h1>
                </div>
                <p className="text-xl text-gray-600">
                  Evaluación Neurológica Básica
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map((test) => {
                  const Icon = test.icon;
                  return (
                    <button
                      key={test.id}
                      onClick={() => setCurrentTest(test.id)}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group"
                    >
                      <div className={`w-16 h-16 ${test.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {test.title}
                      </h2>
                      <p className="text-gray-600">
                        {test.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Acerca de esta evaluación
                </h3>
                <p className="text-gray-600">
                  Esta aplicación proporciona pruebas básicas de evaluación neurológica para medir reflejos,
                  tiempo de respuesta, memoria a corto plazo y coordinación motora. Los resultados son solo
                  indicativos y no sustituyen una evaluación médica profesional.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderTest();
}
