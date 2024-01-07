import requests
import os
from dotenv import load_dotenv
import json
import datetime
from tzlocal import get_localzone
from concurrent.futures import ThreadPoolExecutor

load_dotenv(override=True)
STEAM_API_KEY = os.getenv('STEAM_API_KEY')

badges_data = []
local_timezone = get_localzone()
session = requests.Session()

def load_data():
    global games
    global data
    response = requests.get('https://raw.githubusercontent.com/cristoferluch/Steam-Sale/main/badges.json')
    games = response.json()

def call_api(url):
    try:
        response = session.get(url)
        response.raise_for_status()
        return {"url": url, "status_code": response.status_code, "content": response.text}
    except requests.exceptions.HTTPError as e:
        return {"url": url, "error": f'HTTP Error: {e}'}
    except requests.exceptions.ConnectionError as e:
        return {"url": url, "error": f'Connection Error: {e}'}

def get_steamid(username):
    response = session.get(f'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={STEAM_API_KEY}&vanityurl={username}')
    data = response.json()
    if 'steamid' in data['response']:
        return data['response']['steamid']
    else:
        return False
    
def get_player_info(steamid):
    urls = [
        f'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steamid}',
        f'https://api.steampowered.com/IPlayerService/GetBadges/v1/?key={STEAM_API_KEY}&steamid={steamid}',
        f'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key={STEAM_API_KEY}&steamids={steamid}'
    ]

    executor = ThreadPoolExecutor(12)

    futures = []

    for url in urls:
        future = executor.submit(call_api, url)
        futures.append(future)

    results = [json.loads(future.result()["content"]) for future in futures]

    player_summaries = results[0]['response']['players']
    player_badges = results[1]['response']
    player_bans = results[2]['players']

    global badges_data

    player = player_summaries[0]
    badges_data = player_badges
    bans = player_bans[0]
    member_since = 0
    if 'timecreated' in player:
        time = player.get('timecreated')
        member_since = get_account_creation_time(time)
    

    return {
        'communityvisibilitystate': player.get('communityvisibilitystate', 'N/A'),
        'personaname': player.get('personaname', 'N/A'),
        'profileurl': player.get('profileurl', 'N/A'),
        'avatarfull': player.get('avatarfull', 'N/A'),
        'loccountrycode': player.get('loccountrycode', 'N/A'),
        'player_xp': badges_data.get('player_xp'),
        'player_level': badges_data.get('player_level'),
        'player_since': member_since,
        'player_xp_needed_to_level_up': badges_data.get('player_xp_needed_to_level_up'),
        'player_xp_needed_current_level': badges_data.get('player_xp_needed_current_level'),
        'badges_count': len(badges_data.get('badges', [])),
        'vac_ban': bans.get('VACBanned'),
        'steamid': steamid
    }

