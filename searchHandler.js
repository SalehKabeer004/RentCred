// 1. Slider Logic (Labels ko update karne ke liye)
function initPriceSlider() {
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    const label = document.getElementById('price-label');

    // function updateLabel() {
    //     let min = parseInt(minInput.value);
    //     let max = parseInt(maxInput.value);

    //     // Gap maintain karna
    //     if (max - min < 20000) {
    //         if (this === minInput) minInput.value = max - 20000;
    //         else maxInput.value = min + 20000;
    //     }

    //     label.innerText = `PKR ${min.toLocaleString()} - ${max >= 500000 ? '500k+' : max.toLocaleString()}`;
    // }
    function updateLabel() {
        let minVal = parseInt(minInput.value);
        let maxVal = parseInt(maxInput.value);

        // FIX: Agar Min slider Max se bada hone lage, toh usay roko
        if (minVal > maxVal) {
            if (this === minInput) {
                minInput.value = maxVal;
                minVal = maxVal;
            } else {
                maxInput.value = minVal;
                maxVal = minVal;
            }
        }

        label.innerText = `PKR ${minVal.toLocaleString()} - ${maxVal.toLocaleString()}`;

        // Track ka blue portion update karne ke liye (Visual Fix)
        updateTrack(minVal, maxVal);
    }

    minInput.oninput = updateLabel;
    maxInput.oninput = updateLabel;
}

// 2. Search Execute Logic
async function handleSearch() {
    const loc = document.getElementById('main-search-loc').value;
    const type = document.getElementById('main-search-type').value;
    const minPrice = document.getElementById('price-min').value;
    const maxPrice = document.getElementById('price-max').value;

    const queryParams = new URLSearchParams({
        location: loc,
        type: type,
        min: minPrice,
        max: maxPrice
    });

    // CHECK: Kya hum home page par hain?
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.href = `browse.html?${queryParams.toString()}`;
    } else {
        // Agar pehle se browse page par hain, toh results update karein
        if (typeof fetchProperties === 'function') {
            fetchProperties(); // Browse page ka apna fetch function call karein
        }
    }
}

// Event Listeners set karna
document.addEventListener('DOMContentLoaded', () => {
    initPriceSlider();
    document.getElementById('execute-search').onclick = handleSearch;

    // Agar Browse page hai toh URL se values wapas form mein bharein
    const params = new URLSearchParams(window.location.search);
    if (params.has('location')) {
        document.getElementById('main-search-loc').value = params.get('location');
        document.getElementById('main-search-type').value = params.get('type');
        document.getElementById('price-min').value = params.get('min');
        document.getElementById('price-max').value = params.get('max');
        // Label manually update karein
        document.getElementById('price-min').dispatchEvent(new Event('input'));
    }
});