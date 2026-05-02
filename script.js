const propertyData = [
    {
        title: "Modern Downtown Apartment",
        price: "$2,400/mo",
        loc: "Manhattan, New York",
        score: "94%",
        specs: "2 bed • 2 bath",
        owner: "Sarah Johnson",
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800"
    },
    {
        title: "Charming Family House",
        price: "$3,200/mo",
        loc: "Brooklyn Heights, NY",
        score: "89%",
        specs: "3 bed • 2.5 bath",
        owner: "Michael Chen",
        img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800"
    },
    {
        title: "Luxury Studio Loft",
        price: "$1,800/mo",
        loc: "SoHo, New York",
        score: "92%",
        specs: "Studio • 1 bath",
        owner: "Emma Rodriguez",
        img: "https://images.pexels.com/photos/28586201/pexels-photo-28586201.jpeg"
    }
];

const propertyList = document.getElementById('featured-property-list');

function displayProperties() {
    propertyData.forEach(prop => {
        const card = `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${prop.img}" alt="House">
                    <span class="tag-score">Score: ${prop.score}</span>
                    <span class="tag-verified"><i class="fas fa-check-circle"></i> Verified</span>
                </div>
                <div class="card-body">
                    <h3>${prop.title}</h3>
                    <p class="card-price">${prop.price}</p>
                    <p class="card-loc"><i class="fas fa-location-dot"></i> ${prop.loc}</p>
                    <div class="card-footer">
                        <span><i class="fas fa-bed"></i> ${prop.specs}</span>
                        <span class="card-owner"><i class="fas fa-user"></i> ${prop.owner}</span>
                    </div>
                </div>
            </div>
        `;
        if (propertyList) propertyList.innerHTML += card;
    });
}

// Start building the grid
displayProperties();


// Form toggle logic
let creat_acount_form = document.getElementById("creat_acount_form")
let login_form = document.getElementById("login_form")
function showForm() {
    creat_acount_form.style.display = "flex"
    login_form.style.display = "none"
}
function login_form_function() {
    creat_acount_form.style.display = "none"
    login_form.style.display = "flex"
}

const burger = document.getElementById("burger");
const nav_toggle = document.getElementById("nav_toggle");
const nav_btn_menu_bar = document.getElementById("nav_toggle_menu_bar");

let isClick = false;

burger.addEventListener("click", function () {
    isClick = !isClick; // Flips true to false or false to true

    if (isClick) {
        console.log("Menu Opened");
        // Add the active classes
        nav_toggle.classList.add("set_navbar");
        nav_btn_menu_bar.classList.add("set_btn");
    } else {
        console.log("Menu Closed");
        // Remove the active classes
        nav_toggle.classList.remove("set_navbar");
        nav_btn_menu_bar.classList.remove("set_btn");

        // Add your "closing" animation classes
        nav_btn_menu_bar.classList.add("set_btn_none");
        nav_toggle.classList.add("set_navbar_none");

        // Clean up the animation classes after 1 second
        setTimeout(() => {
            nav_btn_menu_bar.classList.remove("set_btn_none");
            nav_toggle.classList.remove("set_navbar_none");
        }, 1000);
    }
});