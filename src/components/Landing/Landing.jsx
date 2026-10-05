import "./Landing.css";

// Each candle: horizontal position (%), vertical position (%),
// animation delay (s) and duration (s) so they don't all float in sync.
const CANDLES = [
  { left: "8%", top: "12%", delay: "0s", duration: "6s" },
  { left: "22%", top: "6%", delay: "1.2s", duration: "7s" },
  { left: "38%", top: "15%", delay: "2.1s", duration: "5.5s" },
  { left: "55%", top: "8%", delay: "0.6s", duration: "6.5s" },
  { left: "70%", top: "18%", delay: "1.8s", duration: "7.5s" },
  { left: "85%", top: "10%", delay: "2.6s", duration: "6s" },
  { left: "15%", top: "30%", delay: "1s", duration: "8s" },
  { left: "63%", top: "28%", delay: "0.3s", duration: "7s" },
];

const Landing = () => {
  return (
    <main className="landing-hero">
      <div className="candle-layer">
        {CANDLES.map((candle, i) => (
          <div
            key={i}
            className="candle"
            style={{
              left: candle.left,
              top: candle.top,
              animationDelay: candle.delay,
              animationDuration: candle.duration,
            }}
          >
            <div className="candle-flame" />
            <div className="candle-stick" />
          </div>
        ))}
      </div>

      <div className="landing-content">
        <h1>Weasleys' Wizard Wheezes</h1>
        <p>
          Welcome, wizard. Step inside for the finest mischief Diagon Alley has
          to offer.
        </p>
        <p className="landing-sub">
          Sign up now, or sign in to see your dashboard.
        </p>
      </div>
    </main>
  );
};

export default Landing;
