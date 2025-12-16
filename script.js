// Database simulation using localStorage
let donors = JSON.parse(localStorage.getItem('donors')) || [];
let requests = JSON.parse(localStorage.getItem('requests')) || [];
let inventory = JSON.parse(localStorage.getItem('inventory')) || {
    'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 
    'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0
};

// Tab switching
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Donor Management
document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donor = {
        id: Date.now(),
        name: document.getElementById('donorName').value,
        age: document.getElementById('donorAge').value,
        bloodType: document.getElementById('donorBloodType').value,
        phone: document.getElementById('donorPhone').value,
        date: document.getElementById('donationDate').value
    };
    
    donors.push(donor);
    inventory[donor.bloodType]++;
    
    localStorage.setItem('donors', JSON.stringify(donors));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    this.reset();
    displayDonors();
    updateInventory();
    alert('Donor added successfully!');
});

function displayDonors() {
    const tbody = document.querySelector('#donorTable tbody');
    tbody.innerHTML = '';
    
    donors.forEach(donor => {
        const row = `
            <tr>
                <td>${donor.id}</td>
                <td>${donor.name}</td>
                <td>${donor.age}</td>
                <td>${donor.bloodType}</td>
                <td>${donor.phone}</td>
                <td>${donor.date}</td>
                <td><button class="delete-btn" onclick="deleteDonor(${donor.id})">Delete</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function deleteDonor(id) {
    const donor = donors.find(d => d.id === id);
    if (donor && inventory[donor.bloodType] > 0) {
        inventory[donor.bloodType]--;
    }
    
    donors = donors.filter(d => d.id !== id);
    localStorage.setItem('donors', JSON.stringify(donors));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    displayDonors();
    updateInventory();
}

// Inventory Management
function updateInventory() {
    const cards = document.querySelectorAll('.blood-card');
    cards.forEach(card => {
        const type = card.getAttribute('data-type');
        const stock = card.querySelector('.stock');
        stock.textContent = `${inventory[type]} Units`;
    });
}

// Request Management
document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const request = {
        id: Date.now(),
        patient: document.getElementById('patientName').value,
        hospital: document.getElementById('hospitalName').value,
        bloodType: document.getElementById('requestBloodType').value,
        units: parseInt(document.getElementById('unitsNeeded').value),
        date: document.getElementById('requestDate').value,
        status: 'pending'
    };
    
    requests.push(request);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    this.reset();
    displayRequests();
    alert('Request submitted successfully!');
});

function displayRequests() {
    const tbody = document.querySelector('#requestTable tbody');
    tbody.innerHTML = '';
    
    requests.forEach(request => {
        const row = `
            <tr>
                <td>${request.id}</td>
                <td>${request.patient}</td>
                <td>${request.hospital}</td>
                <td>${request.bloodType}</td>
                <td>${request.units}</td>
                <td>${request.date}</td>
                <td><span class="status ${request.status}">${request.status.toUpperCase()}</span></td>
                <td>
                    ${request.status === 'pending' ? 
                        `<button class="fulfill-btn" onclick="fulfillRequest(${request.id})">Fulfill</button>` : 
                        'Completed'}
                    <button class="delete-btn" onclick="deleteRequest(${request.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function fulfillRequest(id) {
    const request = requests.find(r => r.id === id);
    
    if (inventory[request.bloodType] >= request.units) {
        inventory[request.bloodType] -= request.units;
        request.status = 'fulfilled';
        
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('requests', JSON.stringify(requests));
        
        displayRequests();
        updateInventory();
        alert('Request fulfilled successfully!');
    } else {
        alert(`Insufficient blood stock! Available: ${inventory[request.bloodType]} units`);
    }
}

function deleteRequest(id) {
    requests = requests.filter(r => r.id !== id);
    localStorage.setItem('requests', JSON.stringify(requests));
    displayRequests();
}

// Initialize on page load
displayDonors();
updateInventory();
displayRequests();