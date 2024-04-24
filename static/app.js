const player_image = document.querySelector('#player_image');
const player_name = document.querySelector('#player_name');
const player_country = document.querySelector('#player_country');
const steam_url = document.querySelector("#steam_url");
const steamdb_url = document.querySelector("#steamdb_url");
const steamladder_url = document.querySelector("#steamladder_url");
const player_xp = document.querySelector("#player_xp");
const player_total_badges = document.querySelector("#player_total_badges");
const player_level = document.querySelector("#player_level");
const player_info_div = document.querySelector(".player_info");
const player_since = document.querySelector("#member_since");
const vac_status = document.querySelector("#vac_status");
const span_vac_status = document.querySelector("#span_vac_status");
const tbody_player_badges_data = document.querySelector(".tbody_player_badges");
const tbody_badges_prices_data = document.querySelector(".tbody_badges_prices");
const search_player_game = document.querySelector("#search_player_game");
const search_badge = document.querySelector("#search_badge");
const loader = document.querySelector(".loader");
const checkbox = document.querySelector("#checkbox");
const btn_player_badges = document.querySelector("#player_badges");
const btn_badges_prices = document.querySelector("#badges_prices");
const btn_level_calculator = document.querySelector("#level_calculator");
const table_badges_prices = document.querySelector('.table_badges_prices');
const table_player_badges = document.querySelector('.table_player_badges');
const div_level_calculator = document.querySelector('.level_calculator');
const booster_pack = document.querySelector("#booster_pack");
const emotes_backgrounds = document.querySelector("#emotes_backgrounds");
const friend_cap = document.querySelector("#friend_cap");
const game_coupons = document.querySelector("#game_coupons");
const showcases = document.querySelector("#showcases");
const current_level = document.querySelector("#current_level");
const target_level = document.querySelector("#target_level");
const friendPlayerLevelNum = document.querySelector(".friendPlayerLevelNum");
const player_level_calculator = document.querySelector("#player_level_calculator");
const xp_level_up = document.querySelector("#xp_level_up");
const sets_needed = document.querySelector("#sets_needed");
const xp_needed = document.querySelector("#xp_needed");
const btn_add_level_1 = document.querySelector("#btn1");    
const btn_add_level_10 = document.querySelector("#btn10");
const btn_add_level_100 = document.querySelector("#btn100");
const btn_increase_current_level = document.querySelector("#btn_increase_current_level");
const btn_decrease_current_level = document.querySelector("#btn_decrease_current_level");
const btn_increase_target_level = document.querySelector("#btn_increase_target_level");
const btn_decrease_target_level = document.querySelector("#btn_decrease_target_level");
const profile = document.querySelector(".profile");
const div_player_image = document.querySelector(".div_player_image");
const btn_submit = document.querySelector("#btn_submit");
const steamid = document.querySelector("#steamid");
let steamid_player = "";
let isUserLoggedIn = false;

const total_player_xp = 0;
let xp = 0;

const batchSize = 50;

let player_badges_data = [];
let badges_prices_data = [];
let badges_prices_data_reset = [];

draw_player_rewards(current_level.value);
update_image_level(player_level_calculator, 0);
get_data_badges_prices();

