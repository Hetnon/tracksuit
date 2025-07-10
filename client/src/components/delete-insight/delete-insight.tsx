import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./delete-insight.module.css";

type DeleteInsightProps = ModalProps;

export const DeleteInsight = (props: DeleteInsightProps) => {
  
  const deleteInsight = async (insightId) => {
    console.log("Deleting insight with ID:", insightId);
    const response = await fetch(`/api/insights-delete/${insightId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Insight deleted successfully:");
      props.onClose?.();
      props.setInsightToDelete(null); 
      props.setInsights(prevInsights => 
        prevInsights.filter(insight => insight.id !== insightId)
      );
    } else {
      console.error("Failed to add insight:", response.statusText);
    }
  }

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Confirm Delete Insight</h1>
        <Button className={styles.submit} type="submit" label="Yes" onClick={() => deleteInsight(props.insightId)} />
        <Button className={styles.cancel} label="No" onClick={()=>{props.onClose?.(); props.setInsightToDelete(null)}} />
    </Modal>
  );
};
