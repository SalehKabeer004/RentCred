import { supabase } from './dbConnection.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        console.warn("Profile fetch error.");
        return;
    }

    initNavigation();
    renderDashboard(profile);
    setupProfileForm(profile);
    setupModalEvents(); // Modal logic separate kar di hai
});

// --- SECTION SWITCHING ---
function initNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-section]');
    const sections = document.querySelectorAll('.dash-section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(sec => {
                sec.classList.remove('active-section');
                if (sec.id === `section-${targetSection}`) {
                    sec.classList.add('active-section');
                }
            });
        });
    });
}

// --- RENDER DASHBOARD ---
async function renderDashboard(profile) {
    const isOwner = profile.role === 'owner';

    // Header & Sidebar UI
    document.getElementById('nav-username').innerText = profile.full_name || "User";
    document.getElementById('sidebar-name').innerText = profile.full_name || "User";
    document.getElementById('sidebar-email').innerText = profile.email || "Verified User";
    document.getElementById('user_name').innerText = (profile.full_name || "User").split(' ')[0];
    document.getElementById('header-date').innerText = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // Role Visibility
    document.getElementById('add-prop-btn').style.display = isOwner ? 'block' : 'none';
    document.getElementById('menu-my-properties').style.display = isOwner ? 'block' : 'none';
    document.getElementById('menu-favorites').style.display = isOwner ? 'none' : 'block';

    if (isOwner) {
        await setupOwnerDashboard(profile.id);
    }
}

// --- OWNER LOGIC (Stats & Tables) ---
async function setupOwnerDashboard(userId) {
    // 1. Fetch Data
    const { data: properties } = await supabase.from('properties').select('*').eq('owner_id', userId);
    const { data: leads } = await supabase.from('property_leads').select('*').eq('owner_id', userId);

    // 2. Render Stats (Modern Flex Structure)
    const statsGrid = document.getElementById('stat-homes');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon-wrap blue"><i class="fas fa-home"></i></div>
            <div class="stat-info">
                <h3>${properties?.length || 0}</h3>
                <p>Total Listings</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon-wrap green"><i class="fas fa-users"></i></div>
            <div class="stat-info">
                <h3>${leads?.length || 0}</h3>
                <p>Total Leads</p>
            </div>
        </div>
        <!-- <div class="stat-card">
            <div class="stat-icon-wrap amber"><i class="fas fa-star"></i></div>
            <div class="stat-info">
                <h3>80%</h3>
                <p>Trust Score</p>
            </div> -->
        </div>
    `;

    // 3. Render My Listings Table (My Listings Section ke liye)
    renderMyListings(properties);

    // 4. Render Recent Inquiries (Overview Table ke liye)
    renderLeadsTable(leads);

}

// Function: My Listings Table

function renderMyListings(properties) {
    const emptyState = document.getElementById('empty-state-properties');
    const tableContainer = document.getElementById('listing-table-container');
    const tbody = document.getElementById('properties-tbody');

    if (properties && properties.length > 0) {
        emptyState.style.display = 'none';
        tableContainer.style.display = 'block';

        tbody.innerHTML = properties.map(p => {
            // Status color logic
            const statusStyle = p.status === 'Active'
                ? 'background: #e6fffa; color: #234e52;'
                : 'background: #fff5f5; color: #c53030;';

            return `
                <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 15px; font-weight: 500;">${p.title}</td>
                    <td style="padding: 15px;">${p.location_city || 'N/A'}</td>
                    <td style="padding: 15px;">
                        <span style="${statusStyle} padding: 4px 10px; border-radius: 20px; font-size: 12px;">
                            ${p.status || 'Active'}
                        </span>
                    </td>
                    <td style="padding: 15px;">
                        <div class="manage-wrapper">
                            <button class="manage-btn-trigger" onclick="toggleManageMenu(event, '${p.id}')">
                                Manage <i class="fas fa-caret-down"></i>
                            </button>
                            <div id="dropdown-${p.id}" class="manage-dropdown">
                                 <!-- <a href="#" onclick="editListing('${p.id}')">
                                     <i class="fas fa-edit"></i> Edit
                                 </a> -->
                                <a href="#" onclick="updatePropertyStatus('${p.id}', 'Active')">
                                    <i class="fas fa-check-circle"></i> Mark Active
                                </a>

                                <a href="#" onclick="updatePropertyStatus('${p.id}', 'Rented')">
                                    <i class="fas fa-check-circle"></i> Mark Rented
                                </a>
                                <a href="#" onclick="updatePropertyStatus('${p.id}', 'Hidden')">
                                    <i class="fas fa-eye-slash"></i> Hide
                                </a>
                                <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 4px 0;">
                                <a href="#" class="text-danger" onclick="deleteListing('${p.id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        emptyState.style.display = 'block';
        tableContainer.style.display = 'none';
    }
}

