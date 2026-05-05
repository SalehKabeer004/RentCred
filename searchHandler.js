// 1. Slider Logic (Labels ko update karne ke liye)
// function initPriceSlider() {
//     const minInput = document.getElementById('price-min');
//     const maxInput = document.getElementById('price-max');
//     const label = document.getElementById('price-label');

//     function updateLabel() {
//         let minVal = parseInt(minInput.value);
//         let maxVal = parseInt(maxInput.value);

//         // FIX: Agar Min slider Max se bada hone lage, toh usay roko
//         if (minVal > maxVal) {
//             if (this === minInput) {
//                 minInput.value = maxVal;
//                 minVal = maxVal;
//             } else {
//                 maxInput.value = minVal;
//                 maxVal = minVal;
//             }
//         }

//         label.innerText = `PKR ${minVal.toLocaleString()} - ${maxVal.toLocaleString()}`;

//         // Track ka blue portion update karne ke liye (Visual Fix)
//         // updateTrack(minVal, maxVal);
//     }

//     minInput.oninput = updateLabel;
//     maxInput.oninput = updateLabel;
// }

// // 2. Search Execute Logic
// async function handleSearch() {
//     const loc = document.getElementById('main-search-loc').value;
//     const type = document.getElementById('main-search-type').value;
//     const minPrice = document.getElementById('price-min').value;
//     const maxPrice = document.getElementById('price-max').value;

//     const queryParams = new URLSearchParams({
//         location: loc,
//         type: type,
//         min: minPrice,
//         max: maxPrice
//     });

//     // CHECK: Kya hum home page par hain?
//     if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
//         window.location.href = `browse.html?${queryParams.toString()}`;
//     } else {
//         // Agar pehle se browse page par hain, toh results update karein
//         if (typeof fetchProperties === 'function') {
//             fetchProperties(); // Browse page ka apna fetch function call karein
//         }
//     }
// }

// // Event Listeners set karna
// document.addEventListener('DOMContentLoaded', () => {
//     initPriceSlider();
//     document.getElementById('execute-search').onclick = handleSearch;

//     // Agar Browse page hai toh URL se values wapas form mein bharein
//     const params = new URLSearchParams(window.location.search);
//     if (params.has('location')) {
//         document.getElementById('main-search-loc').value = params.get('location');
//         document.getElementById('main-search-type').value = params.get('type');
//         document.getElementById('price-min').value = params.get('min');
//         document.getElementById('price-max').value = params.get('max');
//         // Label manually update karein
//         document.getElementById('price-min').dispatchEvent(new Event('input'));
//     }
// });

// 1. Slider Logic (Labels ko update karne ke liye)
function initPriceSlider() {
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    const label = document.getElementById('price-label');

    // Agar koi bhi element missing hai, to function se bahar nikal jao
    if (!minInput || !maxInput || !label) return;

    function updateLabel() {
        let minVal = parseInt(minInput.value) || 0;
        let maxVal = parseInt(maxInput.value) || 0;

        // FIX: Range overlap prevention
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
    }

    minInput.oninput = updateLabel;
    maxInput.oninput = updateLabel;
}

// 2. Search Execute Logic
async function handleSearch() {
    // Optional chaining yahan ".value" se pehle lagegi taake null check ho sake
    const loc = document.getElementById('main-search-loc')?.value || "";
    const type = document.getElementById('main-search-type')?.value || "";
    const minPrice = document.getElementById('price-min')?.value || "0";
    const maxPrice = document.getElementById('price-max')?.value || "1000000";

    const queryParams = new URLSearchParams({
        location: loc,
        type: type,
        min: minPrice,
        max: maxPrice
    });

    // Check environment
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    if (isHomePage) {
        window.location.href = `browse.html?${queryParams.toString()}`;
    } else {
        // History update karein baghair page refresh kiye
        window.history.pushState({}, '', `?${queryParams.toString()}`);
        
        // Agar browse page ka fetch function mojood hai to call karein
        if (typeof fetchProperties === 'function') {
            fetchProperties();
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initPriceSlider();
    
    // Optional chaining for event listener
    const searchBtn = document.getElementById('execute-search');
    if (searchBtn) {
        searchBtn.onclick = handleSearch;
    }

    // URL Params loading
    const params = new URLSearchParams(window.location.search);
    if (params.has('location')) {
        // Har element ko check karke value set karein
        const locField = document.getElementById('main-search-loc');
        const typeField = document.getElementById('main-search-type');
        const minField = document.getElementById('price-min');
        const maxField = document.getElementById('price-max');

        if (locField) locField.value = params.get('location');
        if (typeField) typeField.value = params.get('type');
        if (minField) minField.value = params.get('min');
        if (maxField) maxField.value = params.get('max');

        // Label update trigger karein agar slider mojood hai
        minField?.dispatchEvent(new Event('input'));
    }
});