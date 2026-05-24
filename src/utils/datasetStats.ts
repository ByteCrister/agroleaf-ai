// utils/datasetStats.ts
import { cropsData } from "../data/dataset-data";

export interface DatasetStats {
  totalImages: number;
  totalClasses: number;
}

export function getDatasetStats(): DatasetStats {
  let totalImages = 0;
  let totalClasses = 0;

  for (const crop of cropsData) {
    totalImages += crop.totalFiles;
    totalClasses += crop.diseases.length;
  }

  return { totalImages, totalClasses };
}

// Usage example:
// const stats = getDatasetStats();
// console.log(stats.totalImages);   // 63,941
// console.log(stats.totalClasses);  // 120
