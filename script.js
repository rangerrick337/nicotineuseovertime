// Data from provided tables
const years = [1920, 1940, 1960, 1980, 2000, 2010, 2015, 2020, 2024];

const marketSales = [2.0, 5.0, 20.0, 45.0, 70.0, 80.0, 83.0, 85.0, 90.0];

const cigaretteData = [24.5, 38, 41.85, 31.5, 22.95, 18.4, 13.65, 9.9, 8.4];
const otherTobaccoData = [0.5, 2, 3.15, 3.5, 4.05, 4.14, 3.15, 2.376, 2.1];
const ecigaretteData = [0, 0, 0, 0, 0, 0.46, 3.78, 5.94, 7.35];
const nicotinePouchData = [0, 0, 0, 0, 0, 0, 0.42, 1.584, 3.15];

const marketShareData = {
    cigarettes: [98, 95, 93, 90, 85, 80, 65, 50, 40],
    otherTobacco: [2, 5, 7, 10, 15, 18, 15, 12, 10],
    ecigarettes: [0, 0, 0, 0, 0, 2, 18, 30, 35],
    nicotinePouches: [0, 0, 0, 0, 0, 0, 2, 8, 15]
};

// Chart configuration and colors
const ctx = document.getElementById('nicotineChart').getContext('2d');
const colors = {
    marketSales: '#27ae60',
    cigarettes: '#bb1008',
    otherTobacco: '#f39c12',
    ecigarettes: '#3498db',
    nicotinePouches: '#9b59b6'
};

