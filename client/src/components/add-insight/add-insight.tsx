import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import { useState } from "react";

type AddInsightProps = ModalProps;

export const AddInsight = (props: AddInsightProps) => {
  const [brand, setBrand] = useState<number>(1);
  const [insightText, setInsightText] = useState<string>("");
  
  const addInsight = async () => {
    const response = await fetch("/api/insights-create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand,
        text: insightText,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Insight added successfully:", data);
      props.onClose?.();
    } else {
      console.error("Failed to add insight:", response.statusText);
    }
  }

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={()=>addInsight()}>
        <label className={styles.field}>
          <select className={styles["field-input"]} onChange ={(e) => setBrand(Number(e.target.value))} >
            {BRANDS.map(({ id, name }) => 
              <option value={id} key={id} >
                {name}
              </option>)
            }
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={insightText}
            onChange={(e) => setInsightText(e.target.value)}
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