//Fech data from player
document.querySelector("form").addEventListener('submit', async function (e) {
    e.preventDefault();

    reset_page();

    if(steamid != ''){
        player_name.textContent = '';
        loader.style.display = 'block';
        //Get player information
        const response = await fetch(`/get_player_info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ steamid: (steamid.value).toLowerCase().trim() })
        });
    
        if (response.ok) {
            const data = await response.json();
            if ('error' in data) {
                loader.style.display = 'none';
                player_name.textContent = " No users found!";
                player_name.style = 'color: red'
            } else {
                
                const player_info = data.player_info;
                steamid_player = player_info['steamid'];
                const player_badges = data.player_badges;
                draw_player_information(player_info, player_badges)
                if (player_badges != 'Private' && player_badges != 0) {
                    player_badges_data = player_badges
                    draw_player_badges_data(player_badges_data)
                    setupInfiniteScroll(tbody_player_badges_data, player_badges_data, draw_player_badges_data);
                }
            }
        } else {
            console.error('Erro na solicitação:', response.status, response.statusText);
        }
    } else {
        alert("erro")
    }
    //loading...
});

//Fech data from badges prices
async function get_data_badges_prices() {
    const response = await fetch(`/get_badges_prices`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    
    badges_prices_data = await response.json();
    badges_prices_data_reset = badges_prices_data;
    draw_all_badges(badges_prices_data);
    setupInfiniteScroll(tbody_badges_prices_data, badges_prices_data, draw_all_badges);
}

// Draw rewards on div level_calculator
function draw_player_rewards(level) {
    
    const level_split = split_number_level(level)
    let level_normal = level;
    level = level_split.hundreds + level_split.tens

    level_normal = Number(level_normal)

    const sets = Number(sets_needed.innerHTML);
    const booster = (level / 10) * 20;
    const emotes_background = sets * 2;
 
    let friends = 250 + (level_normal * 5);
   
    const coupons = sets;
    
    if (friends > 2000){
        friends = 2000;
    }
        
    let show_cases = (level / 10);
    if (show_cases > 20){
        show_cases = 20;
    }
        
    booster_pack.innerHTML = `+${booster}%`;
    emotes_backgrounds.innerHTML = emotes_background;
    friend_cap.innerHTML = friends;
    game_coupons.innerHTML = coupons;
    showcases.innerHTML = show_cases;
}

// Draw player badges on table_player_badges
async function draw_player_badges_data(data) {
    
    const tbody_player_badges_data = document.querySelector("tbody");

    const fragment = document.createDocumentFragment();

    const start = tbody_player_badges_data.children.length;
    
    for (let i = start; i < start + batchSize && i < data.length; i++) {
        const td_name = document.createElement('td');
        td_name.textContent = data[i].name;

        const td_level = document.createElement('td');
        td_level.textContent = data[i].level;

        const td_xp = document.createElement('td');
        td_xp.textContent = data[i].xp;

        const td_border_span = document.createElement('span');
        td_border_span.textContent = data[i].border;

        if (data[i].type == 'Game') {
            if (data[i].border == 'Standard') {
                td_border_span.style.background = '#163b6f'
            } else {
                td_border_span.style.background = '#707171'
            }
        } else {
            if (data[i].border == 'Foil') {
                
                td_border_span.style.background = '#dab44f'
            } else {
                td_border_span.style.background = '#171d25'
            }
        }

        const td_border = document.createElement('td');
        td_border.append(td_border_span);

        const td_type = document.createElement('td');
        td_type.textContent = data[i].type;

        const td_appid = document.createElement('td');
        td_appid.textContent = data[i].appid;

        const td_scarcity = document.createElement('td');
        td_scarcity.textContent = data[i].scarcity;

        const link_steam = document.createElement('a');
        link_steam.textContent = 'B';

        if (data[i].border == 'Foil') {
            link_steam.href = `https://steamcommunity.com/profiles/${steamid_player}/gamecards/${data[i].appid}/?border=1`;
        } else if (data[i].badgeid >= 1 && data[i].appid == '753') {
            link_steam.href = `https://steamcommunity.com/profiles/${steamid_player}/badges/${data[i].badgeid}`;
        } else {
            link_steam.href = `https://steamcommunity.com/profiles/${steamid_player}/gamecards/${data[i].appid}`;
        }
        link_steam.setAttribute('target', '_blank');

        const link_exchange = document.createElement('a');
        link_exchange.textContent = 'E';
        link_exchange.href = 'https://www.steamcardexchange.net/index.php?gamepage-appid-' + data[i].appid;
        link_exchange.setAttribute('target', '_blank');

        const link_steam_market = document.createElement('a');
        link_steam_market.textContent = 'M';
        link_steam_market.href = `https://steamcommunity.com/market/search?category_753_Game%5B%5D=tag_app_${data[i].appid}&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753`
        if(data[i].border == 'Foil'){
            link_steam_market.href = `https://steamcommunity.com/market/search?q=&category_753_Event%5B%5D=any&category_753_Game%5B%5D=tag_app_${data[i].appid}&category_753_cardborder%5B%5D=tag_cardborder_1&category_753_item_class%5B%5D=tag_item_class_2&appid=753`
        }
        link_steam_market.setAttribute('target', '_black')

        const td_links = document.createElement('td');
        td_links.setAttribute('class', 'links')
        td_links.append(link_steam);
        td_links.append(link_steam_market);
        td_links.append(link_exchange);

        const td_reached = document.createElement('td');
        td_reached.textContent = data[i].completion_time;

        const tr_badge = document.createElement('tr');
        tr_badge.append(td_name);
        tr_badge.append(td_level);
        tr_badge.append(td_xp);
        tr_badge.append(td_border);
        tr_badge.append(td_type);
        tr_badge.append(td_appid);
        tr_badge.append(td_scarcity);
        tr_badge.append(td_links);
        tr_badge.append(td_reached);

        fragment.appendChild(tr_badge);
    }
    tbody_player_badges_data.appendChild(fragment);

}

// Draw all badges on table_badges_prices
async function draw_all_badges(data) {
    const tbody_badges_prices = document.querySelector(".tbody_badges_prices");
    const fragment = document.createDocumentFragment();
    const start = tbody_badges_prices.children.length;

    for (let i = start; i < start + batchSize && i < data.length; i++) {

        const td_name = document.createElement('td');
        td_name.textContent = data[i].name;

        const td_cards = document.createElement('td');
        td_cards.textContent = data[i].cards;

        const link_standard = document.createElement('a');
        link_standard.href = `https://steamcommunity.com/market/search?q=&category_753_Event%5B%5D=any&category_753_Game%5B%5D=tag_app_${data[i].appid}&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753`;
        link_standard.textContent = parseFloat(data[i].standard).toLocaleString('US', { style: 'currency', currency: 'USD', });
        link_standard.setAttribute('class', 'links_prices')
        link_standard.setAttribute('target', '_blank');

        const td_price_standard = document.createElement('td');
        td_price_standard.appendChild(link_standard);

        const link_foil = document.createElement('a');
        link_foil.href = `https://steamcommunity.com/market/search?q=&category_753_Event%5B%5D=any&category_753_Game%5B%5D=tag_app_${data[i].appid}&category_753_cardborder%5B%5D=tag_cardborder_1&category_753_item_class%5B%5D=tag_item_class_2&appid=753`;
        link_foil.textContent = parseFloat(data[i].foil).toLocaleString('US', { style: 'currency', currency: 'USD', });
        link_foil.setAttribute('class', 'links_prices')
        link_foil.setAttribute('target', '_blank');

        const td_price_foil = document.createElement('td');
        td_price_foil.appendChild(link_foil);

        const link_booster_pack = document.createElement('a');
        link_booster_pack.href = `https://steamcommunity.com/market/search?q=&category_753_Event%5B%5D=any&category_753_Game%5B%5D=tag_app_${data[i].appid}&category_753_item_class%5B%5D=tag_item_class_5&appid=753`;
        link_booster_pack.textContent = parseFloat(data[i].booster_pack).toLocaleString('US', { style: 'currency', currency: 'USD', });
        link_booster_pack.setAttribute('class', 'links_prices')
        link_booster_pack.setAttribute('target', '_blank');

        const td_price_booster_pack = document.createElement('td');
        td_price_booster_pack.appendChild(link_booster_pack);

        const td_game_price = document.createElement('td');
        const price = data[i].game_price;
        if (price == '0.00') {
            td_game_price.textContent = "FREE"
        } else {
            td_game_price.textContent = parseFloat(price).toLocaleString('US', { style: 'currency', currency: 'USD', });
        }
      
        const link_steam_store = document.createElement('a');
        link_steam_store.textContent = 'S';
        link_steam_store.href = 'https://store.steampowered.com/app/' + data[i].appid;
        link_steam_store.setAttribute('target', '_blank');
        link_steam_store.setAttribute('class', 'color-change');

        const link_steam_badge = document.createElement('a');
        link_steam_badge.textContent = 'B';
        link_steam_badge.href = 'https://steamcommunity.com/my/gamecards/' + data[i].appid;
        link_steam_badge.setAttribute('target', '_blank');
        link_steam_badge.setAttribute('class', 'color-change');

        const link_card_exchange = document.createElement('a');
        link_card_exchange.textContent = 'E';
        link_card_exchange.href = 'https://www.steamcardexchange.net/index.php?gamepage-appid-' + data[i].appid;
        link_card_exchange.setAttribute('target', '_blank');
        link_card_exchange.setAttribute('class', 'color-change');

        const link_steam_market = document.createElement('a');
        link_steam_market.textContent = 'M';
        link_steam_market.href = `https://steamcommunity.com/market/search?q=&category_753_Event%5B%5D=any&category_753_Game%5B%5D=tag_app_${data[i].appid}&category_753_item_class%5B%5D=tag_item_class_2&category_753_item_class%5B%5D=tag_item_class_5&appid=753`;
        link_steam_market.setAttribute('target', '_blank');
        link_steam_market.setAttribute('class', 'color-change');

        const td_links = document.createElement('td');
        td_links.setAttribute('class', 'links')
        td_links.append(link_steam_badge)
        td_links.append(link_steam_store)
        td_links.append(link_steam_market)
        td_links.append(link_card_exchange)

        const td_release_date = document.createElement('td');
        td_release_date.textContent = data[i].release_date;

        const td_last_update = document.createElement('td');
        td_last_update.innerText = `${data[i].last_update}min ago` 

        const tr_badge = document.createElement('tr');
        tr_badge.setAttribute('id', data[i].appid)
        tr_badge.append(td_name);
        tr_badge.append(td_cards);
        tr_badge.append(td_price_standard);
        tr_badge.append(td_price_foil);
        tr_badge.append(td_price_booster_pack);
        tr_badge.append(td_game_price);
        tr_badge.append(td_links);
        tr_badge.append(td_links);
        tr_badge.append(td_release_date);
        tr_badge.append(td_last_update);
       
        fragment.appendChild(tr_badge);
    }

    tbody_badges_prices_data.appendChild(fragment);

    const links = document.querySelectorAll('.color-change');

    links.forEach(link => {
        link.addEventListener('click', function () {
    
            const selectedRow = this.closest('tr');
            selectedRow.classList.add('selected');
        
            const elementsInsideRow = selectedRow.querySelectorAll('*');
            elementsInsideRow.forEach(element => {
                element.classList.add('selected');
            });
        });
    });

}

// Draw player information on div profile
async function draw_player_information(player_info, player_badges) {
    //Reset elements
    player_level.setAttribute('class', '');
    tbody_player_badges_data.innerHTML = '';
    
    //Set atributes
    player_country.style = 'display: visible'
    steam_url.style = 'display: visible'
    steam_url.textContent = 'Steam'
    steamdb_url.style = 'display: visible'
    steamdb_url.textContent = 'SteamDB'
    steamladder_url.style = 'display: visible'
    steamladder_url.textContent = 'Steam Ladder'
    player_name.style = 'color: whitesmoke'
    
    player_image.style = 'width: 120px; height: 120px'
    div_player_image.style = 'min-width: 120px; max-height: 120px';
    // profile.style.height = "auto"

    player_country.textContent = 'Country: ' + player_info.loccountrycode;
    if(player_info.player_since != 0){
        player_since.textContent = 'Member since: ' + player_info.player_since;
    } else {
        player_since.textContent = 'Member since: N/A';
    }
    player_image.src = player_info.avatarfull;
    player_name.textContent = player_info.personaname;
    steam_url.href = player_info.profileurl;
    steamdb_url.href = `https://steamladder.com/profile/${player_info.steamid}/`;
    steamladder_url.href = `https://steamladder.com/profile/${player_info.steamid}/`;
    vac_status.style.display = 'block'

    if(player_info.vac_ban){
        span_vac_status.textContent = "Banned";
        span_vac_status.style.color = "#c22121";
    } else{
        span_vac_status.textContent = "None";
        span_vac_status.style.color = "#3dca3d";
    }
 
    if (player_badges != 'Private') {
        document.querySelector('.player_profile').style = 'justify-content: space-around'

        player_xp.textContent = 'Player XP: ' + player_info.player_xp;
        player_total_badges.textContent = 'Badges: ' + player_info.badges_count;

        const player_xp_needed_current_level = player_info.player_xp_needed_current_level;
        const player_xp_info = player_info.player_xp;
        const player_lvl_current = player_info.player_level;
        const player_lvl_target = player_info.player_level + 1;
        xp = player_xp_info - player_xp_needed_current_level;
        current_level.value = player_lvl_current;
        target_level.value = player_lvl_target;

        update_image_level(player_level, player_lvl_current); //Profile level
        update_image_level(player_level_calculator, player_lvl_target); //Target level
        update_player_xp(player_lvl_current, player_lvl_target, xp);
        draw_player_rewards(player_lvl_current);

        document.querySelector('#player_badges').disabled = false;
        checkbox.disabled = false;
        isUserLoggedIn = true;
    } else {
        player_xp.textContent = 'Private';
    }
    //End loading...
    loader.style.display = 'none';

    set_profile_height();
    

}

function set_profile_height(){
    
    var larguraTela = window.innerWidth;
    if (larguraTela <= 650) {
      profile.style.height = '300px';
    } else {
      profile.style.height = '140px';
    }
}
window.addEventListener('resize', function() {
    if(isUserLoggedIn)
        set_profile_height();
});

// Update player xp on div level_calculator
function update_player_xp(current_level, target_level, xp_player) {
    current_level = Number(current_level);
    target_level = Number(target_level);

    if (current_level < target_level && current_level >= 0 && target_level < 5001 && current_level < 5000) {
        var xp = 0;
        for (var i = current_level + 1; i <= target_level; i++) {
            xp += Math.ceil(i / 10);
       
        }
        xp *= 100;
        xp = Math.ceil((xp - xp_player) / 100) * 100;
        const sets_req = Math.floor(xp / 100);
        xp_needed.innerHTML = xp;
        sets_needed.innerHTML = sets_req;
    }
}

// Get image from player level or level calculator
function update_image_level(element, player_level) {

    const level_split = split_number_level(player_level)

    element.setAttribute('class', '');
    element.textContent = player_level;
    if (player_level >= 100) {
        element.classList.add('friendPlayerLevel', `lvl_${level_split.hundreds}`, `lvl_plus_${level_split.tens}`);
    } else {
        element.classList.add('friendPlayerLevel', `lvl_${level_split.tens}`);
    }

}

//return hundreds and tens to get level image 
function split_number_level(level) {
    var hundreds = Math.floor(level / 100) * 100;
    var tens = Math.floor((level % 100) / 10) * 10;
    return {
        hundreds: hundreds,
        tens: tens,
    };
}

// Reset all elements 
function reset_page(){
    player_name.innerHTML = 'Log in with your Steam account for more information.';
    player_image.src = '../static/images/default_profile_image.png';
    vac_status.style = 'display: none';
    player_country.innerHTML = '';
    member_since.innerHTML = '';
    steam_url.innerHTML = '';
    steamdb_url.innerHTML = '';
    steamladder_url.innerHTML = '';
    player_xp.innerHTML = '';
    player_total_badges.innerHTML = '';
    player_level.setAttribute('class', '');
    player_level.innerHTML = '';
    current_level.value = 0;
    target_level.value = 0;
    draw_player_rewards(0)
    update_image_level(player_level_calculator, 0);
    update_player_xp(0, 0, 0);
    emotes_backgrounds.innerHTML = 0;
    game_coupons.innerHTML = 0;
    sets_needed.innerHTML = 0;
    xp_needed.innerHTML = 0;
}

//Infinite scroll on table
function setupInfiniteScroll(tableBody, data, drawFunction) {
    tableBody.addEventListener("scroll", function () {
        if(search_player_game.value == '' && search_badge.value == ''){ 
            const scrollPosition = this.scrollTop + this.clientHeight;
            const tableHeight = this.scrollHeight;
            if (scrollPosition >= tableHeight - 200) {
                drawFunction(data);
            }   
        } 
    });
}

//Show table on screen
function updateTableButton(activeBtn, activeTable, allButtons, allTables) {
    allTables.forEach(table => table.style.display = 'none');
    allButtons.forEach(button => button.classList.remove("clicked"));

    if (player_badges_data === '') {
        activeBtn.disabled = true;
    } else {
        activeBtn.disabled = false;
    }

    activeTable.style.display = 'block';
    activeBtn.classList.add("clicked");
}

const allButtons = [btn_player_badges, btn_badges_prices, btn_level_calculator];
const allTables = [table_player_badges, table_badges_prices, div_level_calculator];

function changeTable(button, targetTable) {
    button.addEventListener('click', () => {
        updateTableButton(button, targetTable, allButtons, allTables);
    });
}

allButtons.forEach((button, index) => {
    changeTable(button, allTables[index]);
});

//End Show table on screen

//sort itens on table
var ascending = true;
function sortColumn(colIndex, icon){
    const table_player_badges_data = document.querySelector(".table_player_badges");
    const computedStyle = window.getComputedStyle(table_player_badges_data)
    const displayValue = computedStyle.getPropertyValue('display');
    
    const table_player_badges_sort = {
        0: (a, b) => a.name.localeCompare(b.name),
        1: (a, b) => a.level - b.level,
        2: (a, b) => a.xp - b.xp,
        3: (a, b) => b.border.localeCompare(a.border),
        4: (a, b) => b.type.localeCompare(a.type),
        5: (a, b) => parseInt(b.appid) - parseInt(a.appid),
        6: (a, b) => a.scarcity - b.scarcity,
        7: (a, b) => {
            const dataA = new Date(a.completion_time);
            const dataB = new Date(b.completion_time);
            return dataA - dataB;
        },
    }

    const table_badges_prices_sort = {
        0: (a, b) => a.name.localeCompare(b.name),
        1: (a, b) => a.cards - b.cards,
        2: (a, b) => parseFloat(b.standard) - parseFloat(a.standard),
        3: (a, b) => parseFloat(b.foil) - parseFloat(a.foil),
        4: (a, b) => parseFloat(b.booster_pack) - parseFloat(a.booster_pack),
        5: (a, b) => parseFloat(b.game_price) - parseFloat(a.game_price),
        7: (a, b) => parseFloat(b.last_update) - parseFloat(a.last_update),
    }

    // check is visible on screen
    if(displayValue == 'block'){
        //table_player_badges
        player_badges_data.sort(table_player_badges_sort[colIndex]);
        ascending = !ascending;
        if (!ascending) 
            player_badges_data.reverse();

        tbody_player_badges_data.innerHTML = "";
        draw_player_badges_data(player_badges_data);
    } else{
        //table_badges_prices
        badges_prices_data.sort(table_badges_prices_sort[colIndex]);
        ascending = !ascending;
        if (!ascending) 
            badges_prices_data.reverse();
        tbody_badges_prices_data.innerHTML = "";
        draw_all_badges(badges_prices_data);
    }

    
    if(icon.innerHTML == "arrow_drop_up"){
        icon.innerHTML = "arrow_drop_down"
    } else{
        icon.innerHTML = "arrow_drop_up"
    }

}

//Filter player badges 
checkbox.addEventListener('change', function () {
    if (this.checked) {
        const appidsSet = new Set(player_badges_data.map(obj => obj.appid.toString()));
        const uniqueElements = badges_prices_data.filter(obj => !appidsSet.has(obj.appid.toString()));
        badges_prices_data = uniqueElements
        document.querySelector(".tbody_badges_prices").innerHTML = '';
        draw_all_badges(badges_prices_data)
    } else {
        badges_prices_data = badges_prices_data_reset;
        draw_all_badges(badges_prices_data)
    }
});

//Search game name
function search_game(data, fields, searchTerm, resultContainer, drawFunction) {
    const filteredData = data.filter(item => {
        const itemValues = fields.map(field => item[field].toString().toLowerCase());
        return itemValues.some(value => value.includes(searchTerm));
    });

    resultContainer.innerHTML = "";
    drawFunction(filteredData);
}

search_player_game.addEventListener('input', () => {
    const searchTerm = search_player_game.value.toLowerCase();
    search_game(player_badges_data, ['name', 'appid'], searchTerm, tbody_player_badges_data, draw_player_badges_data);
});

search_badge.addEventListener('input', () => {
    const searchTerm = search_badge.value.toLowerCase();
    search_game(badges_prices_data, ['name', 'appid'], searchTerm, tbody_badges_prices_data, draw_all_badges);
});

steamid.addEventListener('input', () => {
    if((steamid.value).length > 1) {
        btn_submit.disabled = false;
    } else{
        btn_submit.disabled = true;
    }
})

//zoom image
player_image.addEventListener('click', () =>{
    document.querySelector(".popup-image").style.display= "block";
    document.querySelector(".popup-image img").src = player_image.getAttribute('src');
});

document.querySelector(".popup-image span").addEventListener('click', () => {
    document.querySelector(".popup-image").style.display= "none";
})

function handleInput() {
    let target = Number(target_level.value);
    let current = Number(current_level.value);
    
    if(target > 5099){
        alert("Maximum Dream Steam Level is 5099!")
        let num = target_level.value.slice(0, -1);
        target = num;
        target_level.value = num;
    }

    if(current > target){
        draw_player_rewards(current);
        update_image_level(player_level_calculator, current);
        xp_needed.innerHTML = 0;
        sets_needed.innerHTML = 0;
    }else if (target > current){
        update_player_xp(current, target, xp);
        draw_player_rewards(target);
        update_image_level(player_level_calculator, target);
    } 
}

current_level.addEventListener("input", handleInput);
target_level.addEventListener("input", handleInput);

function handleButtonClick(button, target, increment) {
    button.addEventListener('click', () => {
        const newValue = Number(target.value) + increment;
        if (newValue >= 0) {
            target.value = newValue;
            handleInput();
        }
    });
}

function remove_spaces(element){
    element.value = element.value.trim();
}

handleButtonClick(btn_add_level_1, target_level, 1);
handleButtonClick(btn_add_level_10, target_level, 10);
handleButtonClick(btn_add_level_100, target_level, 100);
handleButtonClick(btn_increase_current_level, current_level, 1);
handleButtonClick(btn_decrease_current_level, current_level, -1);
handleButtonClick(btn_increase_target_level, target_level, 1);
handleButtonClick(btn_decrease_target_level, target_level, -1);


