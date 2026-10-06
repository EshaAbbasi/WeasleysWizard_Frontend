import "./CategoryBar.css";

const CategoryBar = ({ categories, active, onChange }) => (
  <div className="cat-bar">
    {["All", ...categories].map((c) => (
      <button
        key={c}
        className={"cat-chip" + (active === c ? " on" : "")}
        onClick={() => onChange(c)}
      >
        {c}
      </button>
    ))}
  </div>
);

export default CategoryBar;
