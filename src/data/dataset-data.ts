// data/dataset-data.ts

export interface DiseaseInfo {
  name: string;
  count: number;
}

export interface CropData {
  name: string;
  totalFiles: number;
  diseases: DiseaseInfo[];
}

export const cropsData: CropData[] = [
  {
    name: "Apple",
    totalFiles: 3166,
    diseases: [
      { name: "Healthy", count: 1204 },
      { name: "Rotten", count: 614 },
      { name: "black_rot", count: 489 },
      { name: "rust", count: 357 },
      { name: "scab", count: 502 },
    ],
  },
  {
    name: "Banana",
    totalFiles: 1226,
    diseases: [
      { name: "Healthy", count: 601 },
      { name: "Rotten", count: 625 },
    ],
  },
  {
    name: "Bellpepper",
    totalFiles: 960,
    diseases: [
      { name: "Healthy", count: 478 },
      { name: "Rotten", count: 482 },
    ],
  },
  {
    name: "Carrot",
    totalFiles: 934,
    diseases: [
      { name: "Healthy", count: 484 },
      { name: "Rotten", count: 450 },
    ],
  },
  {
    name: "Cassava",
    totalFiles: 2277,
    diseases: [
      { name: "bacterial_blight", count: 445 },
      { name: "brown_streak_disease", count: 475 },
      { name: "green_mottle", count: 435 },
      { name: "healthy", count: 492 },
      { name: "mosaic_disease", count: 430 },
    ],
  },
  {
    name: "Cherry",
    totalFiles: 1088,
    diseases: [
      { name: "healthy", count: 534 },
      { name: "powdery_mildew", count: 554 },
    ],
  },
  {
    name: "Chili",
    totalFiles: 479,
    diseases: [
      { name: "healthy", count: 100 },
      { name: "leaf_curl", count: 98 },
      { name: "leaf_spot", count: 100 },
      { name: "whitefly", count: 99 },
      { name: "yellowish", count: 82 },
    ],
  },
  {
    name: "Coffee",
    totalFiles: 1046,
    diseases: [
      { name: "cercospora_leaf_spot", count: 55 },
      { name: "healthy", count: 414 },
      { name: "red_spider_mite", count: 166 },
      { name: "rust", count: 411 },
    ],
  },
  {
    name: "Corn",
    totalFiles: 3743,
    diseases: [
      { name: "Common_Rust", count: 553 },
      { name: "Gray_Leaf_Spot", count: 453 },
      { name: "Healthy", count: 566 },
      { name: "Northern_Leaf_Blight", count: 552 },
      { name: "common_rust", count: 458 },
      { name: "gray_leaf_spot", count: 309 },
      { name: "healthy", count: 424 },
      { name: "northern_leaf_blight", count: 428 },
    ],
  },
  {
    name: "Cucumber",
    totalFiles: 1647,
    diseases: [
      { name: "Rotten", count: 491 },
      { name: "diseased", count: 335 },
      { name: "healthy", count: 821 },
    ],
  },
  {
    name: "Gauva",
    totalFiles: 419,
    diseases: [
      { name: "diseased", count: 142 },
      { name: "healthy", count: 277 },
    ],
  },
  {
    name: "Grape",
    totalFiles: 2585,
    diseases: [
      { name: "Rotten", count: 200 },
      { name: "black_measles", count: 576 },
      { name: "black_rot", count: 644 },
      { name: "healthy", count: 637 },
      { name: "leaf_blight_(isariopsis_leaf_spot)", count: 528 },
    ],
  },
  {
    name: "Guava",
    totalFiles: 400,
    diseases: [
      { name: "Healthy", count: 200 },
      { name: "Rotten", count: 200 },
    ],
  },
  {
    name: "Jamun",
    totalFiles: 624,
    diseases: [
      { name: "diseased", count: 345 },
      { name: "healthy", count: 279 },
    ],
  },
  {
    name: "Jujube",
    totalFiles: 400,
    diseases: [
      { name: "Healthy", count: 200 },
      { name: "Rotten", count: 200 },
    ],
  },
  {
    name: "Lemon",
    totalFiles: 236,
    diseases: [
      { name: "diseased", count: 77 },
      { name: "healthy", count: 159 },
    ],
  },
  {
    name: "Mango",
    totalFiles: 1588,
    diseases: [
      { name: "Rotten", count: 584 },
      { name: "diseased", count: 265 },
      { name: "healthy", count: 739 },
    ],
  },
  {
    name: "Orange",
    totalFiles: 1199,
    diseases: [
      { name: "Healthy", count: 598 },
      { name: "Rotten", count: 601 },
    ],
  },
  {
    name: "Peach",
    totalFiles: 971,
    diseases: [
      { name: "bacterial_spot", count: 608 },
      { name: "healthy", count: 363 },
    ],
  },
  {
    name: "Pepper",
    totalFiles: 1151,
    diseases: [
      { name: "bell___Bacterial_spot", count: 557 },
      { name: "bell___healthy", count: 594 },
    ],
  },
  {
    name: "Pepper_bell",
    totalFiles: 865,
    diseases: [
      { name: "bacterial_spot", count: 409 },
      { name: "healthy", count: 456 },
    ],
  },
  {
    name: "Pomegranate",
    totalFiles: 959,
    diseases: [
      { name: "Healthy", count: 487 },
      { name: "Rotten", count: 200 },
      { name: "diseased", count: 272 },
    ],
  },
  {
    name: "Potato",
    totalFiles: 3432,
    diseases: [
      { name: "Early_blight", count: 807 },
      { name: "Healthy", count: 642 },
      { name: "Late_Blight", count: 793 },
      { name: "Rotten", count: 466 },
      { name: "early_blight", count: 359 },
      { name: "late_blight", count: 365 },
    ],
  },
  {
    name: "Rice",
    totalFiles: 4184,
    diseases: [
      { name: "Brown_Spot", count: 486 },
      { name: "Healthy", count: 575 },
      { name: "Leaf_Blast", count: 552 },
      { name: "Neck_Blast", count: 553 },
      { name: "brown_spot", count: 321 },
      { name: "healthy", count: 464 },
      { name: "hispa", count: 471 },
      { name: "leaf_blast", count: 377 },
      { name: "neck_blast", count: 385 },
    ],
  },
  {
    name: "Soybean",
    totalFiles: 2180,
    diseases: [
      { name: "bacterial_blight", count: 56 },
      { name: "caterpillar", count: 613 },
      { name: "diabrotica_speciosa", count: 603 },
      { name: "downy_mildew", count: 50 },
      { name: "healthy", count: 632 },
      { name: "mosaic_virus", count: 22 },
      { name: "powdery_mildew", count: 77 },
      { name: "rust", count: 65 },
      { name: "southern_blight", count: 62 },
    ],
  },
  {
    name: "Strawberry",
    totalFiles: 2115,
    diseases: [
      { name: "Rotten", count: 564 },
      { name: "healthy", count: 988 },
      { name: "leaf_scorch", count: 563 },
    ],
  },
  {
    name: "Sugarcane",
    totalFiles: 596,
    diseases: [
      { name: "Bacterial_Blight", count: 100 },
      { name: "Healthy", count: 100 },
      { name: "Red_Rot", count: 100 },
      { name: "healthy", count: 80 },
      { name: "red_rot", count: 71 },
      { name: "red_stripe", count: 53 },
      { name: "rust", count: 92 },
    ],
  },
  {
    name: "Tea",
    totalFiles: 1917,
    diseases: [
      { name: "algal_leaf", count: 339 },
      { name: "anthracnose", count: 300 },
      { name: "bird_eye_spot", count: 297 },
      { name: "brown_blight", count: 339 },
      { name: "healthy", count: 222 },
      { name: "red_leaf_spot", count: 420 },
    ],
  },
  {
    name: "Tomato",
    totalFiles: 10983,
    diseases: [
      { name: "Bacterial_spot", count: 603 },
      { name: "Early_blight", count: 547 },
      { name: "Late_blight", count: 593 },
      { name: "Leaf_Mold", count: 550 },
      { name: "Rotten", count: 488 },
      { name: "Septoria_leaf_spot", count: 600 },
      { name: "Spider_mites_Two_spotted_spider_mite", count: 589 },
      { name: "Tomato_YellowLeaf__Curl_Virus", count: 617 },
      { name: "Tomato_mosaic_virus", count: 373 },
      { name: "bacterial_spot", count: 521 },
      { name: "early_blight", count: 420 },
      { name: "healthy", count: 1539 },
      { name: "late_blight", count: 512 },
      { name: "leaf_mold", count: 399 },
      { name: "mosaic_virus", count: 174 },
      { name: "septoria_leaf_spot", count: 494 },
      { name: "spider_mites_(two_spotted_spider_mite)", count: 489 },
      { name: "target_spot", count: 909 },
      { name: "yellow_leaf_curl_virus", count: 566 },
    ],
  },
  {
    name: "Wheat",
    totalFiles: 3014,
    diseases: [
      { name: "Brown_Rust", count: 539 },
      { name: "Healthy", count: 564 },
      { name: "Yellow_Rust", count: 546 },
      { name: "brown_rust", count: 402 },
      { name: "healthy", count: 421 },
      { name: "septoria", count: 97 },
      { name: "yellow_rust", count: 445 },
    ],
  },
];