badges_by_id = {
	'1': {'name': 'Years of Service', 'appid': '753', 'badge_type': 'Special'},
	'2': {'name': 'Community Ambassador', 'appid': '753', 'badge_type': 'Special'},
	'3': {'name': 'The Potato Sack', 'appid': '753', 'badge_type': 'Special'},
	'4': {'name': 'The Great Steam Treasure Hunt', 'appid': '753', 'badge_type': 'Special'},
	'5': {'name': 'Steam Summer Camp', 'appid': '753', 'badge_type': 'Special'},
	'6': {'name': 'Steam Holiday Sale 2011', 'appid': '753', 'badge_type': 'Special'},
	'7': {'name': 'Steam Summer Sale 2012', 'appid': '753', 'badge_type': 'Special'},
	'8': {'name': '	Steam Holiday Sale 2012', 'appid': '753', 'badge_type': 'Special'},
	'9':  {'name': 'Steam Community Translator', 'appid': '753', 'badge_type': 'Special'},
	'10': {'name': 'Steam Community Moderator', 'appid': '753', 'badge_type': 'Special'},
	'11': {'name': 'Valve Employee', 'appid': '753', 'badge_type': 'Special'},
	'12': {'name': 'Steamworks Developer', 'appid': '753', 'badge_type': 'Special'},
	'13': {'name': 'Owned Games', 'appid': '753', 'badge_type': 'Special'},
	'14': {'name': 'Trading Card Beta Tester', 'appid': '753', 'badge_type': 'Special'},
	'15': {'name': 'Steam Hardware Beta', 'appid': '753', 'badge_type': 'Special'},
	'16': {'name': 'STEAM SUMMER ADVENTURE 2014 - Red Team', 'appid': '753', 'badge_type': 'Special'},
	'17': {'name': 'STEAM SUMMER ADVENTURE 2014 - Blue Team', 'appid': '753', 'badge_type': 'Special'},
	'18': {'name': 'STEAM SUMMER ADVENTURE 2014 - Pink Team', 'appid': '753', 'badge_type': 'Special'},
	'19': {'name': 'STEAM SUMMER ADVENTURE 2014 - Green Team', 'appid': '753', 'badge_type': 'Special'},
	'20': {'name': 'STEAM SUMMER ADVENTURE 2014 - Purple Team', 'appid': '753', 'badge_type': 'Special'},
	'21': {'name': 'Gem Maker', 'appid': '753', 'badge_type': 'Special'},
	'22': {'name': '2014 Holiday Profile Recipient', 'appid': '753', 'badge_type': 'Special'},
	'23': {'name': 'Monster Summer', 'appid': '753', 'badge_type': 'Special'},
	'24': {'name': 'Red Herring', 'appid': '753', 'badge_type': 'Special'},
	'25': {'name': 'Steam Awards Nomination Committee 2016', 'appid': '753', 'badge_type': 'Special'},
	'26': {'name': 'Sticker Completionist', 'appid': '753', 'badge_type': 'Special'},
	'27': {'name': 'Steam Awards Nomination Committee 2017', 'appid': '753', 'badge_type': 'Special'},
	'28': {'name': 'Spring Cleaning Event 2018', 'appid': '753', 'badge_type': 'Special'},
	'29': {'name': 'Salien', 'appid': '753', 'badge_type': 'Special'},
	'30': {'name': 'Retired Community Moderator', 'appid': '753', 'badge_type': 'Special'},
	'31': {'name': 'Steam Awards Nomination Committee 2018', 'appid': '753', 'badge_type': 'Special'},
	'33': {'name': 'Winter 2018 Knick-Knack Collector', 'appid': '753', 'badge_type': 'Special'},
	'34': {'name': 'Lunar New Year 2019', 'appid': '753', 'badge_type': 'Special'},
	'36': {'name': 'Spring Cleaning Event 2019', 'appid': '753', 'badge_type': 'Special'},
	'37': {'name': 'Steam Grand Prix 2019', 'appid': '1095000', 'badge_type': 'Special'},
	'38': {'name': 'Steam Grand Prix 2019 - Team Hare', 'appid': '1095000', 'badge_type': 'Special'},
	'39': {'name': 'Steam Grand Prix 2019 - Team Tortoise', 'appid': '1095000', 'badge_type': 'Special'},
	'40': {'name': 'Steam Grand Prix 2019 - Team Corgi', 'appid': '1095000', 'badge_type': 'Special'},
	'41': {'name': 'Steam Grand Prix 2019 - Team Team Cockatiel', 'appid': '1095000', 'badge_type': 'Special'},
	'42': {'name': 'Steam Grand Prix 2019 - Team Pig', 'appid': '1095000', 'badge_type': 'Special'},
	'43': {'name': 'Steam Awards Nomination Committee 2019', 'appid': '753', 'badge_type': 'Special'},
	'44': {'name': 'Steam Winter Sale 2019', 'appid': '1195690', 'badge_type': 'Special'},
	'45': {'name': 'Steamville 2019 Badge', 'appid': '753', 'badge_type': 'Special'},
	'46': {'name': 'Lunar New Year 2020', 'appid': '1223590', 'badge_type': 'Special'},
	'47': {'name': 'Spring Cleaning Event 2020', 'appid': '1355220', 'badge_type': 'Special'},
	'48': {'name': 'Community Contributor', 'appid': '753', 'badge_type': 'Special'},
	'49': {'name': 'Community Patron', 'appid': '753', 'badge_type': 'Special'},
	'50': {'name': 'Steam Awards Nomination Committee 2020', 'appid': '753', 'badge_type': 'Special'},
	'51': {'name': 'The Masked Avenger', 'appid': '753', 'badge_type': 'Special'},
	'52': {'name': 'The Trailblazing Explorer', 'appid': '753', 'badge_type': 'Special'},
	'53': {'name': 'The Gorilla Scientist', 'appid': '753', 'badge_type': 'Special'},
	'54': {'name': 'The Paranormal Professor', 'appid': '753', 'badge_type': 'Special'},
	'55': {'name': 'The Ghost Detective', 'appid': '753', 'badge_type': 'Special'},
	'56': {'name': 'Steam Awards Nomination Committee 2021', 'appid': '753', 'badge_type': 'Special'},
	'57': {'name': 'Steam Awards Nomination Committee 2021 Classic Edition', 'appid': '753', 'badge_type': 'Special'},
	'59': {'name': '2022 Steam Cup', 'appid': '753', 'badge_type': 'Special'},
	'60': {'name': '2022 Steam Next Fest June Edition', 'appid': '2027450', 'badge_type': 'Special'},
	'61': {'name': "Clorthax's Paradox Party Badge", 'appid': '753', 'badge_type': 'Special'},
	'62': {'name': '2022 Steam Next Fest October Edition', 'appid': '2174530', 'badge_type': 'Special'},
	'63': {'name': 'Steam Awards Nomination Committee 2022', 'appid': '753', 'badge_type': 'Special'},
	'64': {'name': 'Steam Replay 2022', 'appid': '753', 'badge_type': 'Special'},
	'65': {'name': 'Steam Awards Nomination Committee 2023', 'appid': '753', 'badge_type': 'Special'},
	'66': {'name': 'Steam Year In Review 2023', 'appid': '753', 'badge_type': 'Special'},
}

