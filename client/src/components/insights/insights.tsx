import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { BRANDS } from "../../lib/consts.ts";
import { DeleteInsight } from "../delete-insight/delete-insight.tsx";
import { useState } from "react";

type InsightsProps = {
  insights: Insight[];
  className?: string;
};

export const Insights = ({ insights, className, setInsights }: InsightsProps) => {
  const [deleteInsightOpen, setDeleteInsightOpen] = useState(false);
  const [insightToDelete, setInsightToDelete] = useState<number | null>(null);
  

  const findBrandName = (brandId: number) => {
    const brand = BRANDS.find((b) => b.id === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  const writeDate = (date: string) :string => {
    const d = new Date(date);
    const dateFormat = d.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return dateFormat;
  };



  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{findBrandName(brand)}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{writeDate(createdAt)}</span> {/* format date as needed */}
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => {setDeleteInsightOpen(true); setInsightToDelete(id);}}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
      <DeleteInsight
        open={deleteInsightOpen}
        onClose={() => setDeleteInsightOpen(false)}
        insightId={insightToDelete}
        setInsightToDelete={setInsightToDelete}
        setInsights={setInsights} 
      />
    </div>
  );
};
