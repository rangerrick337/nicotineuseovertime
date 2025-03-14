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
        return ORIGINAL_DATA.cigarettes[yearIndex] + 
               ORIGINAL_DATA.otherCombustible[yearIndex] + 
               ORIGINAL_DATA.smokeless[yearIndex] + 
               ORIGINAL_DATA.eCigarettes[yearIndex] + 
               ORIGINAL_DATA.nicotinePouches[yearIndex] + 
               ORIGINAL_DATA.nrt[yearIndex];
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
            label: 'Cigarettes',
            data: cigaretteHeights,
            backgroundColor: 'rgba(231, 76, 60, 0.8)',
            borderColor: 'rgb(192, 57, 43)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 10
        },
        
        // Other Tobacco (combines Other Combustible and Smokeless)
        {
            label: 'Other Tobacco',
            data: otherTobaccoHeights,
            backgroundColor: 'rgba(243, 156, 18, 0.8)',
            borderColor: 'rgb(211, 84, 0)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 11
        },
        
        // E-cigarettes
        {
            label: 'E-cigarettes',
            data: eCigaretteHeights,
            backgroundColor: 'rgba(52, 152, 219, 0.8)',
            borderColor: 'rgb(41, 128, 185)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 12
        },
        
        // Nicotine Pouches
        {
            label: 'Nicotine Pouches',
            data: nicotinePouchHeights,
            backgroundColor: 'rgba(155, 89, 182, 0.8)',
            borderColor: 'rgb(142, 68, 173)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 13
        }
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

// Generate stacked bar datasets
const stackedBarDatasets = createStackedBarDatasets();

// All datasets combined - now only US Market Sales as a line chart, everything else as stacked bars
const datasets = [
    // US Market Sales - keep as a line chart
    {
        label: 'US Market Sales',
        data: MARKET_SALES_DATA.usSales,
        borderColor: '#27ae60', // Distinct green for sales
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderWidth: 4,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        type: 'line',
        yAxisID: 'y1', // Use the secondary y-axis
        order: 0, // Draw on top
        group: 'market'
    },

    // Add all the stacked bar datasets
    ...stackedBarDatasets
];

// Function to calculate the maximum value for the population percentage y-axis
function calculateMaxVisibleValue() {
    let maxValue = 0;

    // Get the current visible years (for zoom support)
    const currentYears = nicotineChart.data.labels;

    // For each year in the current view
    for (let yearIndex = 0; yearIndex < currentYears.length; yearIndex++) {
        let totalForYear = 0;

        // Check each dataset that might be visible for this year
        nicotineChart.data.datasets.forEach((dataset, datasetIndex) => {
            // Skip non-bar datasets (like the sales line)
            if (dataset.type !== 'bar') return;

            // Only count visible datasets
            if (!nicotineChart.isDatasetVisible(datasetIndex)) return;

            // Add this dataset's value for the current year if it exists
            const value = dataset.data[yearIndex];
            if (value !== null && value !== undefined) {
                totalForYear += value;
            }
        });

        // Update max value if this year's total is higher
        maxValue = Math.max(maxValue, totalForYear);
    }

    // If no visible data, use a default value
    if (maxValue === 0) {
        maxValue = 10;
    } else {
        // Add some padding (10%) to the max value for better visualization
        maxValue = maxValue * 1.1;
    }

    // Round to a nice number (ceiling to nearest 5 or 10)
    if (maxValue <= 10) {
        return Math.ceil(maxValue / 5) * 5; // Round to nearest 5 for small values
    } else {
        return Math.ceil(maxValue / 10) * 10; // Round to nearest 10 for larger values
    }
}

// Function to calculate the maximum value for market sales y-axis
function calculateMaxMarketSalesValue() {
    // Find the sales dataset
    const salesDataset = nicotineChart.data.datasets.find(d => d.label === 'US Market Sales');

    // If sales dataset is not visible, return a default value
    if (!salesDataset || !nicotineChart.isDatasetVisible(nicotineChart.data.datasets.indexOf(salesDataset))) {
        return 100; // Default max value
    }

    // Calculate max from visible data
    const maxValue = Math.max(...salesDataset.data) * 1.1;
    return Math.ceil(maxValue / 20) * 20; // Round to nearest 20 for sales values
}

// Function to update all y-axis scales
function updateYAxisScales() {
    if (!nicotineChart) return;

    // Update primary y-axis (percentage of population)
    const maxPercentValue = calculateMaxVisibleValue();
    nicotineChart.options.scales.y.max = maxPercentValue;

    // Adjust step size based on the max value
    if (maxPercentValue <= 10) {
        nicotineChart.options.scales.y.ticks.stepSize = 2;
    } else if (maxPercentValue <= 30) {
        nicotineChart.options.scales.y.ticks.stepSize = 5;
    } else {
        nicotineChart.options.scales.y.ticks.stepSize = 10;
    }

    // Update secondary y-axis (market sales)
    const maxSalesValue = calculateMaxMarketSalesValue();
    nicotineChart.options.scales.y1.max = maxSalesValue;
    nicotineChart.options.scales.y1.ticks.stepSize = maxSalesValue / 5;

    // Update the chart
    nicotineChart.update();
}