badges_by_appid = {
    '2750340': {'name': 'Winter Collection - 2023', 'badge_type': 'Seasonal'},
    '2460510': {'name': 'Summer Collection - 2023', 'badge_type': 'Seasonal'},
    '2243810': {'name': 'Winter Collection - 2022', 'badge_type': 'Seasonal'},
    '2055870': {'name': 'Summer Collection - 2022', 'badge_type': 'Seasonal'},
    '1846860': {'name': 'Winter Sale 2021', 'badge_type': 'Seasonal'},
    '1659580': {'name': 'Summer Collection - 2021', 'badge_type': 'Seasonal'},
    '1615900': {'name': 'Spring Collection - 2021', 'badge_type': 'Seasonal'},
    '1492660': {'name': 'Winter Collection - 2020', 'badge_type': 'Seasonal'},
    '1263950': {'name': 'The Debut Collection', 'badge_type': 'Seasonal'},
    '2640280': {'name': 'Winter Sale 2023', 'badge_type': 'Event'},
    '2459330': {'name': 'Summer In The City', 'badge_type': 'Event'},
    '2243720': {'name': 'The Steam Awards - 2022', 'badge_type': 'Event'},
    '2021850': {'name': 'Steam 3000', 'badge_type': 'Event'},
    '179776': {'name': 'The Steam Awards - 2021', 'badge_type': 'Event'},
    '1658760': {'name': 'Forge Your Fate', 'badge_type': 'Event'},
    '1465680': {'name': 'The Steam Awards - 2020', 'badge_type': 'Event'},
    '1343890': {'name': 'Summer Road Trip', 'badge_type': 'Event'},
    '1195670': {'name': 'The Steam Awards - 2019', 'badge_type': 'Event'},
    '991980': {'name': 'The Steam Winter Sale - 2018', 'badge_type': 'Event'},
    '876740': {'name': 'Intergalactic Steam Summer Sale', 'badge_type': 'Event'},
    '762800': {'name': 'The Steam Awards - 2017', 'badge_type': 'Event'},
    '639900': {'name': 'Steam Summer 2017', 'badge_type': 'Event'},
    '566020': {'name': 'Summer Sale 2016', 'badge_type': 'Event'},
    '480730': {'name': 'Holiday Sale 2015', 'badge_type': 'Event'},
    '425280': {'name': 'Monster Summer Sale', 'badge_type': 'Event'},
    '368020': {'name': '2015: Monster Summer Sale', 'badge_type': 'Event'},
    '335590': {'name': 'Holiday Sale 2014', 'badge_type': 'Event'},
    '303700': {'name': 'Summer Sale 2014', 'badge_type': 'Event'},
    '267420': {'name': 'Holiday Sale 2013', 'badge_type': 'Event'},
    '245070': {'name': 'Steam Summer Getaway', 'badge_type': 'Event'},
}

