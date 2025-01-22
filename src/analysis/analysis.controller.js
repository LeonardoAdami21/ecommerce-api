import { AnalysisService } from "./analysis.service.js";

const findAnalysisData = async (req, res) => {
  try {
    const analysisData = await AnalysisService.getAnalysisData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySales = await AnalysisService.getDailySalesData(
      startDate,
      endDate,
    );
    return res.status(200).json({
      data: {
        analysisData,
        dailySales,
      },
      message: "Data found",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AnalysisController = { findAnalysisData };
