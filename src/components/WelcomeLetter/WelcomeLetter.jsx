import { useEffect, useState } from "react";
import owl from "../../assets/owl.jfif";
import "./WelcomeLetter.css";

const WelcomeLetter = ({ username, onDone }) => {
  const [stage, setStage] = useState("fly"); // fly -> open -> close

  useEffect(() => {
    const t1 = setTimeout(() => setStage("open"), 1800);
    const t2 = setTimeout(() => setStage("close"), 5000);
    const t3 = setTimeout(() => onDone(), 6200);
    return () => [t1, t2, t3].forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`wl-overlay wl-${stage}`}>
      <img className="wl-owl" src={owl} alt="" />

      <div className="wl-envelope">
        <div className="wl-letter">
          <h2>Welcome,</h2>
          <p className="wl-name">{username}!</p>
        </div>
        <div className="wl-front" />
        <div className="wl-flap" />
      </div>
    </div>
  );
};

export default WelcomeLetter;