def timestamp_from_date(date_string):
    try:
        datetime_obj = datetime.datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S')
        timestamp = datetime_obj.timestamp()
        return int(timestamp)
    except ValueError:
        print("Formato de data e hora inválido. Use 'Y-m-d H:M:S'.")

def current_system_time():
    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime('%Y-%m-%d %H:%M:%S')
    return formatted_time

def calculate_time_difference_minutes(timestamp1, timestamp2):
    return abs(timestamp1 - timestamp2) // 60

def badge_completion_time(badge):
    epoch_time = badge + 0 * 60 * 60  
    converted_date = datetime.datetime.fromtimestamp(epoch_time, local_timezone)

    return converted_date.strftime('%Y-%m-%d %H:%M:%S')

def get_account_creation_time(time):
    epoch_time = time + 0 * 60 * 60  
    converted_date = datetime.datetime.fromtimestamp(epoch_time, local_timezone)

    return converted_date.strftime('%Y-%m-%d')

def get_player_badges():
    player_badges = []
    badge_info = ''
    
    for badge in badges_data['badges']:
        badge_appid = str(badge.get('appid'))
        badge_appid_int = badge.get('appid')
        badge_id = str(badge.get('badgeid'))

        if badge_appid_int is None:
            if badge_id in badges_by_id:
                badge_info = badges_by_id[badge_id]
        elif badge_appid in badges_by_appid:
            badge_info = badges_by_appid[badge_appid]
        elif badge_appid in games:
            badge_info = games[badge_appid]

        completion_time = badge_completion_time(badge.get('completion_time'))

        badge_type = badge_info.get('badge_type', 'Game')

        border_color = badge.get('border_color')
        badge_border = 'Foil' if border_color == 1 else 'Standard' if border_color == 0 else 'None'

        player_badges.append({
            'appid': badge_appid,
            'badgeid': badge['badgeid'],
            'border': badge_border,
            'completion_time': completion_time,
            'level': badge['level'],
            'name': badge_info.get('name'),
            'scarcity': badge['scarcity'],
            'type': badge_type,
            'xp': badge['xp'],
        })

    player_badges.sort(key=lambda x: x["name"])
   
    return player_badges

def get_badges_prices():
    
    badges_prices = []

    for badge in games:

        current_time = current_system_time()
        timestamp_atual = timestamp_from_date(current_time)

        if games[badge]['badge_price']['Standard'] != 0.0 and games[badge]['badge_price']['Standard'] is not None and games[badge]['badge_price']['Standard'] != '':
            
            # return in minutos
            if games[badge]['last_update'] != '' and games[badge]['last_update'] is not None:
                last_update = int(games[badge]['last_update'])
                last_update = calculate_time_difference_minutes(timestamp_atual, last_update)

                original_price = games[badge]['game_price']['original_price']
                discount_price = games[badge]['game_price']['discount_price']

                if original_price > discount_price:
                    game_price = discount_price
                else:
                    game_price = original_price

            badges_prices.append({
                "appid": badge,
                "name": games[badge]['name'],
                "cards": games[badge]['cards'],
                "standard": games[badge]['badge_price']['Standard'],
                "foil": games[badge]['badge_price']['Foil'],
                "booster_pack": games[badge]['badge_price']['Booster_Pack'],
                "game_price": game_price,
                "release_date": games[badge]['release_date'],
                "last_update": last_update
            })

    return badges_prices

