document.addEventListener('DOMContentLoaded', function () {
    
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Search & Filter Logic ---
    const searchBar = document.getElementById('searchBar');
    const sectionFilter = document.getElementById('sectionFilter');
    const priceListContainer = document.getElementById('priceListContainer');
    
    if (priceListContainer) {
        const cards = priceListContainer.getElementsByClassName('price-card');

        function filterItems() {
            const searchTerm = searchBar.value.toLowerCase();
            const selectedSection = sectionFilter.value;

            for (let card of cards) {
                const itemName = card.dataset.name.toLowerCase();
                const itemSection = card.dataset.section;

                const nameMatch = itemName.includes(searchTerm);
                const sectionMatch = (selectedSection === 'all' || itemSection === selectedSection);
                
                if (nameMatch && sectionMatch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            }
        }

        if (searchBar) searchBar.addEventListener('input', filterItems);
        if (sectionFilter) sectionFilter.addEventListener('change', filterItems);
    }


    // --- Edit Modal Logic ---
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const editItemForm = document.getElementById('editItemForm');

    if (priceListContainer && editModal) {
        priceListContainer.addEventListener('click', function(event) {
            const editButton = event.target.closest('.btn-edit');
            if (editButton) {
                // Get data from the button's data attributes
                const id = editButton.dataset.id;
                const name = editButton.dataset.name;
                const quantity = editButton.dataset.quantity;
                const section = editButton.dataset.section;
                const price = editButton.dataset.price;

                // Populate the form inside the modal
                editItemForm.action = `/edit/${id}`;
                document.getElementById('edit_item_name').value = name;
                document.getElementById('edit_quantity').value = quantity;
                document.getElementById('edit_section').value = section;
                document.getElementById('edit_price').value = price;
                
                // Show the modal
                editModal.style.display = 'block';
            }
        });

        // Close the modal when the 'x' is clicked
        if (closeModalBtn) {
            closeModalBtn.onclick = function() {
                editModal.style.display = 'none';
            }
        }

        // Close the modal if the user clicks outside of it
        window.onclick = function(event) {
            if (event.target == editModal) {
                editModal.style.display = 'none';
            }
        }
    }
});