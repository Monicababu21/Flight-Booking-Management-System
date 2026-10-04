// Sample Flight Inventory
const sampleFlights = [
    {
        id: "FL-101",
        airline: "SkyWings International",
        flightNumber: "SW-342",
        from: "New York (JFK)",
        to: "London (LHR)",
        departure: "08:15 AM",
        arrival: "08:30 PM",
        duration: "7h 15m",
        economyPrice: 420,
        businessPrice: 1150,
        availableSeats: 16
    },
    {
        id: "FL-102",
        airline: "Atlantic Star Express",
        flightNumber: "AS-809",
        from: "New York (JFK)",
        to: "London (LHR)",
        departure: "06:45 PM",
        arrival: "07:00 AM (+1)",
        duration: "7h 15m",
        economyPrice: 460,
        businessPrice: 1280,
        availableSeats: 8
    },
    {
        id: "FL-103",
        airline: "Pacific Crest Airlines",
        flightNumber: "PC-512",
        from: "London (LHR)",
        to: "New York (JFK)",
        departure: "11:00 AM",
        arrival: "02:30 PM",
        duration: "8h 30m",
        economyPrice: 390,
        businessPrice: 1050,
        availableSeats: 22
    },
    {
        id: "FL-104",
        airline: "Global Jetways",
        flightNumber: "GJ-902",
        from: "San Francisco (SFO)",
        to: "London (LHR)",
        departure: "02:30 PM",
        arrival: "09:00 AM (+1)",
        duration: "10h 30m",
        economyPrice: 530,
        businessPrice: 1420,
        availableSeats: 14
    },
    {
        id: "FL-105",
        airline: "Emirate Horizon Air",
        flightNumber: "EH-771",
        from: "London (LHR)",
        to: "Dubai (DXB)",
        departure: "01:15 PM",
        arrival: "11:45 PM",
        duration: "7h 30m",
        economyPrice: 480,
        businessPrice: 1350,
        availableSeats: 19
    },
    {
        id: "FL-106",
        airline: "Emirate Horizon Air",
        flightNumber: "EH-204",
        from: "New York (JFK)",
        to: "Dubai (DXB)",
        departure: "10:30 PM",
        arrival: "07:45 PM (+1)",
        duration: "13h 15m",
        economyPrice: 620,
        businessPrice: 1750,
        availableSeats: 10
    }
];

// App State
let currentSelectedFlight = null;
let currentSearchCriteria = null;
let savedBookings = [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Setup date minimum
    const depDate = document.getElementById("departureDate");
    if (depDate) {
        const today = new Date().toISOString().split("T")[0];
        depDate.min = today;
        depDate.value = today;
    }

    // Load bookings from localStorage
    loadBookingsFromStorage();

    // Attach listeners
    document.getElementById("flightSearchForm").addEventListener("submit", handleFlightSearch);
    document.getElementById("passengerBookingForm").addEventListener("submit", handleConfirmBooking);
    document.getElementById("modalPassengers").addEventListener("input", updateTotalPriceCalculation);
});

// Load Bookings from localStorage
function loadBookingsFromStorage() {
    const data = localStorage.getItem("flightBookings");
    if (data) {
        try {
            savedBookings = JSON.parse(data);
        } catch (e) {
            savedBookings = [];
        }
    } else {
        savedBookings = [];
    }
}

// Save Bookings to localStorage
function saveBookingsToStorage() {
    localStorage.setItem("flightBookings", JSON.stringify(savedBookings));
}

// Show/Switch Section
function showSection(sectionId) {
    const homeSection = document.getElementById("search-section");
    const resultsSection = document.getElementById("resultsSection");
    const confirmationSection = document.getElementById("confirmationSection");
    const bookingsSection = document.getElementById("bookingsSection");

    confirmationSection.classList.add("d-none");
    bookingsSection.classList.add("d-none");

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    if (sectionId === "home") {
        homeSection.scrollIntoView({ behavior: "smooth" });
        navLinks[0].classList.add("active");
    } else if (sectionId === "search") {
        homeSection.scrollIntoView({ behavior: "smooth" });
        navLinks[1].classList.add("active");
    } else if (sectionId === "bookings") {
        bookingsSection.classList.remove("d-none");
        renderBookingsList();
        bookingsSection.scrollIntoView({ behavior: "smooth" });
        navLinks[2].classList.add("active");
    }
}

// Show Alerts
function showAlert(message, type = "danger") {
    const alertBox = document.getElementById("alertBox");
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove("d-none");

    setTimeout(() => {
        alertBox.classList.add("d-none");
    }, 4000);
}