// Dropdown toggle karne ke liye
// window.toggleManageMenu = function(event, id) {
//     event.stopPropagation();

//     // Saare dropdowns pehle band karein
//     document.querySelectorAll('.manage-dropdown').forEach(el => {
//         if (el.id !== `dropdown-${id}`) el.classList.remove('show');
//     });

//     // Target dropdown ko toggle karein
//     const currentDropdown = document.getElementById(`dropdown-${id}`);
//     if (currentDropdown) {
//         currentDropdown.classList.toggle('show');
//     }
// };

window.toggleManageMenu = function (event, id) {
    event.stopPropagation();
    document.querySelectorAll('.manage-dropdown').forEach(el => {
        if (el.id !== `dropdown-${id}`) el.classList.remove('show');
    });
    document.getElementById(`dropdown-${id}`)?.classList.toggle('show');
};

// 2. Status Update function ko Global dalein
// window.updatePropertyStatus = async function(id, newStatus) {
//     const { error } = await supabase
//         .from('properties')
//         .update({ status: newStatus })
//         .eq('id', id);

//     if (error) {
//         alert("Update failed: " + error.message);
//     } else {
//         // UI refresh karne ke liye apna fetch function call karein
//         if (typeof fetchUserListings === 'function') { fetchUserListings()}
//     }
// };

window.updatePropertyStatus = async function (id, newStatus) {
    // 1. Status Update karein
    const { error: updateError } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', id);

    if (updateError) {
        alert("Error: " + updateError.message);
        return;
    }

    // 2. Data dubara fetch karein (Proper Way)
    // Pehle check karein logged in user kaun hai
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: properties, error: fetchError } = await supabase
            .from('properties')
            .select('*')
            .eq('owner_id', user.id); // Yahan user.id dena zaroori hai

        if (!fetchError) {
            renderMyListings(properties); // UI refresh ho jayegi
        }
    } else {
        console.error("User not logged in");
    }
};

// 3. Delete function ko Global dalein
// window.deleteListing = async function(id) {
//     if (confirm("Are you sure you want to delete this listing?")) {
//         const { error } = await supabase
//             .from('properties')
//             .delete()
//             .eq('id', id);

//         if (!error) {
//             if (typeof fetchUserListings === 'function') fetchUserListings();
//         } else {
//             alert("Delete failed: " + error.message);
//         }
//     }
// };

window.deleteListing = async function (id) {
    // 1. Pehle confirm karein
    if (!confirm("Are you sure you want to delete this listing?")) return;

    // 2. Database se delete karein
    const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

    if (deleteError) {
        alert("Delete failed: " + deleteError.message);
        return;
    }

    // 3. Delete hone ke BAAD fresh data fetch karein
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { data: properties, error: fetchError } = await supabase
            .from('properties')
            .select('*')
            .eq('owner_id', user.id); // Correct: user.id pass karna zaroori hai

        if (!fetchError) {
            renderMyListings(properties); // UI refresh ho jayegi
        }
    }
};

// 4. Click outside to close logic
window.addEventListener('click', function () {
    document.querySelectorAll('.manage-dropdown').forEach(el => el.classList.remove('show'));
});