let nicotineChart = null;
const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const createChart = (zoomedView = false) => {
    const startIndex = zoomedView ? years.indexOf(2000) : 0;
    const filteredYears = years.slice(startIndex);
    const filterData = (data) => data.slice(startIndex);

    // Calculate total population percentage for each year
    const totalPopulationPercentages = years.map((_, index) => {
        return cigaretteData[index] + otherTobaccoData[index] + ecigaretteData[index] + nicotinePouchData[index];
    });
    const filteredTotalPopPercentages = filterData(totalPopulationPercentages);

    // Function to calculate segment height based on market share
    const calculateSegmentHeight = (marketShare, totalPopPercentage) => {
        return (totalPopPercentage * marketShare) / 100;
    };

    // Create datasets - first dataset appears at the bottom of the stack
    const datasets = [
        {
            label: 'Cigarettes',
            data: filteredYears.map((year, index) => {
                const totalPop = filteredTotalPopPercentages[index];
                return (totalPop * marketShareData.cigarettes[years.indexOf(year)]) / 100;
            }),
            backgroundColor: colors.cigarettes,
            stack: 'stack1',
            borderRadius: 6,
            borderWidth: 0,
            hoverBackgroundColor: colors.cigarettes,
            hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
            hoverBorderWidth: 2
        },
        {
            label: 'Other Tobacco',
            data: filteredYears.map((year, index) => {
                const totalPop = filteredTotalPopPercentages[index];
                return (totalPop * marketShareData.otherTobacco[years.indexOf(year)]) / 100;
            }),
            backgroundColor: colors.otherTobacco,
            stack: 'stack1',
            borderRadius: 6,
            borderWidth: 0,
            hoverBackgroundColor: colors.otherTobacco,
            hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
            hoverBorderWidth: 2
        },
        {
            label: 'E-cigarettes',
            data: filteredYears.map((year, index) => {
                const totalPop = filteredTotalPopPercentages[index];
                return (totalPop * marketShareData.ecigarettes[years.indexOf(year)]) / 100;
            }),
            backgroundColor: colors.ecigarettes,
            stack: 'stack1',
            borderRadius: 6,
            borderWidth: 0,
            hoverBackgroundColor: colors.ecigarettes,
            hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
            hoverBorderWidth: 2
        },
        {
            label: 'Nicotine Pouches',
            data: filteredYears.map((year, index) => {
                const totalPop = filteredTotalPopPercentages[index];
                return (totalPop * marketShareData.nicotinePouches[years.indexOf(year)]) / 100;
            }),
            backgroundColor: colors.nicotinePouches,
            stack: 'stack1',
            borderRadius: 6,
            borderWidth: 0,
            hoverBackgroundColor: colors.nicotinePouches,
            hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
            hoverBorderWidth: 2
        },
        {
            label: 'US Market Sales',
            type: 'line',
            data: filterData(marketSales),
            borderColor: colors.marketSales,
            backgroundColor: colors.marketSales,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointStyle: 'circle',
            pointBackgroundColor: colors.marketSales,
            pointBorderWidth: 0,
            tension: 0.4,
            fill: false,
            yAxisID: 'y1',
            order: -1
        }
    ];

    // Destroy existing chart if it exists
    if (nicotineChart) {
        nicotineChart.destroy();
    }

    // Create new chart
    nicotineChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: filteredYears, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            animations: {
                colors: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
                numbers: {
                    type: 'number',
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            },
            layout: {
                padding: {
                    top: 50,
                    right: 30,
                    bottom: 15,
                    left: 20
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'US Nicotine Market Trends (1920-2024)',
                    font: {
                        family: fontFamily,
                        size: 28,
                        weight: '600'
                    },
                    color: '#2c3e50',
                    padding: { bottom: 25 }
                },
                legend: {
                    display: false // We're using custom legend
                },
                tooltip: {
                    enabled: false,
                    external: (context) => {
                        // Create tooltip div if it doesn't exist
                        let tooltipEl = document.getElementById('tooltip');
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'tooltip';
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        const tooltipModel = context.tooltip;
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Get the year index and data
                        const dataIndex = tooltipModel.dataPoints[0].dataIndex;
                        const year = filteredYears[dataIndex];
                        const yearIndex = years.indexOf(year);

                        // Create the tooltip content
                        let tooltipContent = `
                            <div class="data-row">
                                <span>Total Users: ${(cigaretteData[yearIndex] + otherTobaccoData[yearIndex] + ecigaretteData[yearIndex] + nicotinePouchData[yearIndex]).toFixed(1)}% of population</span>
                            </div>
                            <div class="data-row">
                                <span class="dot" style="background: ${colors.marketSales}"></span>
                                <span class="market-value">US Market Sales: $${marketSales[yearIndex]} billion</span>
                            </div>`;

                        // Add product data
                        if (cigaretteData[yearIndex] > 0) {
                            tooltipContent += `
                                <div class="data-row">
                                    <span class="dot" style="background: ${colors.cigarettes}"></span>
                                    <span>Cigarettes: ${marketShareData.cigarettes[yearIndex]}% market share</span>
                                </div>`;
                        }
                        if (otherTobaccoData[yearIndex] > 0) {
                            tooltipContent += `
                                <div class="data-row">
                                    <span class="dot" style="background: ${colors.otherTobacco}"></span>
                                    <span>Other Tobacco: ${marketShareData.otherTobacco[yearIndex]}% market share</span>
                                </div>`;
                        }
                        if (ecigaretteData[yearIndex] > 0) {
                            tooltipContent += `
                                <div class="data-row">
                                    <span class="dot" style="background: ${colors.ecigarettes}"></span>
                                    <span>E-cigarettes: ${marketShareData.ecigarettes[yearIndex]}% market share</span>
                                </div>`;
                        }
                        if (nicotinePouchData[yearIndex] > 0) {
                            tooltipContent += `
                                <div class="data-row">
                                    <span class="dot" style="background: ${colors.nicotinePouches}"></span>
                                    <span>Nicotine Pouches: ${marketShareData.nicotinePouches[yearIndex]}% market share</span>
                                </div>`;
                        }

                        // Set tooltip content
                        tooltipEl.innerHTML = tooltipContent;

                        // Position the tooltip
                        const position = context.chart.canvas.getBoundingClientRect();
                        const bodyFont = Chart.helpers.toFont(context.tooltip.options.bodyFont);

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        tooltipEl.style.font = bodyFont.string;
                        tooltipEl.style.transform = 'translate(-50%, -100%)';
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.03)',
                        drawBorder: false,
                        lineWidth: 1.5
                    },
                    ticks: {
                        font: {
                            family: fontFamily,
                            size: 16
                        },
                        color: '#37474F'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 50, // Set max to 50%
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: value => value + '%',
                        font: {
                            family: fontFamily,
                            size: 16,
                            weight: '500'
                        },
                        color: '#2c3e50',
                        padding: 10
                    },
                    title: {
                        display: true,
                        text: 'Percentage of US Adult Population',
                        font: {
                            family: fontFamily,
                            size: 18,
                            weight: '600'
                        },
                        color: '#2c3e50',
                        padding: { bottom: 20 }
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    max: 95, // Set max to 95 billion
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: value => '$' + value + 'B',
                        font: {
                            family: fontFamily,
                            size: 16,
                            weight: '500'
                        },
                        color: '#2c3e50',
                        padding: 10
                    },
                    title: {
                        display: true,
                        text: 'Market Sales (Billions USD)',
                        font: {
                            family: fontFamily,
                            size: 18,
                            weight: '600'
                        },
                        color: '#2c3e50',
                        padding: { bottom: 20 }
                    }
                }
            }
        }
    });

    return nicotineChart;
};

// Initialize chart and legend handlers
document.addEventListener('DOMContentLoaded', () => {
    createChart(false);

    // Add legend click handlers
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            const dataId = item.getAttribute('data-id');
            let datasetIndex;
            
            switch(dataId) {
                case 'marketSales':
                    datasetIndex = 4;
                    break;
                case 'cigarettes':
                    datasetIndex = 0;
                    break;
                case 'otherTobacco':
                    datasetIndex = 1;
                    break;
                case 'ecigarettes':
                    datasetIndex = 2;
                    break;
                case 'nicotinePouches':
                    datasetIndex = 3;
                    break;
            }

            const dataset = nicotineChart.data.datasets[datasetIndex];
            dataset.hidden = !dataset.hidden;
            item.style.opacity = dataset.hidden ? 0.5 : 1;
            nicotineChart.update();
        });
    });

    // Add zoom toggle handler
    document.getElementById('zoomToggle').addEventListener('change', (e) => {
        createChart(e.target.checked);
    });
});