// Handle Flight Search
function handleFlightSearch(e) {
    e.preventDefault();

    const from = document.getElementById("fromAirport").value;
    const to = document.getElementById("toAirport").value;
    const date = document.getElementById("departureDate").value;
    const passengers = parseInt(document.getElementById("passengerCount").value, 10);
    const cabinClass = document.getElementById("cabinClass").value;

    if (from === to) {
        showAlert("Origin and Destination airports cannot be identical.");
        return;
    }

    currentSearchCriteria = {
        from: from,
        to: to,
        date: date,
        passengers: passengers,
        cabinClass: cabinClass
    };

    renderFlightResults();
}

// Render Results
function renderFlightResults() {
    const resultsSection = document.getElementById("resultsSection");
    const list = document.getElementById("flightList");
    const summary = document.getElementById("searchSummary");

    summary.textContent = `Route: ${currentSearchCriteria.from} ➔ ${currentSearchCriteria.to} | Date: ${currentSearchCriteria.date} | Class: ${currentSearchCriteria.cabinClass}`;

    // Filter matching or show route schedules
    let matched = sampleFlights.filter(f => f.from === currentSearchCriteria.from && f.to === currentSearchCriteria.to);

    // If no direct matches in sample data, display relevant flights with adjusted airports for demonstration
    if (matched.length === 0) {
        matched = sampleFlights.slice(0, 3).map(f => ({
            ...f,
            from: currentSearchCriteria.from,
            to: currentSearchCriteria.to
        }));
    }

    list.innerHTML = "";

    matched.forEach(flight => {
        const isBusiness = currentSearchCriteria.cabinClass === "Business";
        const price = isBusiness ? flight.businessPrice : flight.economyPrice;

        const card = document.createElement("div");
        card.className = "flight-card";
        card.innerHTML = `
            <div class="flight-info">
                <div class="flight-header">
                    <span class="flight-airline">${flight.airline}</span>
                    <span class="flight-code">${flight.flightNumber}</span>
                </div>
                <div class="flight-route-info">
                    <span><strong>Dep:</strong> ${flight.departure} (${flight.from})</span>
                    <span>➔</span>
                    <span><strong>Arr:</strong> ${flight.arrival} (${flight.to})</span>
                </div>
                <p class="flight-meta">Duration: <strong>${flight.duration}</strong> | Class: <strong>${currentSearchCriteria.cabinClass}</strong> | Seats: <strong>${flight.availableSeats}</strong></p>
            </div>
            <div class="flight-action">
                <div class="flight-price">$${price} <span style="font-size: 0.8rem; font-weight: normal; color: #718096;">/ ticket</span></div>
                <button class="btn btn-primary" onclick="openBookingModal('${flight.id}', ${price})">Book Now</button>
            </div>
        `;
        list.appendChild(card);
    });

    resultsSection.classList.remove("d-none");
    resultsSection.scrollIntoView({ behavior: "smooth" });
}

// Open Booking Modal
function openBookingModal(flightId, ticketPrice) {
    const baseFlight = sampleFlights.find(f => f.id === flightId);
    if (!baseFlight) return;

    currentSelectedFlight = {
        ...baseFlight,
        from: currentSearchCriteria.from,
        to: currentSearchCriteria.to,
        cabinClass: currentSearchCriteria.cabinClass,
        unitPrice: ticketPrice
    };

    const modal = document.getElementById("bookingModal");
    const summary = document.getElementById("modalFlightSummary");
    const passInput = document.getElementById("modalPassengers");

    passInput.value = currentSearchCriteria?.passengers || 1;

    summary.innerHTML = `
        <p><strong>Flight:</strong> ${currentSelectedFlight.airline} (${currentSelectedFlight.flightNumber})</p>
        <p><strong>Route:</strong> ${currentSelectedFlight.from} ➔ ${currentSelectedFlight.to}</p>
        <p><strong>Date:</strong> ${currentSearchCriteria.date} (${currentSelectedFlight.departure})</p>
        <p><strong>Cabin:</strong> ${currentSelectedFlight.cabinClass} ($${currentSelectedFlight.unitPrice} per seat)</p>
    `;

    updateTotalPriceCalculation();
    modal.classList.remove("d-none");
}

function closeBookingModal() {
    document.getElementById("bookingModal").classList.add("d-none");
}

// Update calculated price
function updateTotalPriceCalculation() {
    if (!currentSelectedFlight) return;
    const count = parseInt(document.getElementById("modalPassengers").value, 10) || 1;
    const total = count * currentSelectedFlight.unitPrice;
    document.getElementById("modalTotalPrice").textContent = `$${total}`;
}

