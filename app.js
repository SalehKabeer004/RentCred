
import { supabase } from './dbConnection.js';


try {
    const featuredProperties = supabase
        .from('properties')
        .select('*, profiles(full_name)')
        .in('status', ['Active', 'Rented'])
        .order('created_at', { ascending: false }) // Latest properties pehle aayengi
        .limit(3); // Sirf top 3 records mangwayein

    const { data: properties, error } = await featuredProperties;

    if (error) throw error;
    renderFeaturedCards(properties);
    
} catch (err) {
    alert("Featured properties load karne mein masla hua. Refresh karein.");
    console.error("Featured Fetch Error:", err);
}


function renderFeaturedCards(properties) {
    const listContainer = document.getElementById('featured-property-list');
    if (!listContainer) return;
    
    if (!properties || properties.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <p>Not any featured properties available.</p>
            </div>`;
        return;
    }

    listContainer.innerHTML = properties.map(prop => {
       
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