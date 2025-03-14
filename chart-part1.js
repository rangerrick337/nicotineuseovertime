// Original full dataset - never modified
const ORIGINAL_DATA = {
    years: [1920, 1940, 1960, 1980, 2000, 2010, 2015, 2020, 2024],
    cigarettes: [17, 42, 44, 33, 23, 19, 15, 12.5, 10.5],
    otherCombustible: [15, 10, 6, 4, 3, 2, 2, 2, 1.5],
    smokeless: [8, 7, 6, 5, 4, 3, 3, 2.5, 2.5],
    eCigarettes: [0, 0, 0, 0, 0.05, 0.8, 3.5, 3.5, 5],
    nicotinePouches: [0, 0, 0, 0, 0, 0, 0.05, 1.5, 3.5],
    nrt: [0, 0, 0, 0, 0.5, 1.5, 1.8, 2, 2],
};

// Market Share Data - percentage of total nicotine market (normalized to years matching usage data)
const MARKET_SHARE_DATA = {
    years: [1920, 1940, 1960, 1980, 2000, 2010, 2015, 2020, 2024],
    cigarettes: [15, 50, 80, 75, 65, 55, 45, 35, 30],
    otherTobacco: [85, 50, 20, 24, 27, 20, 15, 10, 5],
    eCigarettes: [0, 0, 0, 0, 0, 5, 10, 40, 50],
    nicotinePouches: [0, 0, 0, 0, 0, 0, 0.1, 5, 10]
};

// Selected years for market share visualization (to avoid cluttering)
const MARKET_SHARE_DISPLAY_YEARS = [1920, 1960, 2000, 2024];

// Create stacked bar datasets that represent market share within population percentage
function createStackedBarDatasets() {
  // Calculate total nicotine use for each year
  const totalNicotineUse = ORIGINAL_DATA.years.map((year, yearIndex) => {
    return (
      ORIGINAL_DATA.cigarettes[yearIndex] +
      ORIGINAL_DATA.otherCombustible[yearIndex] +
      ORIGINAL_DATA.smokeless[yearIndex] +
      ORIGINAL_DATA.eCigarettes[yearIndex] +
      ORIGINAL_DATA.nicotinePouches[yearIndex] +
      ORIGINAL_DATA.nrt[yearIndex]
    );
  });

  // Calculate heights for each product type for each year
  const cigaretteHeights = ORIGINAL_DATA.years.map((year, yearIndex) => {
    const share = MARKET_SHARE_DATA.cigarettes[yearIndex] / 100;
    return totalNicotineUse[yearIndex] * share;
  });

  const otherTobaccoHeights = ORIGINAL_DATA.years.map((year, yearIndex) => {
    const share = MARKET_SHARE_DATA.otherTobacco[yearIndex] / 100;
    return totalNicotineUse[yearIndex] * share;
  });

  const eCigaretteHeights = ORIGINAL_DATA.years.map((year, yearIndex) => {
    const share = MARKET_SHARE_DATA.eCigarettes[yearIndex] / 100;
    return totalNicotineUse[yearIndex] * share;
  });

  const nicotinePouchHeights = ORIGINAL_DATA.years.map((year, yearIndex) => {
    const share = MARKET_SHARE_DATA.nicotinePouches[yearIndex] / 100;
    return totalNicotineUse[yearIndex] * share;
  });

  // Create one dataset per product type
  return [
    // Cigarettes
    {
      label: "Cigarettes",
      data: cigaretteHeights,
      backgroundColor: "rgba(231, 76, 60, 0.8)",
      borderColor: "rgb(192, 57, 43)",
      borderWidth: 1,
      stack: "stack",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
      type: "bar",
      order: 10,
    },

    // Other Tobacco (combines Other Combustible and Smokeless)
    {
      label: "Other Tobacco",
      data: otherTobaccoHeights,
      backgroundColor: "rgba(243, 156, 18, 0.8)",
      borderColor: "rgb(211, 84, 0)",
      borderWidth: 1,
      stack: "stack",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
      type: "bar",
      order: 11,
    },

    // E-cigarettes
    {
      label: "E-cigarettes",
      data: eCigaretteHeights,
      backgroundColor: "rgba(52, 152, 219, 0.8)",
      borderColor: "rgb(41, 128, 185)",
      borderWidth: 1,
      stack: "stack",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
      type: "bar",
      order: 12,
    },

    // Nicotine Pouches
    {
      label: "Nicotine Pouches",
      data: nicotinePouchHeights,
      backgroundColor: "rgba(155, 89, 182, 0.8)",
      borderColor: "rgb(142, 68, 173)",
      borderWidth: 1,
      stack: "stack",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
      type: "bar",
      order: 13,
    },
  ];
}

// Market Sales Data - in billions of dollars
const MARKET_SALES_DATA = {
    years: [1920, 1940, 1960, 1980, 2000, 2010, 2015, 2020, 2024],
    usSales: [2.0, 5.0, 20.0, 45.0, 70.0, 80.0, 83.0, 85.0, 90.0],
    worldSales: [10.0, 25.0, 75.0, 150.0, 450.0, 550.0, 657.0, 850.0, 950.0]
};

// Working copies that will be modified when zooming
let years = [...ORIGINAL_DATA.years];
const nicotineData = {
    cigarettes: [...ORIGINAL_DATA.cigarettes],
    otherCombustible: [...ORIGINAL_DATA.otherCombustible],
    smokeless: [...ORIGINAL_DATA.smokeless],
    eCigarettes: [...ORIGINAL_DATA.eCigarettes],
    nicotinePouches: [...ORIGINAL_DATA.nicotinePouches],
    nrt: [...ORIGINAL_DATA.nrt],
};

// Calculate combined data
const tobacco = years.map((year, i) =>
    nicotineData.cigarettes[i] + nicotineData.otherCombustible[i] + nicotineData.smokeless[i]
);

const nonTobacco = years.map((year, i) =>
    nicotineData.eCigarettes[i] + nicotineData.nicotinePouches[i] + nicotineData.nrt[i]
);

// Chart configuration
const ctx = document.getElementById('nicotineChart').getContext('2d');
