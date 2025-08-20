from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# In-memory storage (replace with database in production)
schedules = []
djs = ['DJ Mike', 'DJ Sarah', 'DJ Alex', 'DJ Chris', 'DJ Maya']

def load_data():
    """Load data from JSON file if it exists"""
    global schedules
    if os.path.exists('schedules.json'):
        try:
            with open('schedules.json', 'r') as f:
                schedules = json.load(f)
        except:
            schedules = []

def save_data():
    """Save data to JSON file"""
    try:
        with open('schedules.json', 'w') as f:
            json.dump(schedules, f, indent=2)
    except:
        pass

def generate_id():
    """Generate a unique ID for new schedules"""
    return max([s.get('id', 0) for s in schedules], default=0) + 1

# API Routes
@app.route('/api/djs', methods=['GET'])
def get_djs():
    """Get list of all DJs"""
    return jsonify({
        'success': True,
        'djs': djs
    })

@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    """Get all schedules"""
    return jsonify({
        'success': True,
        'schedules': schedules
    })

@app.route('/api/schedules', methods=['POST'])
def add_schedule():
    """Add a new schedule"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['date', 'time', 'location', 'dj']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'{field} is required'
                }), 400
        
        # Validate DJ exists
        if data['dj'] not in djs:
            return jsonify({
                'success': False,
                'error': 'Invalid DJ selected'
            }), 400
        
        # Validate date format
        try:
            datetime.strptime(data['date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }), 400
        
        # Create new schedule
        new_schedule = {
            'id': generate_id(),
            'date': data['date'],
            'time': data['time'],
            'location': data['location'].strip(),
            'dj': data['dj']
        }
        
        schedules.append(new_schedule)
        save_data()
        
        return jsonify({
            'success': True,
            'schedule': new_schedule,
            'message': 'Schedule added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Server error occurred'
        }), 500

@app.route('/api/schedules/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    """Delete a schedule by ID"""
    global schedules
    
    # Find schedule
    schedule_to_delete = None
    for schedule in schedules:
        if schedule['id'] == schedule_id:
            schedule_to_delete = schedule
            break
    
    if not schedule_to_delete:
        return jsonify({
            'success': False,
            'error': 'Schedule not found'
        }), 404
    
    # Remove schedule
    schedules = [s for s in schedules if s['id'] != schedule_id]
    save_data()
    
    return jsonify({
        'success': True,
        'message': 'Schedule deleted successfully'
    })

@app.route('/api/schedules/<int:schedule_id>', methods=['PUT'])
def update_schedule(schedule_id):
    """Update a schedule by ID"""
    try:
        data = request.get_json()
        
        # Find schedule
        schedule_to_update = None
        for i, schedule in enumerate(schedules):
            if schedule['id'] == schedule_id:
                schedule_to_update = i
                break
        
        if schedule_to_update is None:
            return jsonify({
                'success': False,
                'error': 'Schedule not found'
            }), 404
        
        # Validate fields if provided
        if 'dj' in data and data['dj'] not in djs:
            return jsonify({
                'success': False,
                'error': 'Invalid DJ selected'
            }), 400
        
        if 'date' in data:
            try:
                datetime.strptime(data['date'], '%Y-%m-%d')
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid date format. Use YYYY-MM-DD'
                }), 400
        
        # Update schedule
        schedule = schedules[schedule_to_update]
        if 'date' in data:
            schedule['date'] = data['date']
        if 'time' in data:
            schedule['time'] = data['time']
        if 'location' in data:
            schedule['location'] = data['location'].strip()
        if 'dj' in data:
            schedule['dj'] = data['dj']
        
        save_data()
        
        return jsonify({
            'success': True,
            'schedule': schedule,
            'message': 'Schedule updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Server error occurred'
        }), 500

@app.route('/api/dj-schedules/<dj_name>', methods=['GET'])
def get_dj_schedules(dj_name):
    """Get schedules for a specific DJ"""
    if dj_name not in djs:
        return jsonify({
            'success': False,
            'error': 'DJ not found'
        }), 404
    
    dj_schedules = [s for s in schedules if s['dj'] == dj_name]
    
    return jsonify({
        'success': True,
        'dj': dj_name,
        'schedules': dj_schedules
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'DJ Agency API is running',
        'timestamp': datetime.now().isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    load_data()
    print("DJ Agency API starting...")
    print("Available endpoints:")
    print("  GET    /api/djs")
    print("  GET    /api/schedules")
    print("  POST   /api/schedules")
    print("  PUT    /api/schedules/<id>")
    print("  DELETE /api/schedules/<id>")
    print("  GET    /api/dj-schedules/<dj_name>")
    print("  GET    /api/health")
    
    app.run(debug=True, port=5000)
