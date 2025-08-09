document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemButton = document.getElementById('addItem');
    const removeItemButton = document.getElementById('removeItem');
    const grandTotalSpan = document.getElementById('grandTotal');
    const quoteForm = document.getElementById('quoteForm');
    const quoteDateInput = document.getElementById('quoteDate');
    const companyInfoInput = document.getElementById('companyInfo');
    const customerInfoInput = document.getElementById('customerInfo');

    let itemCounter = 0;

    // Helper function to remove commas for calculation
    const parseFormattedNumber = (value) => {
        const stringValue = String(value).replace(/,/g, '');
        // Allow a single '-' to be typed
        if (stringValue === '-') {
            return 0; // Treat as 0 for calculation
        }
        return parseFloat(stringValue) || 0;
    };

    // Function to update item total and grand total
    const updateTotals = () => {
        let grandTotal = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
            const unitPrice = parseFormattedNumber(row.querySelector('.unitPrice').value);
            const itemTotal = quantity * unitPrice;
            row.querySelector('.item-total').textContent = itemTotal.toLocaleString();
            grandTotal += itemTotal;
        });
        grandTotalSpan.textContent = `${grandTotal.toLocaleString()}원`;
    };

    // Function to handle the unit price input formatting
    const handleUnitPriceInput = (e) => {
        const input = e.target;
        let value = input.value;
        
        // Allow only numbers, commas, and a leading minus sign
        let sanitizedValue = value.replace(/[^\d,-]/g, '');
        
        // Do not format if the value is just a minus sign
        if (sanitizedValue === '-') {
            input.value = '-';
            updateTotals();
            return;
        }

        // Remove commas for parsing
        let numberValue = parseFormattedNumber(sanitizedValue);

        // Format the number with commas
        let formattedValue = numberValue.toLocaleString();

        // Update the input field with the formatted value
        input.value = formattedValue;
        updateTotals();
    };

    // Function to add a new item row
    const addItemRow = () => {
        itemCounter++;
        const itemRow = document.createElement('div');
        itemRow.classList.add('item-row');
        // Use type="number" for quantity and type="text" for unitPrice
        itemRow.innerHTML = `
            <span class="item-no">${itemCounter}</span>
            <input type="text" class="description" placeholder="품명" required>
            <input type="number" class="quantity" placeholder="수량" required>
            <input type="text" class="unitPrice" placeholder="단가" value="0" required>
            <span class="item-total">0</span>
        `;
        itemsContainer.appendChild(itemRow);

        // Add event listeners for new row
        itemRow.querySelector('.quantity').addEventListener('input', updateTotals);
        itemRow.querySelector('.unitPrice').addEventListener('input', handleUnitPriceInput);

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

    // Event listener for Remove Item button
    removeItemButton.addEventListener('click', () => {
        const allItemRows = document.querySelectorAll('.item-row');
        if (allItemRows.length > 1) {
            allItemRows[allItemRows.length - 1].remove();
            itemCounter--;
            document.querySelectorAll('.item-no').forEach((itemNoSpan, index) => {
                itemNoSpan.textContent = index + 1;
            });
            updateTotals();
        }
    });

    // Event listener for form submission
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('화면 캡쳐했습니다');
        console.log(`Quote Date: ${quoteDateInput.value}`);
        console.log(`Company Info: ${companyInfoInput.value}`);
        console.log(`Customer Info: ${customerInfoInput.value}`);
        // Log item rows as before
        document.querySelectorAll('.item-row').forEach((row, index) => {
            const description = row.querySelector('.description').value;
            const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
            const unitPrice = parseFormattedNumber(row.querySelector('.unitPrice').value);
            console.log(`Item ${index + 1}: Description=${description}, Quantity=${quantity}, UnitPrice=${unitPrice}`);
        });
    });

    // Capture functionality
    const captureButton = document.getElementById('captureBtn');
    const containerToCapture = document.querySelector('.container');

    captureButton.addEventListener('click', () => {
        // Hide elements that should not be in the capture
        const elementsToHide = document.querySelectorAll('.no-capture');
        elementsToHide.forEach(el => el.classList.add('hide-for-capture'));

        html2canvas(containerToCapture, {
            scale: 2, // Higher resolution
            useCORS: true
        }).then(canvas => {
            // Show the hidden elements again
            elementsToHide.forEach(el => el.classList.remove('hide-for-capture'));

            // --- New Share/Download Logic ---
            canvas.toBlob(function(blob) {
                const file = new File([blob], "견적서.png", { type: "image/png" });
                const filesArray = [file];

                if (navigator.canShare && navigator.canShare({ files: filesArray })) {
                    // Use Web Share API
                    navigator.share({
                        files: filesArray,
                        title: '견적서',
                        text: '견적서 이미지 파일',
                    })
                    .then(() => console.log('Share was successful.'))
                    .catch((error) => console.log('Sharing failed', error));
                } else {
                    // Fallback to download
                    const link = document.createElement('a');
                    link.download = '견적서.png';
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    // Clean up the object URL
                    URL.revokeObjectURL(link.href);
                }
            }, 'image/png');
            alert('캡쳐완료하였습니다 보낼 곳에 붙여넣기 하세요');

        }).catch(err => {
            // Make sure to show elements again even if there's an error
            elementsToHide.forEach(el => el.classList.remove('hide-for-capture'));
            console.error('oops, something went wrong!', err);
            alert('캡쳐에 실패했습니다.');
        });
    });
});