// Function: Leads Table
function renderLeadsTable(leads) {
    const tbody = document.getElementById('activity-tbody');
    if (!tbody) return;

    if (leads && leads.length > 0) {
        tbody.innerHTML = leads.map(l => `
            <div class="lead-row" style="display:flex; align-items:center; gap:15px; padding:10px; border-bottom:1px solid #edf2f7;">
                <div style="width:40px; height:40px; border-radius:50%; background:#cbd5e0; display:flex; align-items:center; justify-content:center; font-weight:600; color:#2d3748;">
                    ${l.sender_name ? l.sender_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h4>${l.sender_name || 'Unknown Lead'}</h4>
                    <p>${l.sender_email || 'No email provided'}</p>
                    <p>${l.sender_phone || 'No phone provided'}</p>
                    <p><span style="font-size:12px; color:#718096;">${new Date(l.created_at).toLocaleString()}</span></p>
                </div>
                <div style="margin-left:auto;">
                    <p>${l.message ? (l.message.length > 50 ? l.message.substring(0, 47) + '...' : l.message) : 'No message provided'}</p>
                </div>
            </div>
        `).join('');
    } else {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No leads yet.</td></tr>`;
    }
}

// --- PROFILE SETTINGS ---
function setupProfileForm(profile) {
    const form = document.querySelector('.profile-form');
    const nameInput = document.getElementById('profile-fullname');
    const emailInput = document.getElementById('profile-email-field');

    if (nameInput) nameInput.value = profile.full_name || '';
    if (emailInput) emailInput.value = profile.email || '';

    form.querySelector('.save-btn').onclick = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: nameInput.value })
            .eq('id', profile.id);

        if (error) alert("Update failed!");
        else alert("Profile updated successfully!");
    };
}

// --- MODAL HANDLING ---
function setupModalEvents() {
    const modal = document.getElementById('property-modal');
    const addBtn = document.getElementById('add-prop-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    if (addBtn) addBtn.onclick = () => modal.style.display = 'block';
    if (cancelBtn) cancelBtn.onclick = (e) => { e.preventDefault(); modal.style.display = 'none'; };

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
}


// --- PROPERTY SUBMISSION ---

document.addEventListener('DOMContentLoaded', () => {
    const propertyForm = document.getElementById('property-form');
    if (propertyForm) {
        propertyForm.addEventListener('submit', handlePropertySubmit);
    }

    // File Validation Listeners
    setupFileValidations();
});

// --- 1. VALIDATION LOGIC ---
function setupFileValidations() {
    const galleryInput = document.getElementById('p-gallery');
    const videoInput = document.getElementById('p-video');

    galleryInput?.addEventListener('change', function () {
        if (this.files.length > 5) {
            alert("Sarf 5 gallery images upload karne ki ijazat hai.");
            this.value = "";
        }
    });

    videoInput?.addEventListener('change', function () {
        const file = this.files[0];
        if (file && file.size > 20 * 1024 * 1024) { // 20MB Limit
            alert("Video ka size 20MB se zyada nahi hona chahiye.");
            this.value = "";
        }
    });
}

// --- 2. IMAGE UPLOAD HELPER ---
async function uploadFile(file, folder) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('property-media') // Apne Supabase bucket ka naam yahan likhein
        .upload(`${folder}/${fileName}`, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('property-media')
        .getPublicUrl(`${folder}/${fileName}`);

    return publicUrl;
}

// --- 3. MAIN SUBMIT FUNCTION ---
async function handlePropertySubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('publish-btn');
    btn.innerText = "Publishing...";
    btn.disabled = true;

    try {
        const { data: { user } } = await supabase.auth.getUser();

        // A. Upload Featured Image
        const featuredFile = document.getElementById('p-featured').files[0];
        const featuredUrl = await uploadFile(featuredFile, 'featured');

        // B. Upload Gallery Images
        const galleryFiles = document.getElementById('p-gallery').files;
        const galleryUrls = [];
        for (let file of galleryFiles) {
            const url = await uploadFile(file, 'gallery');
            galleryUrls.push(url);
        }

        // C. Upload Video (Optional)
        let videoUrl = null;
        const videoFile = document.getElementById('p-video').files[0];
        if (videoFile) {
            videoUrl = await uploadFile(videoFile, 'videos');
        }

        // D. Collect Amenities
        const amenities = Array.from(document.querySelectorAll('#p-amenities input:checked'))
            .map(cb => cb.value);

        // E. Prepare Final Data Object
        const propertyData = {
            owner_id: user.id, // Auth user ID
            title: document.getElementById('p-title').value,
            description: document.getElementById('p-desc').value,
            property_type: document.getElementById('p-type').value, // Must match: Apartment, House, Room, Shop, or Portion
            location_city: document.getElementById('p-city').value,
            location_area: document.getElementById('p-area').value,
            property_phone: document.getElementById('p-phone').value,
            rent_price: parseFloat(document.getElementById('p-price').value),
            security_deposit: parseFloat(document.getElementById('p-deposit').value) || 0,
            featured_image: featuredUrl, // Public URL from storage
            images_urls: galleryUrls, // Array of URLs (text[])
            video_url: videoUrl, // Single URL string
            status: 'Active', // Default status as per table constraint
            bedrooms: parseInt(document.getElementById('p-beds').value) || 0,
            bathrooms: parseInt(document.getElementById('p-baths').value) || 0,
            area_sqft: parseInt(document.getElementById('p-sqft').value) || 0,
            floor_number: parseInt(document.getElementById('p-floor').value) || 0,
            has_parking: document.getElementById('p-parking').checked,
            available_from: document.getElementById('p-available').value || null,
            min_stay: document.getElementById('p-minstay').value,
            amenities: amenities, // Array saved as JSONB
            // trust_score: 85, // Default score
            is_verified: false, // Default verification status
            nearby_facilities: {} // Empty object for now
        };

        // F. Insert into Supabase
        const { error } = await supabase.from('properties').insert([propertyData]);

        if (error) throw error;

        alert("Property published successfully!");
        location.reload();

    } catch (err) {
        console.error(err);
        alert("System Error: " + err.message);
    } finally {
        btn.innerText = "Publish Property";
        btn.disabled = false;
    }
}