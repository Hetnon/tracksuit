import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { InsightType } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<InsightType>([]);

  useEffect(() => {
    getInsights();
  }, []);

  const getInsights = async () => {
    try {
      const response = await fetch("/api/insights-list");
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} setInsights={setInsights} />
    </main>
  );
};
