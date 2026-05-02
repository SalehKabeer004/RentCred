import { supabase } from './dbConnection.js';

// --- 1. INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // URL se data uthana (Home page se redirect hone ke baad)
    const params = new URLSearchParams(window.location.search);
    
    // UI ko URL ke mutabiq update karna
    if (params.has('location')) document.getElementById('main-search-loc').value = params.get('location');
    if (params.has('type')) document.getElementById('main-search-type').value = params.get('type');
    if (params.has('min')) document.getElementById('price-min').value = params.get('min');
    if (params.has('max')) document.getElementById('price-max').value = params.get('max');

    // Slider ke labels update karna (jo humne searchHandler mein banaya tha)
    const event = new Event('input');
    document.getElementById('price-min').dispatchEvent(event);
    document.getElementById('price-max').dispatchEvent(event);

    // Pehli baar data load karna
    fetchProperties();
});

// --- 2. SEARCH EXECUTION ---
// Ye function searchHandler.js ke button click par call hoga
window.fetchProperties = async function() {
    const listContainer = document.getElementById('property-list'); // Cards ka container
    listContainer.innerHTML = '<div class="loader">Filtering Results...</div>';

    // Inputs se fresh data lena
    const loc = document.getElementById('main-search-loc').value;
    const type = document.getElementById('main-search-type').value;
    const minP = parseInt(document.getElementById('price-min').value);
    const maxP = parseInt(document.getElementById('price-max').value);

    // Supabase Query build karna
    let query = supabase
        .from('properties')
        .select('*, profiles(full_name)') // Owner name join
        .eq('status', 'Active');

    // Filters apply karna
    if (loc) {
        // City ya Area dono mein search karega
        query = query.or(`location_city.ilike.%${loc}%,location_area.ilike.%${loc}%`);
    }
    if (type && type !== "All") {
        query = query.eq('property_type', type);
    }
    
    // Price Range Filter (Crucial part)
    query = query.gte('rent_price', minP).lte('rent_price', maxP);

    const { data: properties, error } = await query;

    if (error) {
        console.error("Fetch Error:", error);
        listContainer.innerHTML = "<p>Kuch galat hogaya. Dobara koshish karein.</p>";
        return;
    }

    renderCards(properties);
}

// --- 3. RENDERING (Aapka Card Layout) ---
function renderCards(properties) {
    const listContainer = document.getElementById('property-list');
    
    if (!properties || properties.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Koi property nahi mili. Thora price barha kar ya location change karke dekhein!</p>
            </div>`;
        return;
    }

    listContainer.innerHTML = properties.map(prop => {
        // Price Formatting (PKR 25,000)
        const price = new Intl.NumberFormat('en-PK', {
            style: 'currency', currency: 'PKR', maximumFractionDigits: 0
        }).format(prop.rent_price);

        return `
            <div class="card" onclick="window.location.href='property-details.html?id=${prop.id}'">
                <div class="card-img-wrapper">
                    <img src="${prop.featured_image || 'placeholder.jpg'}" alt="Property">
                    <span class="tag-score">Score: ${prop.trust_score || 85}%</span>
                    ${prop.is_verified ? '<span class="tag-verified"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                </div>
                <div class="card-body">
                    <h3>${prop.title}</h3>
                    <p class="card-price">${price}/mo</p>
                    <p class="card-loc"><i class="fas fa-location-dot"></i> ${prop.location_area}, ${prop.location_city}</p>
                    <div class="card-footer">
                        <span><i class="fas fa-bed"></i> ${prop.bedrooms} bed • ${prop.bathrooms} bath</span>
                        <span class="card-owner"><i class="fas fa-user"></i> ${prop.profiles?.full_name || 'Owner'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}