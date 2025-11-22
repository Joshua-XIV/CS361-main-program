const API_URL = import.meta.env.VITE_REPORT_API_URL || "http://localhost:5005";

export type ReportFormat = "csv" | "pdf" | "xlsx";

export interface GenerateReportRequest {
  user_id: number;
  transactions: any[]; // transaction objects, can type more strictly if needed
  start?: string; // optional start date "YYYY-MM-DD"
  end?: string;   // optional end date "YYYY-MM-DD"
  fmt?: ReportFormat;
}

export const reportApi = {
  generateReport: async (data: GenerateReportRequest): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/report/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || "Failed to generate report");
      }

      // Get filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename = "report." + (data.fmt || "csv");

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Report API error:", err);
      throw err;
    }
  },
};
