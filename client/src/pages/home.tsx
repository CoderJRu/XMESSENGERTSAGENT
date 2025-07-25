import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Rocket, 
  Code, 
  Zap, 
  Heart, 
  CheckCircle, 
  Play, 
  Github, 
  Moon, 
  Sun,
  Copy
} from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const copyCommand = () => {
    const commands = [
      "npm create vite@latest hello-world -- --template react-ts",
      "cd hello-world",
      "npm install",
      "npm run dev"
    ].join('\n');
    
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: <Code className="w-6 h-6 text-white" />,
      title: "React 18",
      description: "Latest React with concurrent features, automatic batching, and improved performance",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Code className="w-6 h-6 text-white" />,
      title: "TypeScript", 
      description: "Strong typing for better development experience and fewer runtime errors",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Vite",
      description: "Lightning-fast build tool with instant hot module replacement",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Hello World App</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">Docs</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">GitHub</a>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl text-gray-400">+</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl text-gray-400">+</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                  Hello World
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                A modern React application built with TypeScript and Vite, featuring hot module replacement and lightning-fast development experience.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <Play className="w-5 h-5 mr-2" />
                  Start Development
                </Button>
                <Button variant="outline" className="px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:border-indigo-500 hover:shadow-lg transition-all duration-200">
                  <Github className="w-5 h-5 mr-2" />
                  View Source
                </Button>
              </div>

              {/* Live Demo Section */}
              <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">localhost:5173</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
                    </div>
                  </div>
                  <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mb-6 shadow-lg">
                      <Heart className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Hello, World! 👋
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Welcome to your React + TypeScript + Vite application
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>HMR Active</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Built with Modern Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the power of modern web development with these cutting-edge technologies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Code Preview Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Clean Code Structure
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See how simple and clean your React TypeScript components can be
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-mono text-gray-300">App.tsx</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">TypeScript React</span>
                  </div>
                </div>
                <div className="p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">
{`import React from 'react'
import { useState } from 'react'

interface AppProps {
  title: string
}

function App({ title }: AppProps) {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="app">
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default App`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Get Started in Seconds
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Run these simple commands to get your development environment up and running
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Terminal</span>
                  <button 
                    onClick={copyCommand}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-white">npm create vite@latest hello-world -- --template react-ts</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-white">cd hello-world</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-white">npm install</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-white">npm run dev</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-6 py-3 rounded-lg">
                  <Rocket className="w-5 h-5" />
                  <span className="font-medium">Your app will be running at http://localhost:5173</span>
                </div>
                {copied && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Commands copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Code className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </a>
            </div>
            <p className="text-gray-400 text-center">
              Built with ❤️ using React, TypeScript, and Vite
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Hello World App. Ready for development.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