// Confirm Booking Submission
function handleConfirmBooking(e) {
    e.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const passengers = parseInt(document.getElementById("modalPassengers").value, 10);

    if (!name || !email || !phone || passengers < 1) {
        showAlert("Please fill out all contact and passenger fields.");
        return;
    }

    const bookingId = "AIR-" + Math.floor(100000 + Math.random() * 900000);
    const totalPrice = passengers * currentSelectedFlight.unitPrice;

    const booking = {
        bookingId: bookingId,
        passengerName: name,
        email: email,
        phone: phone,
        airline: currentSelectedFlight.airline,
        flightNumber: currentSelectedFlight.flightNumber,
        from: currentSelectedFlight.from,
        to: currentSelectedFlight.to,
        date: currentSearchCriteria.date,
        departureTime: currentSelectedFlight.departure,
        passengers: passengers,
        cabinClass: currentSelectedFlight.cabinClass,
        totalPrice: totalPrice,
        status: "Confirmed",
        bookedAt: new Date().toLocaleString()
    };

    // Store to array and localStorage
    savedBookings.unshift(booking);
    saveBookingsToStorage();

    closeBookingModal();
    displayConfirmation(booking);
    showAlert("Flight Booking Confirmed!", "success");
}

// Display Booking Confirmation
function displayConfirmation(booking) {
    document.getElementById("resultsSection").classList.add("d-none");
    const confirmation = document.getElementById("confirmationSection");
    const details = document.getElementById("confirmationDetails");

    details.innerHTML = `
        <div class="ticket-row"><p>Booking Reference</p><span>${booking.bookingId}</span></div>
        <div class="ticket-row"><p>Passenger Name</p><span>${booking.passengerName}</span></div>
        <div class="ticket-row"><p>Airline & Flight</p><span>${booking.airline} (${booking.flightNumber})</span></div>
        <div class="ticket-row"><p>Route</p><span>${booking.from} ➔ ${booking.to}</span></div>
        <div class="ticket-row"><p>Flight Date & Time</p><span>${booking.date} at ${booking.departureTime}</span></div>
        <div class="ticket-row"><p>Cabin Class</p><span>${booking.cabinClass}</span></div>
        <div class="ticket-row"><p>Passengers</p><span>${booking.passengers} Passenger(s)</span></div>
        <div class="ticket-row"><p>Total Fare</p><span style="color: #6c5ce7; font-size: 1.2rem;">$${booking.totalPrice}</span></div>
        <div class="ticket-row"><p>Booking Status</p><span style="color: #38a169;">${booking.status}</span></div>
    `;

    confirmation.classList.remove("d-none");
    confirmation.scrollIntoView({ behavior: "smooth" });
}

// Render Bookings List
function renderBookingsList() {
    const container = document.getElementById("bookingsList");
    loadBookingsFromStorage();

    if (savedBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No active or saved flight reservations found.</p>
                <button class="btn btn-secondary" onclick="showSection('home')">Book a Flight</button>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    savedBookings.forEach(booking => {
        const item = document.createElement("div");
        item.className = "booking-item-card";
        item.innerHTML = `
            <div class="booking-item-header">
                <div>
                    <h3 style="color: #6c5ce7;">${booking.airline} (${booking.flightNumber})</h3>
                    <p style="font-size: 0.85rem; color: #718096;">Ref: <strong>${booking.bookingId}</strong> | Booked on ${booking.bookedAt}</p>
                </div>
                <span class="success-badge" style="margin: 0;">${booking.status}</span>
            </div>

            <div class="ticket-details" style="border: none; padding: 0; margin: 0.5rem 0;">
                <div class="ticket-row"><p>Passenger</p><span>${booking.passengerName} (${booking.email})</span></div>
                <div class="ticket-row"><p>Route</p><span>${booking.from} ➔ ${booking.to}</span></div>
                <div class="ticket-row"><p>Travel Date</p><span>${booking.date} (${booking.departureTime})</span></div>
                <div class="ticket-row"><p>Details</p><span>${booking.passengers} Traveler(s) • ${booking.cabinClass}</span></div>
                <div class="ticket-row"><p>Total Paid</p><span style="color: #6c5ce7; font-weight: bold;">$${booking.totalPrice}</span></div>
            </div>

            <div class="booking-item-actions">
                <button class="btn btn-outline" onclick="viewSingleBooking('${booking.bookingId}')">View Ticket</button>
                <button class="btn btn-danger" onclick="cancelFlightBooking('${booking.bookingId}')">Cancel Booking</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// View Single Booking in modal or confirmation
function viewSingleBooking(bookingId) {
    const booking = savedBookings.find(b => b.bookingId === bookingId);
    if (!booking) return;
    displayConfirmation(booking);
}

// Cancel Booking
function cancelFlightBooking(bookingId) {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
        savedBookings = savedBookings.filter(b => b.bookingId !== bookingId);
        saveBookingsToStorage();
        renderBookingsList();
        showAlert(`Flight booking ${bookingId} was successfully cancelled.`, "success");
    }
}
