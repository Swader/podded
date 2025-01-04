// Constants
const POD_WEIGHT_GRAMS = 3;
const POD_DIAMETER_CM = 3.5;
const POD_HEIGHT_CM = 3;
const POD_BASE_DIAMETER_CM = 2;

// Reference weights and volumes for comparisons
const COMPARISONS = {
    weights: [
        { name: "iPhone 14 Pro Max", weight: 240, emoji: "📱" },
        { name: "basketball", weight: 650, emoji: "🏀" },
        { name: "house cat", weight: 4000, emoji: "🐱" },
        { name: "microwave", weight: 12000, emoji: "📡" },
        { name: "hamster", weight: 120, emoji: "🐹" },
        { name: "pair of jeans", weight: 800, emoji: "👖" },
        { name: "laptop", weight: 2000, emoji: "💻" },
        { name: "guitar", weight: 3000, emoji: "🎸" },
        { name: "car tire", weight: 10000, emoji: "🛞" },
        { name: "standard brick", weight: 2300, emoji: "🧱" },
        { name: "bowling ball", weight: 7000, emoji: "🎳" },
        { name: "bag of flour", weight: 1000, emoji: "🌾" },
        { name: "bicycle", weight: 15000, emoji: "🚲" },
        { name: "medium-sized dog", weight: 25000, emoji: "🐕" },
        { name: "office chair", weight: 13000, emoji: "💺" },
        { name: "mini fridge", weight: 20000, emoji: "❄️" },
        { name: "acoustic guitar", weight: 2500, emoji: "🎸" },
        { name: "car battery", weight: 18000, emoji: "🔋" },
        { name: "beach umbrella", weight: 3500, emoji: "⛱️" }
    ],
    volumes: [
        { name: "coffee cup", volume: 250, emoji: "☕" },
        { name: "shoebox", volume: 5000, emoji: "👟" },
        { name: "carry-on suitcase", volume: 40000, emoji: "🧳" },
        { name: "bathtub", volume: 200000, emoji: "🛁" },
        { name: "water bottle", volume: 500, emoji: "🍶" },
        { name: "basketball", volume: 7300, emoji: "🏀" },
        { name: "microwave oven", volume: 25000, emoji: "📡" },
        { name: "filing cabinet drawer", volume: 30000, emoji: "🗄️" },
        { name: "kitchen sink", volume: 35000, emoji: "🚰" },
        { name: "mini fridge", volume: 100000, emoji: "❄️" },
        { name: "washing machine drum", volume: 60000, emoji: "🧺" },
        { name: "recycling bin", volume: 120000, emoji: "♻️" },
        { name: "office desk", volume: 180000, emoji: "🪑" },
        { name: "standard mailbox", volume: 15000, emoji: "📫" },
        { name: "guitar case", volume: 20000, emoji: "🎸" },
        { name: "beach cooler", volume: 45000, emoji: "🏖️" },
        { name: "storage tote", volume: 50000, emoji: "📦" },
        { name: "trash can", volume: 75000, emoji: "🗑️" },
        { name: "garden wheelbarrow", volume: 90000, emoji: "🌱" }
    ]
};

// Calculate pod volume (cone frustum formula)
function calculatePodVolume() {
    const r1 = POD_DIAMETER_CM / 2;
    const r2 = POD_BASE_DIAMETER_CM / 2;
    const h = POD_HEIGHT_CM;
    return (Math.PI * h / 3) * (r1*r1 + r2*r2 + r1*r2);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(1);
}

function getRandomComparisons(amount, items, count = 2) {
    // Filter items that are appropriate for the amount
    const appropriateItems = items.filter(item => {
        const value = item.weight || item.volume;
        return amount >= value * 0.1 && amount <= value * 100;
    });
    
    if (appropriateItems.length === 0) return [items[0]];
    
    // Shuffle and take first 2 items
    return appropriateItems
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}

function generateComparisonMessage(amount, comparison, type = 'weight') {
    const value = comparison[type] || comparison.volume;
    const ratio = (amount / value).toFixed(1);
    const plural = ratio === "1.0" ? "" : "s";
    return `${ratio} ${comparison.emoji} ${comparison.name}${plural}`;
}

function updateCalculations() {
    const podsPerDay = parseInt(document.getElementById('pods-per-day').value);
    document.getElementById('pods-value').textContent = podsPerDay;

    // Calculate weights
    const gramsPerDay = podsPerDay * POD_WEIGHT_GRAMS;
    const gramsPerMonth = gramsPerDay * 30;
    const gramsPerYear = gramsPerDay * 365;

    // Calculate volumes
    const volumePerPod = calculatePodVolume();
    const volumePerYear = volumePerPod * podsPerDay * 365;

    // Get random comparisons
    const weightComparisons = getRandomComparisons(gramsPerYear, COMPARISONS.weights);
    const volumeComparisons = getRandomComparisons(volumePerYear, COMPARISONS.volumes);

    // Generate message
    const yearlyWeightKg = gramsPerYear / 1000;
    
    const weightMessages = weightComparisons
        .map(comp => generateComparisonMessage(gramsPerYear, comp, 'weight'))
        .join(' or ');
    
    const volumeMessages = volumeComparisons
        .map(comp => generateComparisonMessage(volumePerYear, comp, 'volume'))
        .join(' or ');
    
    const message = `
        You're adding ${formatNumber(gramsPerMonth)}g of plastic per month, or ${formatNumber(yearlyWeightKg)}kg per year.
        That's equivalent to ${weightMessages}!
        
        Over a year, these pods would take up ${formatNumber(volumePerYear)}cm³ in a landfill - 
        that's about the same as ${volumeMessages}!
    `;

    document.getElementById('results').innerHTML = message.split('\n').map(line => 
        `<p>${line.trim()}</p>`
    ).join('');
}

// Event listeners
document.getElementById('pods-per-day').addEventListener('input', updateCalculations);

// Initial calculation
updateCalculations(); 