// Create the chart with a small delay to ensure browser is ready
let nicotineChart;
function initChart() {
    nicotineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 5,
                    right: 20,
                    bottom: 5,
                    left: 20
                }
            },
            plugins: {
                legend: {
                    display: false, // Hide default legend, we'll use our custom one
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 12,
                    cornerRadius: 6,
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label;
                            const value = context.raw;

                            if (value === null) return null;

                            const formattedValue = typeof value === 'object' ? value.y : value;

                            // Use different formats based on the data type
                            if (label === 'US Market Sales') {
                                return `${label}: $${formattedValue} billion`;
                            } else {
                                // For stacked bars, show both the segment value and what percentage of the total it represents
                                const year = context.chart.data.labels[context.dataIndex];
                                const yearIndex = ORIGINAL_DATA.years.indexOf(year);

                                if (yearIndex !== -1) {
                                    // Get the total nicotine use for this year
                                    const totalNicotineUse = ORIGINAL_DATA.cigarettes[yearIndex] +
                                        ORIGINAL_DATA.otherCombustible[yearIndex] +
                                        ORIGINAL_DATA.smokeless[yearIndex] +
                                        ORIGINAL_DATA.eCigarettes[yearIndex] +
                                        ORIGINAL_DATA.nicotinePouches[yearIndex] +
                                        ORIGINAL_DATA.nrt[yearIndex];

                                    // Calculate what percentage of the total this segment represents
                                    let marketShare = 0;
                                    if (label === 'Cigarettes') {
                                        marketShare = MARKET_SHARE_DATA.cigarettes[yearIndex];
                                    } else if (label === 'Other Tobacco') {
                                        marketShare = MARKET_SHARE_DATA.otherTobacco[yearIndex];
                                    } else if (label === 'E-cigarettes') {
                                        marketShare = MARKET_SHARE_DATA.eCigarettes[yearIndex];
                                    } else if (label === 'Nicotine Pouches') {
                                        marketShare = MARKET_SHARE_DATA.nicotinePouches[yearIndex];
                                    }

                                    return `${label}: ${formattedValue.toFixed(1)}% of population (${marketShare}% market share)`;
                                } else {
                                    return `${label}: ${formattedValue.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: { top: 5, bottom: 2 }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    display: true,
                    alignToPixels: true,
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Percentage of US Adult Population (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: { top: 0, left: 0, right: 5, bottom: 0 }
                    },
                    min: 0,
                    suggestedMax: 60,
                    ticks: {
                        stepSize: 10,
                        callback: function (value) {
                            return value + '%';
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    stacked: true // Enable stacking for the population percentage axis
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Market Sales (Billions $)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function (value) {
                            return '$' + value;
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            elements: {
                bar: {
                    borderRadius: 6,
                    borderWidth: 1.5
                },
                point: {
                    radius: 5,
                    hoverRadius: 8,
                    borderWidth: 2
                }
            }
        }
    });
}

// Ensure chart initializes properly
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initChart, 100);
} else {
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(initChart, 100);
    });
}

// Create custom legend
function createCustomLegend() {
    const legendContainer = document.getElementById('customLegend');
    legendContainer.innerHTML = ''; // Clear existing content

    // Create a flex container for legend categories and zoom toggle
    const legendFlexContainer = document.createElement('div');
    legendFlexContainer.style.display = 'flex';
    legendFlexContainer.style.width = '100%';
    legendFlexContainer.style.justifyContent = 'space-between';
    legendFlexContainer.style.alignItems = 'flex-start';

    // Create a container for the legend categories
    const categoriesContainer = document.createElement('div');
    categoriesContainer.style.display = 'flex';
    categoriesContainer.style.gap = '20px';
    categoriesContainer.style.flexWrap = 'wrap';

    // Create zoom toggle div (now positioned to the right)
    const zoomToggleDiv = document.createElement('div');
    zoomToggleDiv.style.display = 'flex';
    zoomToggleDiv.style.alignItems = 'center';
    zoomToggleDiv.style.padding = '8px';
    zoomToggleDiv.style.backgroundColor = 'white';
    zoomToggleDiv.style.borderRadius = '8px';
    zoomToggleDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';

    const zoomLabel = document.createElement('label');
    zoomLabel.htmlFor = 'zoomToggle';
    zoomLabel.style.marginRight = '10px';
    zoomLabel.textContent = 'Zoom 2000-2024:';

    const zoomCheckbox = document.createElement('input');
    zoomCheckbox.type = 'checkbox';
    zoomCheckbox.id = 'zoomToggle';

    zoomToggleDiv.appendChild(zoomLabel);
    zoomToggleDiv.appendChild(zoomCheckbox);

    // Add the zoom toggle to the flex container (it will be on the right)
    legendFlexContainer.appendChild(categoriesContainer);
    legendFlexContainer.appendChild(zoomToggleDiv);

    // Add the flex container to the legend container
    legendContainer.appendChild(legendFlexContainer);

    // Create simplified category containers
    const categories = {
        'market': {
            title: 'Market Sales',
            items: []
        },
        'products': {
            title: 'Nicotine Products',
            items: []
        }
    };

    // Sort datasets into categories - market sales line and product bars
    // For product bars, we only want one legend item per product type
    const productTypes = new Set();

    datasets.forEach((dataset, index) => {
        if (dataset.label === 'US Market Sales') {
            categories['market'].items.push({
                dataset,
                index,
                visible: nicotineChart.isDatasetVisible(index)
            });
        } else if (!productTypes.has(dataset.label)) {
            // Only add each product type once to the legend
            productTypes.add(dataset.label);
            categories['products'].items.push({
                dataset,
                index,
                visible: nicotineChart.isDatasetVisible(index)
            });
        }
    });

    // Create legend elements for each category
    Object.values(categories).forEach(category => {
        if (category.items.length === 0) return;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'legend-category';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'legend-category-title';
        titleDiv.textContent = category.title;
        categoryDiv.appendChild(titleDiv);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'legend-items';

        category.items.forEach(item => {
            const itemDiv = createLegendItem(item);
            itemsDiv.appendChild(itemDiv);
        });

        categoryDiv.appendChild(itemsDiv);
        categoriesContainer.appendChild(categoryDiv);
    });
}

// Helper function to create a legend item
function createLegendItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'legend-item';
    if (!item.visible) {
        itemDiv.classList.add('hidden');
    }

    const colorDiv = document.createElement('div');
    colorDiv.className = 'legend-color';
    colorDiv.style.backgroundColor = item.dataset.borderColor;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'legend-label';
    labelDiv.textContent = item.dataset.label;

    itemDiv.appendChild(colorDiv);
    itemDiv.appendChild(labelDiv);

    // Store dataset index and other info as data attributes for easier access
    itemDiv.dataset.index = item.index;
    itemDiv.dataset.label = item.dataset.label;

    // Add click handler
    itemDiv.addEventListener('click', function () {
        const label = this.dataset.label;
        const index = parseInt(this.dataset.index);

        // Toggle visibility state
        const newVisibility = !nicotineChart.isDatasetVisible(index);

        if (label === 'US Market Sales') {
            // For the sales line chart, just toggle this one dataset
            nicotineChart.setDatasetVisibility(index, newVisibility);
        } else {
            // For product bars, toggle all datasets with this label
            nicotineChart.data.datasets.forEach((dataset, i) => {
                if (dataset.label === label) {
                    nicotineChart.setDatasetVisibility(i, newVisibility);
                }
            });
        }

        // Update the legend item appearance
        this.classList.toggle('hidden', !newVisibility);

        // Update the y-axis scales based on visible datasets
        updateYAxisScales();
    });

    return itemDiv;
}

// Store the original dataset visibility state
let originalDatasetVisibility = [];

// Setup zoom toggle event listener after legend is created
function setupZoomToggle() {
    const zoomToggle = document.getElementById('zoomToggle');
    if (!zoomToggle) return;

    // Remove any existing event listeners (to prevent duplicates)
    zoomToggle.removeEventListener('change', handleZoomToggle);

    // Add the event listener
    zoomToggle.addEventListener('change', handleZoomToggle);
}

// Handle zoom toggle changes
function handleZoomToggle() {
    if (this.checked) {
        // Zoom to 2000-2024
        console.log("Zooming to 2000-2024");

        // Find the index of year 2000
        const zoomStartIndex = ORIGINAL_DATA.years.indexOf(2000);
        if (zoomStartIndex === -1) {
            console.error("Year 2000 not found in data");
            return;
        }

        // Store current dataset visibility before zooming
        originalDatasetVisibility = nicotineChart.data.datasets.map((dataset, index) => {
            return nicotineChart.isDatasetVisible(index);
        });

        // Update the years array for the chart labels
        years = ORIGINAL_DATA.years.slice(zoomStartIndex);
        nicotineChart.data.labels = years;

        // Clear all datasets
        nicotineChart.data.datasets = [];

        // Add US Market Sales line chart with zoomed data
        nicotineChart.data.datasets.push({
            label: 'US Market Sales',
            data: MARKET_SALES_DATA.usSales.slice(zoomStartIndex),
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 4,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            type: 'line',
            yAxisID: 'y1',
            order: 0,
            group: 'market'
        });

        // Create zoomed stacked bar datasets
        const zoomedYears = ORIGINAL_DATA.years.slice(zoomStartIndex);
        
        // Calculate total nicotine use for each zoomed year
        const zoomedTotalNicotineUse = zoomedYears.map((year, yearIndex) => {
            const absoluteIndex = yearIndex + zoomStartIndex;
            return ORIGINAL_DATA.cigarettes[absoluteIndex] + 
                   ORIGINAL_DATA.otherCombustible[absoluteIndex] + 
                   ORIGINAL_DATA.smokeless[absoluteIndex] + 
                   ORIGINAL_DATA.eCigarettes[absoluteIndex] + 
                   ORIGINAL_DATA.nicotinePouches[absoluteIndex] + 
                   ORIGINAL_DATA.nrt[absoluteIndex];
        });
        
        // Calculate heights for each product type for each zoomed year
        const zoomedCigaretteHeights = zoomedYears.map((year, yearIndex) => {
            const absoluteIndex = yearIndex + zoomStartIndex;
            const share = MARKET_SHARE_DATA.cigarettes[absoluteIndex] / 100;
            return zoomedTotalNicotineUse[yearIndex] * share;
        });
        
        const zoomedOtherTobaccoHeights = zoomedYears.map((year, yearIndex) => {
            const absoluteIndex = yearIndex + zoomStartIndex;
            const share = MARKET_SHARE_DATA.otherTobacco[absoluteIndex] / 100;
            return zoomedTotalNicotineUse[yearIndex] * share;
        });
        
        const zoomedECigaretteHeights = zoomedYears.map((year, yearIndex) => {
            const absoluteIndex = yearIndex + zoomStartIndex;
            const share = MARKET_SHARE_DATA.eCigarettes[absoluteIndex] / 100;
            return zoomedTotalNicotineUse[yearIndex] * share;
        });
        
        const zoomedNicotinePouchHeights = zoomedYears.map((year, yearIndex) => {
            const absoluteIndex = yearIndex + zoomStartIndex;
            const share = MARKET_SHARE_DATA.nicotinePouches[absoluteIndex] / 100;
            return zoomedTotalNicotineUse[yearIndex] * share;
        });
        
        // Add stacked bar datasets for zoomed view
        nicotineChart.data.datasets.push({
            label: 'Cigarettes',
            data: zoomedCigaretteHeights,
            backgroundColor: 'rgba(231, 76, 60, 0.7)',
            borderColor: 'rgb(231, 76, 60)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 10
        });
        
        nicotineChart.data.datasets.push({
            label: 'Other Tobacco',
            data: zoomedOtherTobaccoHeights,
            backgroundColor: 'rgba(243, 156, 18, 0.7)',
            borderColor: 'rgb(243, 156, 18)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 11
        });
        
        nicotineChart.data.datasets.push({
            label: 'E-cigarettes',
            data: zoomedECigaretteHeights,
            backgroundColor: 'rgba(52, 152, 219, 0.7)',
            borderColor: 'rgb(52, 152, 219)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 12
        });
        
        nicotineChart.data.datasets.push({
            label: 'Nicotine Pouches',
            data: zoomedNicotinePouchHeights,
            backgroundColor: 'rgba(155, 89, 182, 0.7)',
            borderColor: 'rgb(155, 89, 182)',
            borderWidth: 1,
            stack: 'stack',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            type: 'bar',
            order: 13
        });
    } else {
        // Reset to original full data
        console.log("Resetting to original data");

        // Reset the years array for the chart labels
        years = [...ORIGINAL_DATA.years];
        nicotineChart.data.labels = years;

        // Recreate all datasets from scratch
        nicotineChart.data.datasets = [
            // US Market Sales line chart
            {
                label: 'US Market Sales',
                data: [...MARKET_SALES_DATA.usSales],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 4,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                type: 'line',
                yAxisID: 'y1',
                order: 0,
                group: 'market'
            },

            // Add all the stacked bar datasets
            ...createStackedBarDatasets()
        ];

        // Restore original visibility if available
        if (originalDatasetVisibility.length > 0) {
            originalDatasetVisibility.forEach((isVisible, index) => {
                if (index < nicotineChart.data.datasets.length) {
                    nicotineChart.setDatasetVisibility(index, isVisible);
                }
            });
        }
    }

    // Recreate the legend to match the new datasets
    createCustomLegend();
    setupZoomToggle();

    // Update the chart with all scales
    updateYAxisScales();
    nicotineChart.update();
}

// Initialize the custom legend after chart is ready
window.addEventListener('load', function () {
    // Allow chart to initialize
    setTimeout(function () {
        createCustomLegend();
        setupZoomToggle();
    }, 300);
});
