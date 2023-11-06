from flask import Flask, render_template, request, jsonify
from functions import *

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    # load files 
    load_data()
    return render_template('index.html')

@app.route('/get_player_info', methods=['GET', 'POST'])
def get_player():
    if request.method == 'POST':
        data = request.get_json()
        steamid = data.get('steamid')
        
        # Check if it's a steamid or username.
        if not steamid.isdigit():
            steamid = get_steamid(steamid)
            if steamid is False:
                return jsonify({'error': 'No users found!'})

        player_info = get_player_info(steamid)

        if player_info:
            if player_info['communityvisibilitystate'] < 3:
                player_badges = 'Private'
            elif player_info['badges_count'] == 0:
                player_badges = 0
            else:
                player_badges = get_player_badges()

            response_data = {
                'player_info': player_info,
                'player_badges': player_badges
            }
            return jsonify(response_data)
        else:
            return jsonify({'error': 'No users found!'})

# get badges prices
@app.route('/get_badges_prices', methods=['GET'])
def get_badges():
    badges_data = get_badges_prices()
    if(badges_data):
        return jsonify(badges_data)

if __name__ == '__main__':
    app.run(debug=True)

