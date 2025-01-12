from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path="../.env")

# Initialize Flask app
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

# Get API key and Base URL from environment variables
API_KEY = os.getenv("REACT_APP_API_KEY")
BASE_URL = os.getenv("BASE_URL")


@app.route('/filter-data', methods=['GET'])
def filter_data():
    # Get query parameters with defaults
    symbol = request.args.get('symbol', 'AAPL')
    data_type = request.args.get('type', 'income-statement')
    period = request.args.get('period', 'annual')
    start_year = int(request.args.get('start_year', 2020))
    end_year = int(request.args.get('end_year', 2024))
    min_revenue = float(request.args.get('min_revenue', 0))
    max_revenue = float(request.args.get('max_revenue', float('inf')))
    min_net_income = float(request.args.get('min_net_income', 0))
    max_net_income = float(request.args.get('max_net_income', float('inf')))

    try:
        # Construct the external API URL
        api_url = f"{BASE_URL}/{data_type}/{symbol}?period={period}&apikey={API_KEY}"
        response = requests.get(api_url)

        # Check if the response is successful
        if response.status_code != 200:
            return jsonify({"error": f"Failed to fetch data from API. Status code: {response.status_code}"}), 500

        # Parse the API response
        data = response.json()

        # Ensure the response is a list
        if not isinstance(data, list):
            return jsonify({"error": "Unexpected data format received from API. Expected a list."}), 500

        # Filter the data based on criteria
        filtered_data = [
            item for item in data
            if (start_year <= int(item.get('date', '')[:4]) <= end_year and
                min_revenue <= item.get('revenue', float('inf')) <= max_revenue and
                min_net_income <= item.get('netIncome', float('inf')) <= max_net_income)
        ]

        return jsonify(filtered_data)

    except requests.exceptions.RequestException as req_err:
        # Handle request exceptions (e.g., timeout, connection issues)
        return jsonify({"error": f"Request error: {str(req_err)}"}), 500

    except ValueError as val_err:
        # Handle value conversion errors
        return jsonify({"error": f"Value error: {str(val_err)}"}), 500

    except Exception as e:
        # General exception handling
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# Serve React frontend for all other routes
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == '__main__':
    app.run(debug=True)
