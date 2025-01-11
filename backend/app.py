from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Specify the path to the .env file in the root directory
load_dotenv(dotenv_path="../.env")


app = Flask(__name__)
CORS(app)

# Get API key and Base URL from environment variables
API_KEY = os.getenv("REACT_APP_API_KEY")
BASE_URL = os.getenv("BASE_URL")

@app.route('/filter-data', methods=['GET'])
def filter_data():
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
        api_url = f"{BASE_URL}/{data_type}/{symbol}?period={period}&apikey={API_KEY}"
        response = requests.get(api_url)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data"}), 500

        data = response.json()
        filtered_data = [
            item for item in data
            if (start_year <= int(item['date'][:4]) <= end_year and
                min_revenue <= item['revenue'] <= max_revenue and
                min_net_income <= item['netIncome'] <= max_net_income)
        ]

        return jsonify(filtered_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
