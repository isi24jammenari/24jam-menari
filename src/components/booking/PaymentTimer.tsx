"use client";

import { useEffect, useState } from "react";

interface PaymentTimerProps {
  expiryTimestamp: number;
  onExpire: () => void;
}

export default function PaymentTimer({
  expiryTimestamp,
  onExpire,
}: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasCalled, setHasCalled] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, expiryTimestamp - Date.now());
      setTimeLeft(diff);
      if (diff === 0 && !hasCalled) {
        setHasCalled(true);
        onExpire();
      }
    };
    calc();
    const interval = setInterval(calc, 500);
    return () => clearInterval(interval);
  }, [expiryTimestamp, onExpire, hasCalled]);

  const totalSeconds = 15 * 60;
  const secondsLeft = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = (secondsLeft / totalSeconds) * 100;

  const isWarning = secondsLeft <= 300; // 5 menit
  const isDanger = secondsLeft <= 60;   // 1 menit

  // REFAKTOR: Menggunakan CSS Variables / Tailwind Semantic Colors alih-alih Hex hardcode
  const strokeColor = isDanger
    ? "var(--destructive)"
    : isWarning
    ? "var(--accent)"
    : "var(--primary)";

  // SVG circle arc
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Lingkaran timer */}
      <div className="relative w-36 h-36">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          {/* Track (Menggunakan warna border dari globals.css) */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease" }}
          />
        </svg>

        {/* Teks di tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: strokeColor }}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">tersisa</span>
        </div>
      </div>

      {/* Label status */}
      <p
        className="text-sm font-medium text-center"
        style={{ color: strokeColor }}
      >
        {isDanger
          ? "⚠️ Segera selesaikan pembayaran!"
          : isWarning
          ? "⏳ Waktu hampir habis"
          : "Selesaikan pembayaran sebelum waktu habis"}
      </p>
    </div>
  );
}