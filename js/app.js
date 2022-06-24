(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            if (document.querySelector("body")) setTimeout((function() {
                document.querySelector("body").classList.add("_loaded");
            }), 200);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    } else {
        sessionStorage.setItem("money", 5e3);
        if (document.querySelector(".check")) document.querySelectorAll(".check").forEach((el => {
            el.textContent = sessionStorage.getItem("money");
        }));
    }
    if (!sessionStorage.getItem("hint")) sessionStorage.setItem("hint", 0);
    if (!sessionStorage.getItem("bomb")) sessionStorage.setItem("bomb", 0);
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    const window_height = document.documentElement.clientHeight;
    function delete_money(count, block) {
        let money = +sessionStorage.getItem("money");
        sessionStorage.setItem("money", money - count);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function no_money(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function get_random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function add_money(count, block, delay, delay_off) {
        let money = Math.floor(+sessionStorage.getItem("money") + count);
        setTimeout((() => {
            sessionStorage.setItem("money", money);
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
    }
    function add_points(count, block, delay, delay_off) {
        let points = +sessionStorage.getItem("points") + count;
        setTimeout((() => {
            sessionStorage.setItem("points", points);
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("points")));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
    }
    let flare = document.querySelectorAll(".flare");
    function get_random_animate() {
        let random_item = get_random(0, flare.length);
        flare.forEach((el => {
            if (el.classList.contains("_active")) el.classList.remove("_active");
        }));
        setTimeout((() => {
            flare[random_item].classList.add(`_active`);
        }), 100);
    }
    if (document.querySelector(".flare")) setInterval((() => {
        get_random_animate();
    }), 1e4);
    if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main").classList.add("_active");
    if (document.querySelector(".main") && sessionStorage.getItem("show-levels")) {
        document.querySelector(".main__content-box").classList.add("_levels");
        document.querySelector(".header").classList.add("_btn");
        setTimeout((() => {
            sessionStorage.removeItem("show-levels");
        }), 100);
    }
    const config_shop = {
        price_hint: 3e3,
        price_bomb: 4e3
    };
    if (document.querySelector(".main")) {
        document.querySelectorAll(".shop__price")[0].textContent = config_shop.price_hint;
        document.querySelectorAll(".shop__price")[1].textContent = config_shop.price_bomb;
    }
    if (document.querySelector(".game")) {
        sessionStorage.setItem("current-bet", 350);
        document.querySelector(".footer-game__input").value = sessionStorage.getItem("current-bet");
        draw_moves();
        draw_goals();
        if (window_height > 600) {
            let robot = document.querySelector(".robot");
            let ufo = document.querySelector(".ufo");
            robot.setAttribute("width", 230);
            robot.setAttribute("height", 470);
            ufo.setAttribute("width", 320);
            ufo.setAttribute("height", 330);
        }
        setInterval((() => {
            create_icons();
        }), get_random(500, 1500));
        if (document.querySelector(".footer-game__input")) {
            let input = document.querySelector(".footer-game__input");
            input.addEventListener("input", (e => {
                document.querySelector(".footer-game__bet").classList.add("_bg");
                if (input.value.length >= 4) input.value = input.value.substring(0, 4);
                sessionStorage.setItem("current-bet", +input.value);
            }));
            window.addEventListener("click", (() => {
                if (document.querySelector(".footer-game__bet").classList.contains("_bg")) document.querySelector(".footer-game__bet").classList.remove("_bg");
            }));
        }
        document.querySelector(".level").textContent = sessionStorage.getItem("level");
        write_bonuses();
    }
    function write_bonuses() {
        document.querySelector(".footer-game__count_hint").textContent = sessionStorage.getItem("hint");
        document.querySelector(".footer-game__count_bomb").textContent = sessionStorage.getItem("bomb");
    }
    function draw_moves() {
        let level = +sessionStorage.getItem("level");
        if (1 == level) document.querySelector(".moves").textContent = 10; else if (2 == level) document.querySelector(".moves").textContent = 15; else if (3 == level) document.querySelector(".moves").textContent = 20;
    }
    function draw_goals() {
        let level = +sessionStorage.getItem("level");
        if (1 == level) {
            document.querySelectorAll(".info-game__goal-icon").forEach((el => {
                el.querySelector("img").setAttribute("src", `img/game/1/icon-4.svg`);
            }));
            document.querySelector(".info-game__goal-count_goal").textContent = 50;
            document.querySelector(".info-game__goal-count_complete").textContent = 0;
        } else if (2 == level) {
            document.querySelectorAll(".info-game__goal-icon").forEach((el => {
                el.querySelector("img").setAttribute("src", `img/game/2/icon-4.svg`);
            }));
            document.querySelector(".info-game__goal-count_goal").textContent = 75;
            document.querySelector(".info-game__goal-count_complete").textContent = 0;
        } else if (3 == level) {
            document.querySelectorAll(".info-game__goal-icon").forEach((el => {
                el.querySelector("img").setAttribute("src", `img/game/3/icon-4.svg`);
            }));
            document.querySelector(".info-game__goal-count_goal").textContent = 100;
            document.querySelector(".info-game__goal-count_complete").textContent = 0;
        }
    }
    let config = {
        countRows: 8,
        countCols: 8,
        offsetBorder: 10,
        gemSize: 28,
        imagesCoin: [ 1, 2, 3, 4, 5 ],
        gemClass: "gem",
        gemClassEmpty: "gem-empty",
        gemIdPrefix: "gem",
        gameStates: [ "pick", "switch", "revert", "remove", "refill" ],
        gameState: "",
        movingItems: 0,
        countScore: 0,
        count_move: 0,
        player_touch: 0,
        state_game_money: 0,
        crystall_cord_x: null,
        crystall_cord_y: null
    };
    if (window_height > 600) config.gemSize = 40;
    if (window_height >= 800) config.gemSize = 50;
    let player = {
        selectedRow: -1,
        selectedCol: -1,
        posX: "",
        posY: ""
    };
    let components = {
        container: document.createElement("div"),
        content: document.createElement("div"),
        wrapper: document.createElement("div"),
        cursor: document.createElement("div"),
        score: document.createElement("div"),
        gems: new Array
    };
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    if (document.querySelector(".game")) {
        document.body.classList.add("_hold");
        initGame();
        config.countScore = 0;
    }
    function handleTouchStart(e) {
        let targetElement = e.target;
        config.count_move = 0;
        config.player_touch = 1;
        if (targetElement.closest(".gem") && !targetElement.closest("._hide")) {
            document.querySelector(".footer-game__input-box").classList.add("_hide");
            if (1 != config.state_game_money) {
                delete_money(+sessionStorage.getItem("current-bet"), ".check");
                config.state_game_money = 1;
            }
            let row = parseInt(targetElement.getAttribute("id").split("_")[1]);
            let col = parseInt(targetElement.getAttribute("id").split("_")[2]);
            player.selectedRow = row;
            player.selectedCol = col;
            config.crystall_cord_x = e.touches[0].clientX;
            config.crystall_cord_y = e.touches[0].clientY;
        }
    }
    function handleTouchEnd() {
        setTimeout((() => {
            player.selectedRow = -1;
            player.selectedCol = -1;
        }), 500);
    }
    function handleTouchMove(e) {
        if (config.count_move >= 1) return false;
        if (e.target.closest(".field__body")) {
            config.count_move++;
            let crystall_cord_x2 = e.touches[0].clientX;
            let crystall_cord_y2 = e.touches[0].clientY;
            let xDiff = crystall_cord_x2 - config.crystall_cord_x;
            let yDiff = crystall_cord_y2 - config.crystall_cord_y;
            let row = player.selectedRow;
            let col = player.selectedCol;
            if (Math.abs(xDiff) > Math.abs(yDiff)) if (xDiff > 0) check_collision(col + 1, row, e.target); else check_collision(col - 1, row, e.target); else if (yDiff > 0) check_collision(col, row + 1, e.target); else check_collision(col, row - 1, e.target);
        }
    }
    function check_collision(col, row) {
        config.gameState = config.gameStates[1];
        player.posX = col;
        player.posY = row;
        let num = `gem_${row}_${col}`;
        if (document.getElementById(`${num}`) && !document.getElementById(`${num}`).classList.contains("_hide")) gemSwitch();
    }
    function initGame() {
        sessionStorage.setItem("points", 0);
        createContentPage();
        createWrapper();
        createGrid();
        config.gameState = config.gameStates[0];
    }
    function createContentPage() {
        components.content.classList.add("field__inner");
        components.content.style.padding = config.offsetBorder + "px";
        components.content.style.width = config.gemSize * config.countCols + 2 * config.offsetBorder + "px";
        components.content.style.height = config.gemSize * config.countRows + 2 * config.offsetBorder + "px";
        document.querySelector(".field__body").append(components.content);
    }
    function createWrapper() {
        components.wrapper.classList.add("field__wrapper");
        components.content.append(components.wrapper);
    }
    function scoreInc(count) {
        if (count >= 4) count *= 2; else if (count >= 5) count = 2 * (count + 1); else if (count >= 6) count *= 2 * (count + 2);
        config.countScore += count;
        add_points(count, ".score", 500, 1500);
        check_game_over();
    }
    function check_game_over() {
        let points = +document.querySelector(".info-game__goal-count_complete").innerHTML;
        let level = +sessionStorage.getItem("level");
        let moves = +document.querySelector(".moves").innerHTML;
        get_coeff_bet();
        if (1 == level && moves < 1 && points <= 50) draw_loose_info(); else if (1 == level && points >= 50) draw_win_info();
        if (2 == level && moves < 1 && points <= 75) draw_loose_info(); else if (2 == level && points > 75) draw_win_info();
        if (3 == level && moves < 1 && points <= 100) draw_loose_info(); else if (3 == level && points > 100) draw_win_info();
    }
    function draw_loose_info() {
        document.querySelector(".win__sub-text").textContent = "You loose";
        setTimeout((() => {
            document.querySelector(".win").classList.add("_active");
            document.querySelector(".win").classList.add("_loose");
        }), 500);
    }
    function draw_win_info() {
        document.querySelector(".win__sub-text").textContent = "You win";
        document.querySelector(".win__text").textContent = +sessionStorage.getItem("current-bet") * +sessionStorage.getItem("coeff");
        setTimeout((() => {
            add_money(+sessionStorage.getItem("current-bet") * +sessionStorage.getItem("coeff"), ".check", 1e3, 2e3);
            document.querySelector(".win").classList.add("_active");
        }), 500);
    }
    function get_coeff_bet() {
        let level = +sessionStorage.getItem("level");
        let moves = document.querySelector(".moves").innerHTML;
        if (1 == level) {
            let move = 10 - moves;
            if (move < 5) sessionStorage.setItem("coeff", 10); else if (6 == move) sessionStorage.setItem("coeff", 8); else if (7 == move) sessionStorage.setItem("coeff", 5); else if (8 == move) sessionStorage.setItem("coeff", 3); else if (9 == move) sessionStorage.setItem("coeff", 1); else if (10 == move) sessionStorage.setItem("coeff", .01);
        } else if (2 == level) {
            let move = 15 - moves;
            if (move < 9) sessionStorage.setItem("coeff", 10); else if (10 == move) sessionStorage.setItem("coeff", 8); else if (11 == move) sessionStorage.setItem("coeff", 5); else if (12 == move) sessionStorage.setItem("coeff", 3); else if (13 == move) sessionStorage.setItem("coeff", 1); else if (move > 13) sessionStorage.setItem("coeff", .01);
        } else if (3 == level) {
            let move = 20 - moves;
            if (move < 13) sessionStorage.setItem("coeff", 10); else if (14 == move) sessionStorage.setItem("coeff", 8); else if (15 == move) sessionStorage.setItem("coeff", 7); else if (16 == move) sessionStorage.setItem("coeff", 6); else if (17 == move) sessionStorage.setItem("coeff", 5); else if (18 == move) sessionStorage.setItem("coeff", 3); else if (19 == move) sessionStorage.setItem("coeff", 1); else if (move > 20) sessionStorage.setItem("coeff", .01);
        }
    }
    function createGem(t, l, row, col, level, img) {
        let crystall = document.createElement("div");
        crystall.classList.add(config.gemClass);
        crystall.id = `${config.gemIdPrefix}_${row}_${col}`;
        crystall.style.top = `${t}px`;
        crystall.style.left = `${l}px`;
        crystall.style.backgroundImage = `url('img/game/${level}/icon-${img}.png')`;
        crystall.setAttribute("data-number", `${img}`);
        if (2 == +sessionStorage.getItem("level")) crystall.style.backgroundSize = "80%"; else if (3 == +sessionStorage.getItem("level")) crystall.style.backgroundSize = "70%";
        components.wrapper.append(crystall);
    }
    function check_field_1() {
        document.querySelectorAll(".gem").forEach(((el, i) => {
            if ("gem_0_0" == el.id || "gem_0_1" == el.id || "gem_0_6" == el.id || "gem_0_7" == el.id || "gem_1_0" == el.id || "gem_1_7" == el.id || "gem_6_0" == el.id || "gem_6_7" == el.id || "gem_7_0" == el.id || "gem_7_1" == el.id || "gem_7_6" == el.id || "gem_7_7" == el.id) el.classList.add("_hide"); else if (el.classList.contains("_hide")) el.classList.remove("_hide");
        }));
    }
    function check_field_2() {
        document.querySelectorAll(".gem").forEach(((el, i) => {
            if ("gem_0_0" == el.id || "gem_0_3" == el.id || "gem_0_4" == el.id || "gem_0_7" == el.id || "gem_5_0" == el.id || "gem_5_7" == el.id || "gem_6_0" == el.id || "gem_6_1" == el.id || "gem_6_6" == el.id || "gem_6_7" == el.id || "gem_7_0" == el.id || "gem_7_1" == el.id || "gem_7_2" == el.id || "gem_7_5" == el.id || "gem_7_6" == el.id || "gem_7_7" == el.id) el.classList.add("_hide"); else if (el.classList.contains("_hide")) el.classList.remove("_hide");
        }));
    }
    function createGrid() {
        for (let i = 0; i < config.countRows; i++) {
            components.gems[i] = new Array;
            for (let j = 0; j < config.countCols; j++) components.gems[i][j] = -1;
        }
        for (let i = 0; i < config.countRows; i++) for (let j = 0; j < config.countCols; j++) {
            do {
                if (1 == +sessionStorage.getItem("level")) components.gems[i][j] = Math.floor(Math.random() * (4 - 0) + 0); else components.gems[i][j] = Math.floor(Math.random() * (5 - 0) + 0);
            } while (isStreak(i, j));
            if (1 == +sessionStorage.getItem("level")) {
                createGem(i * config.gemSize, j * config.gemSize, i, j, +sessionStorage.getItem("level"), config.imagesCoin[components.gems[i][j]]);
                check_field_1();
            } else if (2 == +sessionStorage.getItem("level")) {
                createGem(i * config.gemSize, j * config.gemSize, i, j, +sessionStorage.getItem("level"), config.imagesCoin[components.gems[i][j]]);
                check_field_2();
            } else createGem(i * config.gemSize, j * config.gemSize, i, j, +sessionStorage.getItem("level"), config.imagesCoin[components.gems[i][j]]);
        }
    }
    function isStreak(row, col) {
        return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
    }
    function isVerticalStreak(row, col) {
        if (-1 != row && -1 != col) {
            let gemValue = components.gems[row][col];
            let streak = 0;
            let tmp = row;
            while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
                streak++;
                tmp--;
            }
            tmp = row;
            while (tmp < config.countRows - 1 && components.gems[tmp + 1][col] == gemValue) {
                streak++;
                tmp++;
            }
            return streak > 1;
        } else return false;
    }
    function isHorizontalStreak(row, col) {
        if (-1 != row && -1 != col) {
            let gemValue = components.gems[row][col];
            let streak = 0;
            let tmp = col;
            while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
                streak++;
                tmp--;
            }
            tmp = col;
            while (tmp < config.countCols - 1 && components.gems[row][tmp + 1] == gemValue) {
                streak++;
                tmp++;
            }
            return streak > 1;
        } else return false;
    }
    function checkLevelGemSwitch() {
        let yOffset = player.selectedRow - player.posY;
        let xOffset = player.selectedCol - player.posX;
        document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).classList.add("switch");
        document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("dir", "-1");
        document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).classList.add("switch");
        document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("dir", "1");
        $(".switch").each((function() {
            config.movingItems++;
            $(this).animate({
                left: "+=" + xOffset * config.gemSize * $(this).attr("dir"),
                top: "+=" + yOffset * config.gemSize * $(this).attr("dir")
            }, {
                duration: 250,
                complete: function() {
                    checkMoving();
                }
            });
            $(this).removeClass("switch");
        }));
        document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("id", "temp");
        document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("id", config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol);
        document.querySelector("#temp").setAttribute("id", config.gemIdPrefix + "_" + player.posY + "_" + player.posX);
        let temp = components.gems[player.selectedRow][player.selectedCol];
        components.gems[player.selectedRow][player.selectedCol] = components.gems[player.posY][player.posX];
        components.gems[player.posY][player.posX] = temp;
    }
    function gemSwitch() {
        sessionStorage.getItem("level");
        if (player.selectedRow >= 0 && player.selectedCol >= 0 && player.posY >= 0 && player.posX >= 0 && player.posY < 8 && player.posX < 8) checkLevelGemSwitch(); else return false;
    }
    function checkMoving() {
        config.movingItems--;
        if (1 == +sessionStorage.getItem("level")) check_field_1(); else if (2 == +sessionStorage.getItem("level")) check_field_2();
        if (0 == config.movingItems) switch (config.gameState) {
          case config.gameStates[1]:
          case config.gameStates[2]:
            if (!isStreak(player.selectedRow, player.selectedCol) && !isStreak(player.posY, player.posX)) {
                if (player.selectedRow >= 0 && player.selectedCol >= 0 && player.posY >= 0 && player.posX >= 0) if (config.gameState != config.gameStates[2]) {
                    config.gameState = config.gameStates[2];
                    gemSwitch();
                } else {
                    config.gameState = config.gameStates[0];
                    player.selectedRow = -1;
                    player.selectedCol = -1;
                }
            } else {
                if (1 == config.player_touch) {
                    let moves = +document.querySelector(".moves").innerHTML;
                    document.querySelector(".moves").textContent = moves - 1;
                    config.player_touch = 0;
                }
                config.gameState = config.gameStates[3];
                if (isStreak(player.selectedRow, player.selectedCol)) removeGems(player.selectedRow, player.selectedCol);
                if (isStreak(player.posY, player.posX)) removeGems(player.posY, player.posX);
                gemFade();
            }
            break;

          case config.gameStates[3]:
            checkFalling();
            break;

          case config.gameStates[4]:
            placeNewGems();
            break;
        }
    }
    function removeGems(row, col) {
        let gemValue = components.gems[row][col];
        let tmp = row;
        document.querySelector("#" + config.gemIdPrefix + "_" + row + "_" + col).classList.add("remove");
        let countRemoveGem = document.querySelectorAll(".remove").length;
        if (isVerticalStreak(row, col)) {
            while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
                document.querySelector("#" + config.gemIdPrefix + "_" + (tmp - 1) + "_" + col).classList.add("remove");
                components.gems[tmp - 1][col] = -1;
                tmp--;
                countRemoveGem++;
            }
            tmp = row;
            while (tmp < config.countRows - 1 && components.gems[tmp + 1][col] == gemValue) {
                document.querySelector("#" + config.gemIdPrefix + "_" + (tmp + 1) + "_" + col).classList.add("remove");
                components.gems[tmp + 1][col] = -1;
                tmp++;
                countRemoveGem++;
            }
        }
        if (isHorizontalStreak(row, col)) {
            tmp = col;
            while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
                document.querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp - 1)).classList.add("remove");
                components.gems[row][tmp - 1] = -1;
                tmp--;
                countRemoveGem++;
            }
            tmp = col;
            while (tmp < config.countCols - 1 && components.gems[row][tmp + 1] == gemValue) {
                document.querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp + 1)).classList.add("remove");
                components.gems[row][tmp + 1] = -1;
                tmp++;
                countRemoveGem++;
            }
        }
        components.gems[row][col] = -1;
        let arr = [];
        document.querySelectorAll(".remove").forEach((el => {
            if (4 == el.dataset.number) arr.push(el);
        }));
        let array = Array.from(arr);
        let result = array.some((el => 4 == el.dataset.number));
        if (result) {
            let num = +document.querySelector(".info-game__goal-count_complete").innerHTML;
            document.querySelector(".info-game__goal-count_complete").textContent = num + arr.length;
        }
        scoreInc(countRemoveGem);
    }
    function gemFade() {
        $(".remove").each((function() {
            config.movingItems++;
            $(this).animate({
                opacity: 0
            }, {
                duration: 200,
                complete: function() {
                    $(this).remove();
                    checkMoving();
                }
            });
        }));
    }
    function checkFalling() {
        let fellDown = 0;
        for (let j = 0; j < config.countCols; j++) for (let i = config.countRows - 1; i > 0; i--) if (-1 == components.gems[i][j] && components.gems[i - 1][j] >= 0) {
            document.querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j).classList.add("fall");
            document.querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j).setAttribute("id", config.gemIdPrefix + "_" + i + "_" + j);
            components.gems[i][j] = components.gems[i - 1][j];
            components.gems[i - 1][j] = -1;
            fellDown++;
        }
        $(".fall").each((function() {
            config.movingItems++;
            $(this).animate({
                top: "+=" + config.gemSize
            }, {
                duration: 100,
                complete: function() {
                    $(this).removeClass("fall");
                    checkMoving();
                }
            });
        }));
        if (0 == fellDown) {
            config.gameState = config.gameStates[4];
            config.movingItems = 1;
            checkMoving();
        }
    }
    function placeNewGems() {
        let gemsPlaced = 0;
        for (let i = 0; i < config.countCols; i++) if (-1 == components.gems[0][i]) {
            components.gems[0][i] = Math.floor(Math.random() * (4 - 0) + 0);
            createGem(0, i * config.gemSize, 0, i, +sessionStorage.getItem("level"), config.imagesCoin[components.gems[0][i]]);
            gemsPlaced++;
        }
        if (gemsPlaced) {
            config.gameState = config.gameStates[3];
            checkFalling();
        } else {
            let combo = 0;
            for (let i = 0; i < config.countRows; i++) for (let j = 0; j < config.countCols; j++) {
                if (j <= config.countCols - 3 && components.gems[i][j] == components.gems[i][j + 1] && components.gems[i][j] == components.gems[i][j + 2]) {
                    combo++;
                    removeGems(i, j);
                }
                if (i <= config.countRows - 3 && components.gems[i][j] == components.gems[i + 1][j] && components.gems[i][j] == components.gems[i + 2][j]) {
                    combo++;
                    removeGems(i, j);
                }
            }
            if (combo > 0) {
                config.gameState = config.gameStates[3];
                gemFade();
            } else {
                config.gameState = config.gameStates[0];
                player.selectedRow = -1;
            }
        }
    }
    function reset_game() {
        draw_moves();
        draw_goals();
        sessionStorage.setItem("points", 0);
        document.querySelector(".score").textContent = sessionStorage.getItem("points");
        document.querySelector(".footer-game__input-box").classList.remove("_hide");
        document.querySelector(".win").classList.remove("_active");
        if (document.querySelector(".win").classList.contains("_loose")) document.querySelector(".win").classList.remove("_loose");
        config.state_game_money = 0;
    }
    function get_bonus_bomb(block) {
        config.movingItems++;
        document.querySelector(".footer-game__button_bomb").classList.remove("_anim");
        let row = parseInt(block.getAttribute("id").split("_")[1]);
        let col = parseInt(block.getAttribute("id").split("_")[2]);
        let top_elem_middle_row, top_elem_middle_col, top_elem_left_row, top_elem_left_col, top_elem_right_row, top_elem_right_col, middle_elem_left_row, middle_elem_left_col, middle_elem_right_row, middle_elem_right_col, bottom_elem_middle_row, bottom_elem_middle_col, bottom_elem_left_row, bottom_elem_left_col, bottom_elem_right_row, bottom_elem_right_col;
        if (row > 0 && row < 7 && col > 0 && col < 7) {
            top_elem_middle_row = row - 1;
            top_elem_middle_col = col;
            top_elem_left_row = row - 1;
            top_elem_left_col = col - 1;
            top_elem_right_row = row - 1;
            top_elem_right_col = col + 1;
            middle_elem_left_row = row;
            middle_elem_left_col = col - 1;
            middle_elem_right_row = row;
            middle_elem_right_col = col + 1;
            bottom_elem_middle_row = row + 1;
            bottom_elem_middle_col = col;
            bottom_elem_left_row = row + 1;
            bottom_elem_left_col = col - 1;
            bottom_elem_right_row = row + 1;
            bottom_elem_right_col = col + 1;
        }
        if (0 == row && col > 0 && col < 7) {
            middle_elem_left_row = row;
            middle_elem_left_col = col - 1;
            middle_elem_right_row = row;
            middle_elem_right_col = col + 1;
            bottom_elem_middle_row = row + 1;
            bottom_elem_middle_col = col;
            bottom_elem_left_row = row + 1;
            bottom_elem_left_col = col - 1;
            bottom_elem_right_row = row + 1;
            bottom_elem_right_col = col + 1;
        }
        if (0 == row && 0 == col) {
            middle_elem_right_row = row;
            middle_elem_right_col = col + 1;
            bottom_elem_middle_row = row + 1;
            bottom_elem_middle_col = col;
            bottom_elem_right_row = row + 1;
            bottom_elem_right_col = col + 1;
        }
        if (0 == row && 7 == col) {
            middle_elem_left_row = row;
            middle_elem_left_col = col - 1;
            bottom_elem_middle_row = row + 1;
            bottom_elem_middle_col = col;
            bottom_elem_left_row = row + 1;
            bottom_elem_left_col = col - 1;
        }
        if (row > 0 && row < 7 && 0 == col) {
            middle_elem_right_row = row;
            middle_elem_right_col = col + 1;
            bottom_elem_middle_row = row + 1;
            bottom_elem_middle_col = col;
            bottom_elem_right_row = row + 1;
            bottom_elem_right_col = col + 1;
            top_elem_middle_row = row - 1;
            top_elem_middle_col = col;
            top_elem_right_row = row - 1;
            top_elem_right_col = col + 1;
        }
        if (row > 0 && row < 7 && 7 == col) {
            middle_elem_left_row = row;
            middle_elem_left_col = col - 1;
            bottom_elem_middle_row = row + 1;
            bottom_elem_middle_col = col;
            bottom_elem_left_row = row + 1;
            bottom_elem_left_col = col - 1;
            top_elem_middle_row = row - 1;
            top_elem_middle_col = col;
            top_elem_left_row = row - 1;
            top_elem_left_col = col - 1;
        }
        if (7 == row && col > 0 && col < 7) {
            middle_elem_left_row = row;
            middle_elem_left_col = col - 1;
            middle_elem_right_row = row;
            middle_elem_right_col = col + 1;
            top_elem_middle_row = row - 1;
            top_elem_middle_col = col;
            top_elem_left_row = row - 1;
            top_elem_left_col = col - 1;
            top_elem_right_row = row - 1;
            top_elem_right_col = col + 1;
        }
        if (7 == row && 7 == col) {
            middle_elem_left_row = row;
            middle_elem_left_col = col - 1;
            top_elem_middle_row = row - 1;
            top_elem_middle_col = col;
            top_elem_left_row = row - 1;
            top_elem_left_col = col - 1;
        }
        if (document.getElementById(`gem_${row}_${col}`)) {
            removeGems(row, col);
            document.getElementById(`gem_${row}_${col}`).remove();
        }
        if (document.getElementById(`gem_${top_elem_middle_row}_${top_elem_middle_col}`)) {
            removeGems(top_elem_middle_row, top_elem_middle_col);
            document.getElementById(`gem_${top_elem_middle_row}_${top_elem_middle_col}`).remove();
        }
        if (document.getElementById(`gem_${top_elem_left_row}_${top_elem_left_col}`)) {
            removeGems(top_elem_left_row, top_elem_left_col);
            document.getElementById(`gem_${top_elem_left_row}_${top_elem_left_col}`).remove();
        }
        if (document.getElementById(`gem_${top_elem_right_row}_${top_elem_right_col}`)) {
            removeGems(top_elem_right_row, top_elem_right_col);
            document.getElementById(`gem_${top_elem_right_row}_${top_elem_right_col}`).remove();
        }
        if (document.getElementById(`gem_${middle_elem_left_row}_${middle_elem_left_col}`)) {
            removeGems(middle_elem_left_row, middle_elem_left_col);
            document.getElementById(`gem_${middle_elem_left_row}_${middle_elem_left_col}`).remove();
        }
        if (document.getElementById(`gem_${middle_elem_right_row}_${middle_elem_right_col}`)) {
            removeGems(middle_elem_right_row, middle_elem_right_col);
            document.getElementById(`gem_${middle_elem_right_row}_${middle_elem_right_col}`).remove();
        }
        if (document.getElementById(`gem_${bottom_elem_middle_row}_${bottom_elem_middle_col}`)) {
            removeGems(bottom_elem_middle_row, bottom_elem_middle_col);
            document.getElementById(`gem_${bottom_elem_middle_row}_${bottom_elem_middle_col}`).remove();
        }
        if (document.getElementById(`gem_${bottom_elem_left_row}_${bottom_elem_left_col}`)) {
            removeGems(bottom_elem_left_row, bottom_elem_left_col);
            document.getElementById(`gem_${bottom_elem_left_row}_${bottom_elem_left_col}`).remove();
        }
        if (document.getElementById(`gem_${bottom_elem_right_row}_${bottom_elem_right_col}`)) {
            removeGems(bottom_elem_right_row, bottom_elem_right_col);
            document.getElementById(`gem_${bottom_elem_right_row}_${bottom_elem_right_col}`).remove();
        }
        config.gameState = config.gameStates[3];
        checkMoving();
    }
    function get_bonus_hint(block) {
        config.movingItems++;
        document.querySelector(".footer-game__button_hint").classList.remove("_anim");
        let row = parseInt(block.getAttribute("id").split("_")[1]);
        removeGems(row, 0);
        document.getElementById(`gem_${row}_0`).remove();
        removeGems(row, 1);
        document.getElementById(`gem_${row}_1`).remove();
        removeGems(row, 2);
        document.getElementById(`gem_${row}_2`).remove();
        removeGems(row, 3);
        document.getElementById(`gem_${row}_3`).remove();
        removeGems(row, 4);
        document.getElementById(`gem_${row}_4`).remove();
        removeGems(row, 5);
        document.getElementById(`gem_${row}_5`).remove();
        removeGems(row, 6);
        document.getElementById(`gem_${row}_6`).remove();
        removeGems(row, 7);
        document.getElementById(`gem_${row}_7`).remove();
        config.gameState = config.gameStates[3];
        checkMoving();
    }
    function create_icons() {
        let item = document.createElement("div");
        item.classList.add("info-game__image");
        let image = document.createElement("img");
        let num = get_random(1, 5);
        if (+sessionStorage.getItem("level") > 1) num = get_random(1, 6);
        image.setAttribute("src", `img/game/${sessionStorage.getItem("level")}/icon-${num}.png`);
        item.append(image);
        item.style.left = `${get_random(0, 85)}%`;
        document.querySelector(".info-game__ufo").append(item);
        setTimeout((() => {
            item.remove();
        }), 1500);
    }
    function check_bet() {
        let bet = +sessionStorage.getItem("current-bet");
        let bank = +sessionStorage.getItem("money");
        if (bank <= 0) document.querySelector(".footer-game__input").value = 0; else if (bet > bank) document.querySelector(".footer-game__input").value = Math.floor(bank / 5);
    }
    if (document.querySelector(".main") || document.querySelector(".game")) {
        const audio_main = new Audio;
        audio_main.preload = "auto";
        audio_main.src = "files/audio_bg.mp3";
        audio_main.loop = [ true ];
        audio_main.volume = .3;
        document.addEventListener("click", (e => {
            let targetElement = e.target;
            if (targetElement.closest(".volume")) {
                if (targetElement.closest(".volume") && !targetElement.closest(".volume").classList.contains("_hide")) audio_main.volume = 0; else if (targetElement.closest(".volume") && targetElement.closest(".volume").classList.contains("_hide")) {
                    audio_main.volume = .3;
                    audio_main.play();
                }
                targetElement.closest(".volume").classList.toggle("_hide");
            }
        }));
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        let bank = +sessionStorage.getItem("money");
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main").classList.add("_active");
        }
        if (targetElement.closest(".main__button_levels")) {
            document.querySelector(".main__content-box").classList.add("_levels");
            document.querySelector(".header").classList.add("_btn");
        }
        if (targetElement.closest(".main__button_shop")) {
            document.querySelector(".main__content-box").classList.add("_shop");
            document.querySelector(".header").classList.add("_btn");
        }
        if (targetElement.closest(".header__button-home")) {
            if (document.querySelector(".main__content-box").classList.contains("_shop")) document.querySelector(".main__content-box").classList.remove("_shop"); else if (document.querySelector(".main__content-box").classList.contains("_levels")) document.querySelector(".main__content-box").classList.remove("_levels");
            document.querySelector(".header").classList.remove("_btn");
        }
        if (targetElement.closest(".shop__button_hint")) if (bank >= config_shop.price_hint) {
            sessionStorage.setItem("hint", +sessionStorage.getItem("hint") + 1);
            delete_money(config_shop.price_hint, ".check");
        } else no_money(".check");
        if (targetElement.closest(".shop__button_bomb")) if (bank >= config_shop.price_bomb) {
            sessionStorage.setItem("bomb", +sessionStorage.getItem("bomb") + 1);
            delete_money(config_shop.price_bomb, ".check");
        } else no_money(".check");
        if (targetElement.closest(".main__level_1")) sessionStorage.setItem("level", 1);
        if (targetElement.closest(".main__level_2")) sessionStorage.setItem("level", 2);
        if (targetElement.closest(".main__level_3")) sessionStorage.setItem("level", 3);
        if (targetElement.closest(".win__button_home")) sessionStorage.setItem("show-levels", true);
        if (targetElement.closest(".win__button_play")) reset_game();
        if (targetElement.closest(".footer-game__button_bomb")) if (0 != +sessionStorage.getItem("bomb")) {
            sessionStorage.setItem("bomb", +sessionStorage.getItem("bomb") - 1);
            targetElement.closest(".footer-game__button_bomb").classList.add("_anim");
        }
        if (targetElement.closest(".footer-game__button_hint")) if (0 != +sessionStorage.getItem("hint")) {
            sessionStorage.setItem("hint", +sessionStorage.getItem("hint") - 1);
            targetElement.closest(".footer-game__button_hint").classList.add("_anim");
        }
        if (targetElement.closest(".field__wrapper") && document.querySelector(".footer-game__button_bomb").classList.contains("_anim")) {
            let elem = targetElement.closest(".gem");
            get_bonus_bomb(elem);
            document.querySelector(`.footer-game__count_bomb`).textContent = sessionStorage.getItem(`bomb`);
        }
        if (targetElement.closest(".field__wrapper") && document.querySelector(".footer-game__button_hint").classList.contains("_anim")) {
            let elem = targetElement.closest(".gem");
            get_bonus_hint(elem);
            document.querySelector(`.footer-game__count_hint`).textContent = sessionStorage.getItem(`hint`);
        }
        if (targetElement.closest(".game") && !document.querySelector(".footer-game__input").classList.contains("_hide")) check_bet();
    }));
    window["FLS"] = true;
    isWebp();
    addLoadedClass();
})();