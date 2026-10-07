import { Link } from "react-router";
import "./Landing.css";

import mainImg from "../../assets/main.jfif";
import gift from "../../assets/gift.webp";
import shirt from "../../assets/shirt.webp";
import trunk from "../../assets/trunk.webp";
import trunk2 from "../../assets/turnk 2.webp";
import wand from "../../assets/wand.webp";

const ITEMS = [
  { src: wand, name: "Wands", desc: "Wands for every duelist and dreamer." },
  {
    src: trunk,
    name: "Trunks",
    desc: "Sturdy school trunks for all your gear.",
  },
  {
    src: shirt,
    name: "House Apparel",
    desc: "Wear your house colours with pride.",
  },
  {
    src: gift,
    name: "Gifts",
    desc: "Wrapped surprises for the fan in your life.",
  },
  {
    src: trunk2,
    name: "Travel Trunks",
    desc: "Pack for the Hogwarts Express in style.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create an account",
    desc: "Sign up as a customer or as a shop owner in a minute.",
  },
  {
    n: "02",
    title: "Find your magic",
    desc: "Browse wands, trunks, apparel and gifts made for fans.",
  },
  {
    n: "03",
    title: "Order with ease",
    desc: "Pick what you love and let the owls do the rest.",
  },
];

// x / y in %, s = size, d = delay, t = float duration
const CANDLES = [
  { x: 4, y: 12, s: 1, d: 0, t: 6 },
  { x: 14, y: 26, s: 0.8, d: 1.2, t: 7 },
  { x: 24, y: 10, s: 0.9, d: 2.1, t: 5.5 },
  { x: 40, y: 8, s: 0.75, d: 1.8, t: 7.5 },
  { x: 56, y: 10, s: 1.05, d: 1, t: 8 },
  { x: 68, y: 8, s: 0.85, d: 0.3, t: 7 },
  { x: 80, y: 14, s: 1, d: 1.5, t: 6.2 },
  { x: 90, y: 10, s: 1.1, d: 0.9, t: 5.8 },
  { x: 96, y: 28, s: 0.8, d: 1.9, t: 6.8 },
  { x: 3, y: 46, s: 0.85, d: 2.8, t: 8 },
  { x: 95, y: 52, s: 0.8, d: 2.2, t: 7.1 },
  { x: 8, y: 66, s: 0.7, d: 1.3, t: 6.4 },
];

const Landing = () => {
  return (
    <main className="landing">
      <div className="landing-bg" />

      {/* ---------- Hero ---------- */}
      <section className="landing-hero">
        <div className="candle-layer" aria-hidden="true">
          {CANDLES.map((c, i) => (
            <div
              key={i}
              className="candle"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                "--s": c.s,
                animationDelay: `${c.d}s`,
                animationDuration: `${c.t}s`,
              }}
            >
              <div
                className="candle-flame"
                style={{ animationDelay: `${c.d}s` }}
              />
              <div className="candle-wick" />
              <div className="candle-stick" />
            </div>
          ))}
        </div>

        <div className="hero-grid">
          <div className="hero-text">
            <p className="sec-label">For every Harry Potter fan</p>
            <h1 className="sec-title hero-title">
              Weasleys' <em>Wizard Wheezes</em>
            </h1>
            <p className="hero-desc">
              An e-commerce platform made for Harry Potter fans. Find wands,
              trunks, house apparel and magical gifts, all in one enchanted
              place.
            </p>
            <div className="hero-actions">
              <Link to="/sign-up" className="buy-btn">
                Buy Now! <span aria-hidden="true">»</span>
              </Link>
              <a href="#shop" className="ghost-btn">
                Explore
              </a>
            </div>
          </div>

          <div className="hero-stage">
            <div className="hero-arch">
              <img src={mainImg} alt="Featured wizard" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Shop by category ---------- */}
      <section className="l-sec dim" id="shop">
        <div className="l-inner">
          <p className="sec-label">Our collection</p>
          <h2 className="sec-title">
            Shop by <em>category</em>
          </h2>
          <p className="sec-desc">
            Everything a wizard, witch or loyal fan could wish for.
          </p>
          <div className="cat-grid">
            {ITEMS.map((item) => (
              <Link to="/sign-up" className="cat-card" key={item.name}>
                <img src={item.src} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <span>Shop now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="l-sec">
        <div className="l-inner">
          <p className="sec-label">How it works</p>
          <h2 className="sec-title">
            Three steps to <em>pure magic</em>
          </h2>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="l-sec dim cta">
        <div className="l-inner">
          <p className="sec-label">Join us today</p>
          <h2 className="sec-title">
            Your next favourite thing <em>is waiting</em>
          </h2>
          <p className="sec-desc cta-desc">
            Create your free account and start exploring.
          </p>
          <Link to="/sign-up" className="buy-btn">
            Buy Now! <span aria-hidden="true">»</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Landing;
