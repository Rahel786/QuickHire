import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const SuccessNotification = ({ message = 'User logged in successfully!', onComplete, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
    setTimeout(() => setIsAnimating(true), 50);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (duration / 50)); // Update every 50ms
      });
    }, 50);

    // Hide after duration
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(() => onComplete(), 300); // Wait for fade out
        }
      }, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div
        className={`bg-white rounded-xl shadow-2xl border-2 border-green-500 p-6 max-w-md mx-4 transform transition-all duration-300 ease-out ${
          isAnimating
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{
          animation: isAnimating ? 'slideInUp 0.3s ease-out' : 'slideOutDown 0.3s ease-in',
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all ease-linear"
            style={{
              width: `${progress}%`,
              transitionDuration: '50ms',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes slideOutDown {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessNotification;

