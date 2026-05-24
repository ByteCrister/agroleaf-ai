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
      { name: "Healthy", count: 613 },
      { name: "Healthy Leaf", count: 591 },
      { name: "Rotten", count: 614 },
      { name: "Black Rot", count: 489 },
      { name: "Rust", count: 357 },
      { name: "Scab", count: 502 },
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
      { name: "Bacterial Blight", count: 445 },
      { name: "Brown Streak Disease", count: 475 },
      { name: "Green Mottle", count: 435 },
      { name: "Healthy Leaf", count: 492 },
      { name: "Mosaic Disease", count: 430 },
    ],
  },
  {
    name: "Cherry",
    totalFiles: 1086,
    diseases: [
      { name: "Healthy Leaf", count: 532 },
      { name: "Powdery Mildew", count: 554 },
    ],
  },
  {
    name: "Chili",
    totalFiles: 3016,
    diseases: [
      { name: "Healthy", count: 698 },
      { name: "Leaf Curl", count: 596 },
      { name: "Leaf Spot", count: 600 },
      { name: "Whitefly", count: 581 },
      { name: "Yellowish", count: 541 },
    ],
  },
  {
    name: "Coffee",
    totalFiles: 1834,
    diseases: [
      { name: "Cercospora Leaf Spot", count: 458 },
      { name: "Healthy Leaf", count: 414 },
      { name: "Red Spider Mite", count: 551 },
      { name: "Rust", count: 411 },
    ],
  },
  {
    name: "Corn",
    totalFiles: 3434,
    diseases: [
      { name: "Common Rust", count: 910 },
      { name: "Gray Leaf Spot", count: 656 },
      { name: "Healthy Leaf", count: 1008 },
      { name: "Northern Leaf Blight", count: 860 },
    ],
  },
  {
    name: "Cucumber",
    totalFiles: 6400,
    diseases: [
      { name: "Anthracnose", count: 800 },
      { name: "Bacterial Wilt", count: 800 },
      { name: "Belly Rot", count: 800 },
      { name: "Downy Mildew", count: 800 },
      { name: "Fresh Leaf", count: 800 },
      { name: "Fresh Vegetable", count: 800 },
      { name: "Gummy Stem Blight", count: 800 },
      { name: "Pythium Fruit Rot", count: 800 },
    ],
  },
  {
    name: "Gauva",
    totalFiles: 419,
    diseases: [
      { name: "Diseased", count: 142 },
      { name: "Healthy Leaf", count: 277 },
    ],
  },
  {
    name: "Grape",
    totalFiles: 2585,
    diseases: [
      { name: "Rotten", count: 200 },
      { name: "Black Measles", count: 576 },
      { name: "Black Rot", count: 644 },
      { name: "Healthy", count: 200 },
      { name: "Healthy Leaf", count: 437 },
      { name: "Isariopsis Leaf Spot", count: 528 },
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
      { name: "Diseased", count: 345 },
      { name: "Healthy Leaf", count: 279 },
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
      { name: "Diseased", count: 77 },
      { name: "Healthy Leaf", count: 159 },
    ],
  },
  {
    name: "Mango",
    totalFiles: 1588,
    diseases: [
      { name: "Rotten", count: 584 },
      { name: "Diseased", count: 265 },
      { name: "Healthy", count: 569 },
      { name: "Healthy Leaf", count: 170 },
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
      { name: "Bacterial Spot", count: 608 },
      { name: "Healthy Leaf", count: 363 },
    ],
  },
  {
    name: "Pepper",
    totalFiles: 837,
    diseases: [{ name: "Bacterial Spot", count: 837 }],
  },
  {
    name: "Pepper_bell",
    totalFiles: 945,
    diseases: [{ name: "Healthy Leaf", count: 945 }],
  },
  {
    name: "Pomegranate",
    totalFiles: 959,
    diseases: [
      { name: "Healthy", count: 200 },
      { name: "Healthy Leaf", count: 287 },
      { name: "Rotten", count: 200 },
      { name: "Diseased", count: 272 },
    ],
  },
  {
    name: "Potato",
    totalFiles: 3012,
    diseases: [
      { name: "Early Blight", count: 961 },
      { name: "Healthy", count: 490 },
      { name: "Healthy Leaf", count: 152 },
      { name: "Late Blight", count: 943 },
      { name: "Rotten", count: 466 },
    ],
  },
  {
    name: "Rice",
    totalFiles: 4607,
    diseases: [
      { name: "Brown Spot", count: 888 },
      { name: "Healthy Leaf", count: 1121 },
      { name: "Hispa", count: 696 },
      { name: "Leaf Blast", count: 1102 },
      { name: "Neck Blast", count: 800 },
    ],
  },
  {
    name: "Soybean",
    totalFiles: 2180,
    diseases: [
      { name: "Bacterial Blight", count: 56 },
      { name: "Caterpillar", count: 613 },
      { name: "Diabrotica Speciosa", count: 603 },
      { name: "Downy Mildew", count: 50 },
      { name: "Healthy Leaf", count: 632 },
      { name: "Mosaic Virus", count: 22 },
      { name: "Powdery Mildew", count: 77 },
      { name: "Rust", count: 65 },
      { name: "Southern Blight", count: 62 },
    ],
  },
  {
    name: "Strawberry",
    totalFiles: 2115,
    diseases: [
      { name: "Rotten", count: 564 },
      { name: "Healthy", count: 558 },
      { name: "Healthy Leaf", count: 430 },
      { name: "Leaf Scorch", count: 563 },
    ],
  },
  {
    name: "Sugarcane",
    totalFiles: 596,
    diseases: [
      { name: "Bacterial Blight", count: 100 },
      { name: "Healthy Leaf", count: 180 },
      { name: "Red Rot", count: 171 },
      { name: "Red Stripe", count: 53 },
      { name: "Rust", count: 92 },
    ],
  },
  {
    name: "Tea",
    totalFiles: 1917,
    diseases: [
      { name: "Algal Leaf", count: 339 },
      { name: "Anthracnose", count: 300 },
      { name: "Bird Eye Spot", count: 297 },
      { name: "Brown Blight", count: 339 },
      { name: "Healthy", count: 222 },
      { name: "Red Leaf Spot", count: 420 },
    ],
  },
  {
    name: "Tomato",
    totalFiles: 9955,
    diseases: [
      { name: "Bacterial Spot", count: 1038 },
      { name: "Early Blight", count: 802 },
      { name: "Healthy", count: 480 },
      { name: "Healthy Leaf", count: 961 },
      { name: "Late Blight", count: 1012 },
      { name: "Leaf Mold", count: 794 },
      { name: "Rotten", count: 488 },
      { name: "Septoria Leaf Spot", count: 990 },
      { name: "Spider Mites (Two-spotted Spider Mite)", count: 980 },
      { name: "Target Spot", count: 909 },
      { name: "Tomato Yellow Leaf Curl Virus", count: 1119 },
      { name: "Tomato Mosaic Virus", count: 382 },
    ],
  },
  {
    name: "Wheat",
    totalFiles: 4063,
    diseases: [
      { name: "Brown Rust", count: 1256 },
      { name: "Healthy Leaf", count: 966 },
      { name: "Yellow Rust", count: 1395 },
      { name: "Septoria", count: 446 },
    ],
  },
];