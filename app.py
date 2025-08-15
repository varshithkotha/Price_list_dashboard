from flask import Flask, render_template, request, redirect, url_for, flash
import json
import uuid

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_change_me' 

DATA_FILE = 'data.json'

# --- Helper Functions (No changes here) ---
def read_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# --- Flask Routes ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pricelist')
def pricelist():
    items = read_data()
    sections = sorted(list(set(item['section'] for item in items)))
    return render_template('pricelist.html', items=items, sections=sections)

@app.route('/add', methods=['GET', 'POST'])
def add_item():
    if request.method == 'POST':
        new_item = {
            'id': str(uuid.uuid4()),
            'name': request.form['item_name'],
            'quantity': request.form['quantity'],
            'section': request.form['section'].strip().title(),
            'price': float(request.form['price'])
        }
        items = read_data()
        items.append(new_item)
        write_data(items)
        flash(f"Successfully added '{new_item['name']}'!", 'success')
        return redirect(url_for('pricelist'))
    return render_template('add_item.html')

@app.route('/delete/<item_id>', methods=['POST'])
def delete_item(item_id):
    items = read_data()
    item_to_delete = next((item for item in items if item['id'] == item_id), None)
    
    if item_to_delete:
        items = [item for item in items if item['id'] != item_id]
        write_data(items)
        flash(f"Successfully deleted '{item_to_delete['name']}'!", 'danger')
    else:
        flash('Item not found.', 'warning')
    return redirect(url_for('pricelist'))

# --- NEW ROUTE FOR EDITING ---
@app.route('/edit/<item_id>', methods=['POST'])
def edit_item(item_id):
    """Handles updating an existing item."""
    items = read_data()
    item_to_update = next((item for item in items if item['id'] == item_id), None)

    if item_to_update:
        # Update the item's details from the form
        item_to_update['name'] = request.form['item_name']
        item_to_update['quantity'] = request.form['quantity']
        item_to_update['section'] = request.form['section'].strip().title()
        item_to_update['price'] = float(request.form['price'])
        
        write_data(items)
        flash(f"Successfully updated '{item_to_update['name']}'!", 'success')
    else:
        flash('Item not found, could not update.', 'warning')
        
    return redirect(url_for('pricelist'))


if __name__ == '__main__':
    app.run(debug=True)