const generateInvoice = (booking) => {
    const { name, email, phone, travelers, specialRequest, packageId, totalPrice, createdAt } = booking;

    // Ensure packageId is a full object with the expected properties
    const packageTitle = packageId ? packageId.title : "Package not found";
    const packagePrice = packageId ? packageId.price : "N/A";

    // Invoice header
    let invoice = `
    -------------------------------------
                  INVOICE
    -------------------------------------
    Customer Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Travelers: ${travelers}
    Package: ${packageTitle}
    Price per Traveler: $${packagePrice}
    Total Price: $${totalPrice}
    Special Requests: ${specialRequest || "None"}
    Date of Booking: ${new Date(createdAt).toLocaleDateString()}
    
    -------------------------------------
    Thank you for booking with us!
    -------------------------------------
    `;

    return invoice;
};

module.exports = generateInvoice;
