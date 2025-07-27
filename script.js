// Global variables
let batteriesData = [];
let filteredData = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const minWhInput = document.getElementById('minWh');
const maxWhInput = document.getElementById('maxWh');
const batteryTableBody = document.getElementById('batteryTableBody');
const noResults = document.getElementById('noResults');
const capacityInput = document.getElementById('capacity');
const voltageInput = document.getElementById('voltage');
const resultSpan = document.getElementById('result');

// Load battery data
async function loadBatteryData() {
    try {
        const response = await fetch('./data/batteries.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        batteriesData = await response.json();
        filteredData = [...batteriesData];
        renderTable();
        setupEventListeners();
    } catch (error) {
        console.error('배터리 데이터를 불러오는데 실패했습니다:', error);
        showError('배터리 데이터를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter events
    searchInput.addEventListener('input', debounce(filterBatteries, 300));
    statusFilter.addEventListener('change', filterBatteries);
    minWhInput.addEventListener('input', debounce(filterBatteries, 300));
    maxWhInput.addEventListener('input', debounce(filterBatteries, 300));
    
    // Calculator events
    capacityInput.addEventListener('input', calculateWh);
    voltageInput.addEventListener('input', calculateWh);
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter batteries based on search criteria
function filterBatteries() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const statusValue = statusFilter.value;
    const minWh = parseFloat(minWhInput.value) || 0;
    const maxWh = parseFloat(maxWhInput.value) || Infinity;
    
    filteredData = batteriesData.filter(battery => {
        // Search term filter (brand, model, notes)
        const matchesSearch = !searchTerm || 
            battery.brand.toLowerCase().includes(searchTerm) ||
            battery.model.toLowerCase().includes(searchTerm) ||
            battery.notes.toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = !statusValue || battery.carry_on_status === statusValue;
        
        // Wh range filter
        const matchesWhRange = battery.capacity_wh >= minWh && battery.capacity_wh <= maxWh;
        
        return matchesSearch && matchesStatus && matchesWhRange;
    });
    
    renderTable();
}

// Render the battery table
function renderTable() {
    if (filteredData.length === 0) {
        batteryTableBody.innerHTML = '';
        noResults.style.display = 'block';
        document.querySelector('.table-container').style.display = 'none';
        renderMobileCards(); // Still render empty mobile cards container
        return;
    }
    
    noResults.style.display = 'none';
    document.querySelector('.table-container').style.display = 'block';
    
    // Sort by capacity_wh for better organization
    const sortedData = [...filteredData].sort((a, b) => a.capacity_wh - b.capacity_wh);
    
    batteryTableBody.innerHTML = sortedData.map(battery => `
        <tr>
            <td>${escapeHtml(battery.brand)}</td>
            <td>${escapeHtml(battery.model)}</td>
            <td>${battery.capacity_mah.toLocaleString()}</td>
            <td>${battery.voltage}</td>
            <td>${battery.capacity_wh}</td>
            <td><span class="status-${battery.carry_on_status}">${getStatusText(battery.carry_on_status)}</span></td>
            <td>${battery.max_quantity > 0 ? battery.max_quantity + '개' : '-'}</td>
            <td class="notes-cell">${escapeHtml(battery.notes)}</td>
        </tr>
    `).join('');
    
    // Also render mobile cards
    renderMobileCards();
}

// Render mobile card view
function renderMobileCards() {
    let mobileContainer = document.querySelector('.battery-cards');
    
    if (!mobileContainer) {
        mobileContainer = document.createElement('div');
        mobileContainer.className = 'battery-cards';
        document.querySelector('.battery-table').appendChild(mobileContainer);
    }
    
    if (filteredData.length === 0) {
        mobileContainer.innerHTML = '';
        return;
    }
    
    const sortedData = [...filteredData].sort((a, b) => a.capacity_wh - b.capacity_wh);
    
    mobileContainer.innerHTML = sortedData.map(battery => `
        <div class="battery-card">
            <h4>${escapeHtml(battery.brand)} ${escapeHtml(battery.model)}</h4>
            <div class="battery-card-row">
                <span class="battery-card-label">용량:</span>
                <span class="battery-card-value">${battery.capacity_mah.toLocaleString()} mAh</span>
            </div>
            <div class="battery-card-row">
                <span class="battery-card-label">전압:</span>
                <span class="battery-card-value">${battery.voltage} V</span>
            </div>
            <div class="battery-card-row">
                <span class="battery-card-label">전력량:</span>
                <span class="battery-card-value">${battery.capacity_wh} Wh</span>
            </div>
            <div class="battery-card-row">
                <span class="battery-card-label">반입 가능:</span>
                <span class="battery-card-value"><span class="status-${battery.carry_on_status}">${getStatusText(battery.carry_on_status)}</span></span>
            </div>
            <div class="battery-card-row">
                <span class="battery-card-label">수량 제한:</span>
                <span class="battery-card-value">${battery.max_quantity > 0 ? battery.max_quantity + '개' : '-'}</span>
            </div>
            <div class="battery-card-row">
                <span class="battery-card-label">주의사항:</span>
                <span class="battery-card-value">${escapeHtml(battery.notes)}</span>
            </div>
        </div>
    `).join('');
}

// Get status text in Korean
function getStatusText(status) {
    const statusMap = {
        'allowed': '가능',
        'conditional': '조건부',
        'forbidden': '불가'
    };
    return statusMap[status] || status;
}

// Calculate Wh from mAh and voltage
function calculateWh() {
    const capacity = parseFloat(capacityInput.value) || 0;
    const voltage = parseFloat(voltageInput.value) || 0;
    
    if (capacity > 0 && voltage > 0) {
        const wh = (capacity * voltage / 1000).toFixed(2);
        resultSpan.textContent = wh;
        
        // Add visual feedback based on Wh value
        resultSpan.className = '';
        if (wh <= 100) {
            resultSpan.style.color = 'var(--success-color)';
        } else if (wh <= 160) {
            resultSpan.style.color = 'var(--warning-color)';
        } else {
            resultSpan.style.color = 'var(--danger-color)';
        }
    } else {
        resultSpan.textContent = '0';
        resultSpan.style.color = 'var(--text-primary)';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fee2e2;
        color: #991b1b;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border: 1px solid #fecaca;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Focus search input with Ctrl+F or Cmd+F
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Clear all filters with Escape
    if (event.key === 'Escape') {
        searchInput.value = '';
        statusFilter.value = '';
        minWhInput.value = '';
        maxWhInput.value = '';
        filterBatteries();
    }
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    }
});

if (typeof PerformanceObserver !== 'undefined') {
    performanceObserver.observe({ entryTypes: ['measure'] });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('보조 배터리 기내 반입 가능 품목 앱이 시작되었습니다.');
    performance.mark('app-start');
    
    loadBatteryData().then(() => {
        performance.mark('app-loaded');
        performance.measure('app-load-time', 'app-start', 'app-loaded');
        console.log('앱 로딩이 완료되었습니다.');
    });
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterBatteries,
        calculateWh,
        getStatusText,
        escapeHtml
    };
}