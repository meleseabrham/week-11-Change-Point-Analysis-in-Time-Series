from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

# Helper to find data relative to the project root
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def load_prices():
    path = os.path.join(ROOT_DIR, 'data', 'raw', 'BrentOilPrices.csv')
    df = pd.read_csv(path)
    # The format in BrentOilPrices.csv is '20-May-87'
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%b-%y', errors='coerce')
    df = df.dropna().sort_values('Date')
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    return df

def load_events():
    path = os.path.join(ROOT_DIR, 'data', 'raw', 'geopolitical_events.csv')
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient='records')
    return []

def load_analysis_results():
    path = os.path.join(ROOT_DIR, 'data', 'task_2_results', 'model_summary.csv') # Note: might be model_summary or similar
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient='records')
    return {}

@app.route('/api/prices', methods=['GET'])
def get_prices():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    df = load_prices()
    
    if start_date:
        df = df[df['Date'] >= start_date]
    if end_date:
        df = df[df['Date'] <= end_date]
        
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(load_events())

@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    # Return impact report data
    report_path = os.path.join(ROOT_DIR, 'data', 'task_2_results', 'impact_report_2008.txt')
    if os.path.exists(report_path):
        with open(report_path, 'r') as f:
            content = f.read()
        return jsonify({"report": content})
    return jsonify({"report": "No analysis report found."})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    df = load_prices()
    stats = {
        "avg_price": round(df['Price'].mean(), 2),
        "max_price": round(df['Price'].max(), 2),
        "min_price": round(df['Price'].min(), 2),
        "total_days": len(df)
    }
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
