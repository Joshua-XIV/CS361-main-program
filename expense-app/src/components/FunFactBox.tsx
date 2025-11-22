import { useEffect, useState } from "react";
import { funFactApi } from "../api/funFactApi";

export default function FunFact() {
  const [fact, setFact] = useState("Loading...");

  const loadFact = async () => {
    try {
      const data = await funFactApi.getRandomFact();
      setFact(data.fact);
    } catch {
      setFact("Failed to load fun fact");
    }
  };

  useEffect(() => {
    loadFact();
    const interval = setInterval(loadFact, 15000);
    return () => clearInterval(interval);
  }, []);

  return <p className="text-center mb-2">{fact}</p>;
}