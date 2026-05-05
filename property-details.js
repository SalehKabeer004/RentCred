import { supabase } from './dbConnection.js';

async function loadPropertyDetails() {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get('id');

    if (!propId) {
        window.location.href = 'browse.html';
        return;
    }

    // Database fetching
    const { data: prop, error } = await supabase
        .from('properties')
        .select('*, profiles(full_name)')
        .eq('id', propId)
        .single();

    if (error || !prop) {
        console.error("Error or Property Not Found:", error);
        document.body.innerHTML = "<h1 style='text-align:center; margin-top:50px;'>Property Not Found</h1>";
        return;
    }

    // --- 1. GALLERY & IMAGES ---
    const mainImg = document.getElementById('main-img');
    mainImg.src = prop.featured_image || 'assets/placeholder-img.jpg';

    // Badge updates
    const photoBadge = document.querySelector('.badge-tag');
    const totalPhotos = (prop.images_urls?.length || 0) + 1;
    photoBadge.innerHTML = `<i class="fas fa-camera"></i> ${totalPhotos} Photos`;

    const statusBadge = document.querySelector('.badge-status');
    statusBadge.innerText = prop.status || 'Status Not Found';
    statusBadge.className = `badge-status ${prop.status?.toLowerCase() || 'unknown'}`;

    // Thumbnails rendering
    const thumbStrip = document.querySelector('.thumb-strip');
    if (thumbStrip) {
        thumbStrip.innerHTML = `<img src="${prop.featured_image}" alt="thumb" class="thumb active" onclick="setPhoto(this,'${prop.featured_image}')">`;
        if (prop.images_urls && Array.isArray(prop.images_urls)) {
            prop.images_urls.forEach(url => {
                thumbStrip.innerHTML += `<img src="${url}" alt="thumb" class="thumb" onclick="setPhoto(this,'${url}')">`;
            });
        }
    }

    // --- 2. TITLE & META CHIPS ---
    document.querySelector('.prop-title').innerText = prop.title || "Title Not Found";
    document.querySelector('.prop-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${prop.location_area || 'Area Not Found'}, ${prop.location_city || 'City Not Found'}`;

    const chips = document.querySelectorAll('.meta-chips .chip');
    chips[0].innerHTML = `<i class="fas fa-bed"></i> ${prop.bedrooms ?? 'N/A'} Bedrooms`;
    chips[1].innerHTML = `<i class="fas fa-bath"></i> ${prop.bathrooms ?? 'N/A'} Bathrooms`;
    chips[2].innerHTML = `<i class="fas fa-vector-square"></i> ${prop.area_sqft?.toLocaleString() ?? 'N/A'} sq ft`;
    chips[3].innerHTML = `<i class="fas fa-building"></i> ${prop.floor_number ?? 'N/A'} Floor`;
    chips[4].innerHTML = `<i class="fas fa-car"></i> ${prop.has_parking ? 'Parking Available' : 'No Parking'}`;

    // --- 3. DESCRIPTION ---
    const descParas = document.querySelectorAll('.desc-text');
    descParas[0].innerText = prop.description || "Detailed description not found for this property.";
    descParas[1].innerText = ""; // Extra space or secondary description if needed

    // --- 4. AMENITIES ---
    const amenGrid = document.querySelector('.amenities-grid');
    if (amenGrid) {
        amenGrid.innerHTML = '';
        if (prop.amenities && prop.amenities.length > 0) {
            prop.amenities.forEach(amen => {
                amenGrid.innerHTML += `
                    <div class="amenity-item">
                        <i class="fas fa-check-circle"></i>
                        <span>${amen}</span>
                    </div>`;
            });
        } else {
            amenGrid.innerHTML = '<p>No amenities listed.</p>';
        }
    }

    // --- 5. PRICE CARD (Right Column) ---
    document.querySelector('.price-amount').innerText = prop.rent_price ? `PKR ${prop.rent_price.toLocaleString()}` : "Price Not Found";
    document.querySelector('.price-deposit').innerText = prop.security_deposit ? `Deposit: PKR ${prop.security_deposit.toLocaleString()}` : "Deposit: N/A";

    const availItems = document.querySelectorAll('.avail-item span');
    availItems[0].innerText = prop.available_from ? new Date(prop.available_from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Not Found";
    availItems[1].innerText = prop.min_stay || "Flexible";
    availItems[2].innerText = prop.property_type || "Not Found";

    // --- 6. OWNER INFO ---
    const ownerName = prop.profiles?.full_name || "Owner Not Found";
    document.querySelector('.owner-name').innerText = ownerName;
    document.querySelector('.owner-avatar').innerText = ownerName[0].toUpperCase();
    document.querySelector('.call-btn').href = prop.property_phone ? `tel:${prop.property_phone}` : "#";

    // --- 7. MAP (Optional Update) ---
    // Agar aap map ko dynamic karna chahte hain to location_area ko query mein dalein
    // const mapIframe = document.querySelector('.map-container iframe');
    // if (mapIframe && prop.location_area) {
    //     const mapQuery = encodeURIComponent(`${prop.location_area}, ${prop.location_city}`);
    //     mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${mapQuery}`;
    //     // Note: Embed API use karne ke liye API key chahiye hoti hai, warna default Karachi wala hi rahega.
    // }

    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe && prop.location_area) {
        // Is link mein API Key ki zaroorat nahi hoti
        const mapQuery = encodeURIComponent(`${prop.location_area}, ${prop.location_city}`);
        mapIframe.src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
    }
}

// Global photo setter
window.setPhoto = function (thumb, url) {
    const mainImg = document.getElementById('main-img');
    if (mainImg) mainImg.src = url;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

document.addEventListener('DOMContentLoaded', loadPropertyDetails);

