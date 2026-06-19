import { useState } from "react";
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const total = good+neutral+bad, average =0

  const updateGood = () => {
    const updated = good + 1;
    setGood(updated);
  };

  const updateNeutral = () => {
    const updated = neutral + 1;
    setNeutral(updated);
  };
  const updateBad = () => {
    const updated = bad + 1;
    setBad(updated);
  };
  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={() => updateGood()}>Good</button>
      <button onClick={() => updateNeutral()}>Neutral</button>
      <button onClick={() => updateBad()}>Bad</button>
      <h1>Statistics</h1>
      <p>Good {good}</p>
      <p>Neutral {neutral}</p>
      <p>Bad {bad}</p>
      <p>Total {good+bad+neutral}</p>
      <p>Average {(good-bad)/total}</p>
      <p>Positive {(good/total)*100}%</p>
    </div>
  );
};
export default App;
