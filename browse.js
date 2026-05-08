import { supabase } from './dbConnection.js';

// --- 1. INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    // UI Elements ko safe tareeqe se update karna (Optional Chaining)
    const locInput = document.getElementById('main-search-loc');
    const typeInput = document.getElementById('main-search-type');
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');

    if (locInput && params.has('location')) locInput.value = params.get('location');
    if (typeInput && params.has('type')) typeInput.value = params.get('type');
    if (minInput && params.has('min')) minInput.value = params.get('min');
    if (maxInput && params.has('max')) maxInput.value = params.get('max');

    // Slider events trigger karna sirf agar elements mojood hon
    const event = new Event('input');
    minInput?.dispatchEvent(event);
    maxInput?.dispatchEvent(event);

    fetchProperties();
});

// --- 2. SEARCH EXECUTION ---
window.fetchProperties = async function() {
    const listContainer = document.getElementById('property-list');
    if (!listContainer) return; // Guard clause

    listContainer.innerHTML = '<div class="loader">Filtering Results...</div>';

    // Safe parsing aur default values
    const loc = document.getElementById('main-search-loc')?.value || "";
    const type = document.getElementById('main-search-type')?.value || "All";
    const minP = parseInt(document.getElementById('price-min')?.value || "0");
    const maxP = parseInt(document.getElementById('price-max')?.value || "1000000");

    try {
        let query = supabase
            .from('properties')
            .select('*, profiles(full_name)')
            .in('status', ['Active', 'Rented']);

        // Filters application
        if (loc.trim() !== "") {
            query = query.or(`location_city.ilike.%${loc}%,location_area.ilike.%${loc}%`);
        }
        
        if (type && type !== "All") {
            query = query.eq('property_type', type);
        }
        
        // Price Range safe filter
        query = query.gte('rent_price', minP).lte('rent_price', maxP);

        const { data: properties, error } = await query;

        if (error) throw error;
        renderCards(properties);

    } catch (err) {
        console.error("Fetch Error:", err);
        listContainer.innerHTML = `
            <div class="error-state">
                <p>Data load karne mein masla hua. Refresh karein.</p>
            </div>`;
    }
}

// --- 3. RENDERING ---
function renderCards(properties) {
    const listContainer = document.getElementById('property-list');
    if (!listContainer) return;
    
    if (!properties || properties.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc;"></i>
                <p>Koi property nahi mili. Thora price barha kar ya location change karke dekhein!</p>
            </div>`;
        return;
    }

    listContainer.innerHTML = properties.map(prop => {
        // Safe Formatting
        const price = new Intl.NumberFormat('en-PK', {
            style: 'currency', currency: 'PKR', maximumFractionDigits: 0
        }).format(prop.rent_price || 0);

        return `
            <div class="card" onclick="window.location.href='property-details.html?id=${prop.id}'">
                <div class="card-img-wrapper">
                    <img src="${prop.featured_image || 'placeholder.jpg'}" alt="${prop.title || 'Property'}">
                    <span class="badge-status ${prop.status === 'Rented' ? 'rented' : 'active'}">
                        ${prop.status === 'Rented' ? 'Rented' : 'Available'}
                    </span>
                    ${prop.is_verified ? '<span class="tag-verified"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                </div>
                <div class="card-body">
                    <h3>${prop.title || 'Untitled Property'}</h3>
                    <p class="card-price">${price}/mo</p>
                    <p class="card-loc">
                        <i class="fas fa-location-dot"></i> 
                        ${prop.location_area || 'Area'}, ${prop.location_city || 'City'}
                    </p>
                    <div class="card-footer">
                        <span><i class="fas fa-bed"></i> ${prop.bedrooms ?? 0} bed • <i class="fas fa-bath"></i> ${prop.bathrooms ?? 0} bath</span>
                        <span class="card-owner"><i class="fas fa-user"></i> ${prop.profiles?.full_name || 'Owner'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}