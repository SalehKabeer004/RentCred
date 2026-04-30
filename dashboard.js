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
        console.warn("Profile fetch error or missing profile.");
        return;
    }

    renderDashboard(profile);
});

function renderDashboard(profile) {
    const isOwner = profile.role === 'owner';

    // Elements ko safely pakrein
    const navUser = document.getElementById('nav-username');
    const sidebarUser = document.getElementById('sidebar-name');
    const welcomeUser = document.getElementById('user_name');
    const addBtn = document.getElementById('add-prop-btn');
    const myPropsMenu = document.getElementById('menu-my-properties');
    const favsMenu = document.getElementById('menu-favorites');

    // Update Text Safely
    if (navUser) navUser.innerText = profile.full_name || "User";
    if (sidebarUser) sidebarUser.innerText = profile.full_name || "User";
    if (welcomeUser) welcomeUser.innerText = (profile.full_name || "User").split(' ')[0];

    // Toggle Menu Items
    if (addBtn) addBtn.style.display = isOwner ? 'block' : 'none';
    if (myPropsMenu) myPropsMenu.style.display = isOwner ? 'block' : 'none';
    if (favsMenu) favsMenu.style.display = isOwner ? 'none' : 'block';

    if (isOwner) {
        setupOwnerView(profile.id);
    } else {
        setupRenterView(profile.id);
    }
}

async function setupOwnerView(userId) {
    const statHomes = document.getElementById('stat-homes');
    if (statHomes) statHomes.innerText = "Loading...";

    const { data: properties, count } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('owner_id', userId);

    if (statHomes) statHomes.innerText = count || 0;

    const tbody = document.getElementById('activity-tbody');
    if (tbody) {
        if (properties && properties.length > 0) {
            tbody.innerHTML = properties.map(p => `
                <tr>
                    <td>${p.title}</td>
                    <td>${new Date(p.created_at).toLocaleDateString()}</td>
                    <td><span class="status ${p.status.toLowerCase()}">${p.status}</span></td>
                    <td><button class="edit-btn" onclick="deleteProperty(${p.id})"><i class="fas fa-trash"></i> Delete</button></td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No properties listed yet.</td></tr>`;
        }
    }
}

async function setupRenterView(userId) {
    const statLabel = document.querySelector('#stat-homes + p');
    if (statLabel) statLabel.innerText = "Saved Favorites";

    const { data: favorites, count } = await supabase
        .from('favorites')
        .select('*, properties(*)', { count: 'exact' })
        .eq('user_id', userId);

    const statHomes = document.getElementById('stat-homes');
    if (statHomes) statHomes.innerText = count || 0;

    const tbody = document.getElementById('activity-tbody');
    if (tbody) {
        if (favorites && favorites.length > 0) {
            tbody.innerHTML = favorites.map(f => `
                <tr>
                    <td>${f.properties?.title || 'Unknown'}</td>
                    <td>${new Date(f.created_at).toLocaleDateString()}</td>
                    <td><span class="status active">Saved</span></td>
                    <td><button class="edit-btn"><i class="fas fa-eye"></i> View</button></td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No favorites yet.</td></tr>`;
        }
    }
}

// Modal handling
const modal = document.getElementById('property-modal');
const addBtn = document.getElementById('add-prop-btn');
if (addBtn && modal) {
    addBtn.onclick = () => modal.style.display = 'flex';
}
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};



// --- PROPERTY SUBMISSION LOGIC ---
const propertyForm = document.getElementById('property-form');

if (propertyForm) {
    propertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = propertyForm.querySelector('button[type="submit"]');
        submitBtn.innerText = "Uploading Media...";
        submitBtn.disabled = true;

        try {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) throw new Error("User not authenticated!");

            // 1. Files ko pakrein
            const featuredFile = document.getElementById('p-featured').files[0];
            const galleryFiles = document.getElementById('p-gallery').files;
            const videoFile = document.getElementById('p-video').files[0];

            if (!featuredFile) throw new Error("Featured image is required!");

            // 2. Featured Image Upload Karein
            console.log("Uploading featured image...");
            const featuredUrl = await uploadToStorage(featuredFile, 'images');

            // 3. Gallery Images Upload Karein (Loop)
            console.log("Uploading gallery...");
            let galleryUrls = [];
            for (let file of galleryFiles) {
                const url = await uploadToStorage(file, 'images');
                galleryUrls.push(url);
            }

            // 4. Video Upload Karein (Optional)
            let videoUrl = null;
            if (videoFile) {
                console.log("Uploading video...");
                videoUrl = await uploadToStorage(videoFile, 'videos');
            }

            // --- Updated Database Insert Section ---
            const { error } = await supabase.from('properties').insert([{
                owner_id: user.id,
                title: document.getElementById('p-title')?.value || 'Untitled',
                property_type: document.getElementById('p-type')?.value || 'Apartment',
                rent_price: parseFloat(document.getElementById('p-price')?.value) || 0,

                // Safely get values using optional chaining (?.)
                location_city: document.getElementById('location_city')?.value || 'Not Provided',
                location_area: document.getElementById('location_area')?.value || 'Not Provided',
                property_phone: document.getElementById('property_phone')?.value || 'No Contact',

                featured_image: featuredUrl,
                images_urls: galleryUrls,
                video_url: videoUrl,
                status: 'Active'
            }]);

            if (error) throw error;

            alert("Mubarak ho! Property add ho gayi.");
            location.reload(); // Page refresh karein taake nayi property nazar aaye

        } catch (err) {
            console.error("Critical Error:", err);
            alert("Error: " + err.message);
        } finally {
            submitBtn.innerText = "Publish Property";
            submitBtn.disabled = false;
        }
    });
}

// --- HELPER: STORAGE UPLOAD ---
async function uploadToStorage(file, folder) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('property-media') // Ensure karein ye bucket name exact ho
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('property-media')
        .getPublicUrl(filePath);

    return publicUrl;
}