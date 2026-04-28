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

const propertyList = document.getElementById('property-list');

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
        propertyList.innerHTML += card;
    });
}

// Start building the grid
displayProperties();