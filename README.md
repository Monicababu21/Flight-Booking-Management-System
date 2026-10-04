# Flight Booking Management System

A complete frontend flight reservation and ticketing management platform built with HTML5, CSS3, and JavaScript.

## Features

- **Header & Navigation**: Seamless navigation across Home, Search Flights, and Bookings.
- **Flight Search**: Search routes by Origin airport, Destination airport, Departure Date, Passenger Count, and Cabin Class (Economy/Business).
- **Flight Results**: Displays airline, flight number, departure/arrival timings, flight duration, seats, and class-specific pricing.
- **Booking Modal**: Collects passenger contact info (Full Name, Email, Phone, Number of Passengers) with live total fare calculation.
- **E-Ticket Confirmation**: Generates a unique airline booking reference (`AIR-XXXXXX`), route itinerary, and confirmation badge.
- **Manage Bookings**: Full reservation management section powered by `localStorage` supporting multiple tickets, viewing individual e-tickets, and cancellation.

## Technologies Used

- **HTML5**: Semantic tags, forms, modal dialogs, and clean UI components.
- **CSS3**: Custom purple theme, responsive flex/grid layouts, flight status badges, and mobile-friendly media queries.
- **JavaScript (ES6)**: Array operations, dynamic pricing calculation, form validation, modal controls, and `localStorage` persistence.

## File Structure

```
Flight_Booking_Management_System/
├── index.html    # Main page and modal layouts
├── style.css     # Flight cards, badges, and responsive styling
├── script.js     # Flight search, booking management, and localStorage
└── README.md     # Project documentation
```

## How to Run

1. Open `index.html` in any web browser.
2. Runs entirely in the browser without any backend or external server.
