document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemButton = document.getElementById('addItem');
    const removeItemButton = document.getElementById('removeItem'); // Get the global removeItem button
    const grandTotalSpan = document.getElementById('grandTotal');
    const quoteForm = document.getElementById('quoteForm');
    const quoteDateInput = document.getElementById('quoteDate');

    let itemCounter = 0;

    // Helper function to format number with commas
    const formatNumberWithCommas = (value) => {
        if (value === null || value === undefined || value === '') return '';
        const num = parseFloat(String(value).replace(/,/g, ''));
        if (isNaN(num)) return '';
        return num.toLocaleString();
    };

    // Helper function to parse number from string with commas
    const parseNumberFromCommas = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        const num = parseFloat(String(value).replace(/,/g, ''));
        return isNaN(num) ? 0 : num;
    };

    // Function to update item total and grand total
    const updateTotals = () => {
        let grandTotal = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const quantity = parseNumberFromCommas(row.querySelector('.quantity').value) || 0;
            const unitPrice = parseNumberFromCommas(row.querySelector('.unitPrice').value); // Use parse function
            const itemTotal = quantity * unitPrice;
            row.querySelector('.item-total').textContent = `${itemTotal.toLocaleString()}`;
            grandTotal += itemTotal;
        });
        grandTotalSpan.textContent = `${grandTotal.toLocaleString()}원`;
    };

    // Function to add a new item row
    const addItemRow = () => {
        itemCounter++;
        const itemRow = document.createElement('div');
        itemRow.classList.add('item-row');
        itemRow.innerHTML = `
            <span class="item-no">${itemCounter}</span>
            <input type="text" class="description" placeholder="품명" required>
            <input type="text" class="quantity" placeholder="수량" value="1" required>
            <input type="text" class="unitPrice" placeholder="단가" value="0" required>
            <span class="item-total">0</span>
            <input type="text" class="remarks" placeholder="">
        `; // Removed removeItem button from here
        itemsContainer.appendChild(itemRow);

        // Add event listeners for new row
        const newQuantityInput = itemRow.querySelector('.quantity');
        const newUnitPriceInput = itemRow.querySelector('.unitPrice');

        newQuantityInput.addEventListener('input', (e) => {
            const rawValue = e.target.value;
            const parsedValue = parseNumberFromCommas(rawValue);
            e.target.value = formatNumberWithCommas(parsedValue);
            updateTotals();
        });
        
        newUnitPriceInput.addEventListener('input', (e) => {
            const rawValue = e.target.value;
            const parsedValue = parseNumberFromCommas(rawValue);
            e.target.value = formatNumberWithCommas(parsedValue);
            updateTotals();
        });

        updateTotals(); // Update totals after adding new row
    };

    // Set initial quote date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const initialDate = `${yyyy}-${mm}-${dd}`;
    quoteDateInput.value = initialDate;

    // Initial item row
    addItemRow();

    // Event listener for Add Item button
    addItemButton.addEventListener('click', addItemRow);

    // Event listener for global Remove Item button
    removeItemButton.addEventListener('click', () => {
        const allItemRows = document.querySelectorAll('.item-row');
        if (allItemRows.length > 1) { // Ensure at least one item remains
            allItemRows[allItemRows.length - 1].remove();
            itemCounter = allItemRows.length - 1; // Update itemCounter
            // Re-number remaining items
            document.querySelectorAll('.item-no').forEach((itemNoSpan, index) => {
                itemNoSpan.textContent = index + 1;
            });
            updateTotals();
        }
    });

    // Event listener for form submission (for demonstration)
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('견적서 제출 기능은 현재 미구현입니다. (콘솔 확인)');
        const formData = new FormData(quoteForm);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        document.querySelectorAll('.item-row').forEach((row, index) => {
            const description = row.querySelector('.description').value;
            const quantity = parseNumberFromCommas(row.querySelector('.quantity').value); 
            const unitPrice = parseNumberFromCommas(row.querySelector('.unitPrice').value); 
            const remarks = row.querySelector('.remarks').value; 
            console.log(`Item ${index + 1}: Description=${description}, Quantity=${quantity}, UnitPrice=${unitPrice}, Remarks=${remarks}`);
        });
    });
});