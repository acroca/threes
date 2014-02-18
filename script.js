(function() {
  $(function() {
    var $board, $cells, $tr, ACTIONS, NEW_BOARD_PROB, VALUES_PROB, add_rank, can_join, can_move, col, data, decr, do_action, get_score, inc, learner, next_val, random_action, reset, row, score, scroll_down, scroll_left, scroll_right, scroll_up, set_val, state_clone, step, swipe_columns, swipe_down, swipe_left, swipe_right, swipe_rows, swipe_up, update_score, _fn, _i, _j;
    $board = $("#board");
    $cells = [[], [], [], []];
    data = [[], [], [], []];
    for (row = _i = 0; _i < 4; row = ++_i) {
      $tr = $("<tr></tr>");
      _fn = function(row, col) {
        var $down, $td, $up, $value;
        $td = $("<td></td>");
        $up = $("<a class='up' href='#'></a>");
        $down = $("<a class='down' href='#'></a>");
        $up.click(function() {
          return inc(col, row);
        });
        $down.click(function() {
          return decr(col, row);
        });
        $cells[col][row] = $value = $("<span class='value'></span>");
        data[col][row] = 0;
        $td.append($up);
        $td.append($down);
        $td.append($value);
        return $tr.append($td);
      };
      for (col = _j = 0; _j < 4; col = ++_j) {
        _fn(row, col);
      }
      $board.append($tr);
    }
    set_val = function(col, row, val) {
      data[col][row] = val;
      if (val === 0) {
        val = "";
      }
      return $cells[col][row].html(val);
    };
    inc = function(col, row) {
      var value;
      value = data[col][row];
      if (value >= 3) {
        value *= 2;
      }
      if (value === 2) {
        value = 3;
      }
      if (value === 1) {
        value = 2;
      }
      if (value === 0) {
        value = 1;
      }
      return set_val(col, row, value);
    };
    decr = function(col, row) {
      var value;
      value = data[col][row];
      if (value === 0) {
        return;
      }
      if (value === 1) {
        value = 0;
      }
      if (value === 2) {
        value = 1;
      }
      if (value === 3) {
        value = 2;
      }
      if (value > 3) {
        value /= 2;
      }
      return set_val(col, row, value);
    };
    swipe_columns = function(row_diff, row_start, row_end, scroll_fun) {
      var add_value_to, joined, swiped, _k, _l;
      swiped = [];
      for (col = _k = 0; _k < 4; col = ++_k) {
        joined = false;
        for (row = _l = row_start; row_start <= row_end ? _l < row_end : _l > row_end; row = row_start <= row_end ? ++_l : --_l) {
          if (!joined && data[col][row] === 0) {
            joined = true;
            scroll_fun(col, row, row_end);
          }
          if (!joined && can_join(col, row, col, row + row_diff)) {
            joined = true;
            set_val(col, row, data[col][row] + data[col][row + row_diff]);
            scroll_fun(col, row + row_diff, row_end);
          }
        }
        if (joined) {
          swiped.push(col);
          set_val(col, row_end, 0);
        }
      }
      if (swiped.length > 0) {
        add_value_to = swiped[Math.floor(Math.random() * swiped.length)];
        set_val(add_value_to, row_end, next_val());
        update_score();
        return true;
      } else {
        update_score();
        return false;
      }
    };
    swipe_rows = function(col_diff, column_start, column_end, scroll_fun) {
      var add_value_to, joined, swiped, _k, _l;
      swiped = [];
      for (row = _k = 0; _k < 4; row = ++_k) {
        joined = false;
        for (col = _l = column_start; column_start <= column_end ? _l < column_end : _l > column_end; col = column_start <= column_end ? ++_l : --_l) {
          if (!joined && data[col][row] === 0) {
            joined = true;
            scroll_fun(col, column_end, row);
          }
          if (!joined && can_join(col, row, col + col_diff, row)) {
            joined = true;
            set_val(col, row, data[col][row] + data[col + col_diff][row]);
            scroll_fun(col + col_diff, column_end, row);
          }
        }
        if (joined) {
          swiped.push(row);
          set_val(column_end, row, 0);
        }
      }
      if (swiped.length > 0) {
        add_value_to = swiped[Math.floor(Math.random() * swiped.length)];
        set_val(column_end, add_value_to, next_val());
        update_score();
        return true;
      } else {
        update_score();
        return false;
      }
    };
    swipe_up = function() {
      return swipe_columns(1, 0, 3, scroll_up);
    };
    swipe_down = function() {
      return swipe_columns(-1, 3, 0, scroll_down);
    };
    swipe_left = function() {
      return swipe_rows(1, 0, 3, scroll_left);
    };
    swipe_right = function() {
      return swipe_rows(-1, 3, 0, scroll_right);
    };
    scroll_up = function(col, from, to) {
      var i, _k, _results;
      _results = [];
      for (i = _k = from; from <= to ? _k < to : _k > to; i = from <= to ? ++_k : --_k) {
        _results.push(set_val(col, i, data[col][i + 1]));
      }
      return _results;
    };
    scroll_down = function(col, from, to) {
      var i, _k, _results;
      _results = [];
      for (i = _k = from; from <= to ? _k < to : _k > to; i = from <= to ? ++_k : --_k) {
        _results.push(set_val(col, i, data[col][i - 1]));
      }
      return _results;
    };
    scroll_left = function(from, to, row) {
      var i, _k, _results;
      _results = [];
      for (i = _k = from; from <= to ? _k < to : _k > to; i = from <= to ? ++_k : --_k) {
        _results.push(set_val(i, row, data[i + 1][row]));
      }
      return _results;
    };
    scroll_right = function(from, to, row) {
      var i, _k, _results;
      _results = [];
      for (i = _k = from; from <= to ? _k < to : _k > to; i = from <= to ? ++_k : --_k) {
        _results.push(set_val(i, row, data[i - 1][row]));
      }
      return _results;
    };
    can_join = function(col1, row1, col2, row2) {
      if (data[col1][row1] === 2 && data[col2][row2] === 1) {
        return true;
      }
      if (data[col1][row1] === 1 && data[col2][row2] === 2) {
        return true;
      }
      if (data[col1][row1] === 0) {
        return false;
      }
      if (data[col2][row2] === 0) {
        return false;
      }
      if (data[col1][row1] < 3) {
        return false;
      }
      if (data[col2][row2] < 3) {
        return false;
      }
      return data[col1][row1] === data[col2][row2];
    };
    $(document).keydown(function(e) {
      switch (e.keyCode) {
        case 37:
          return swipe_left();
        case 38:
          return swipe_up();
        case 39:
          return swipe_right();
        case 40:
          return swipe_down();
      }
    });
    VALUES_PROB = [[1, .33], [2, .66], [3, 1]];
    next_val = function() {
      var rand, ratio, value, _k, _len, _ref;
      rand = Math.random();
      for (_k = 0, _len = VALUES_PROB.length; _k < _len; _k++) {
        _ref = VALUES_PROB[_k], value = _ref[0], ratio = _ref[1];
        if (ratio >= rand) {
          return value;
        }
      }
    };
    NEW_BOARD_PROB = [[0, .6], [1, .75], [2, .90], [3, 1]];
    reset = function() {
      var _k, _results;
      _results = [];
      for (row = _k = 0; _k < 4; row = ++_k) {
        _results.push((function() {
          var _l, _results1;
          _results1 = [];
          for (col = _l = 0; _l < 4; col = ++_l) {
            _results1.push((function() {
              var rand, ratio, value, _len, _m, _ref;
              rand = Math.random();
              for (_m = 0, _len = NEW_BOARD_PROB.length; _m < _len; _m++) {
                _ref = NEW_BOARD_PROB[_m], value = _ref[0], ratio = _ref[1];
                if (ratio >= rand) {
                  return set_val(row, col, value);
                }
              }
            })());
          }
          return _results1;
        })());
      }
      return _results;
    };
    reset();
    $("#reset").click(reset);
    can_move = function() {
      var _k, _l, _m, _n;
      for (row = _k = 0; _k < 4; row = ++_k) {
        for (col = _l = 0; _l < 4; col = ++_l) {
          if (data[col][row] === 0) {
            return true;
          }
        }
      }
      for (row = _m = 0; _m < 3; row = ++_m) {
        for (col = _n = 0; _n < 3; col = ++_n) {
          if (can_join(col, row, col + 1, row)) {
            return true;
          }
          if (can_join(col, row, col, row + 1)) {
            return true;
          }
        }
      }
      return false;
    };
    get_score = function() {
      var d, total, _k, _l;
      total = 1;
      for (row = _k = 0; _k < 4; row = ++_k) {
        for (col = _l = 0; _l < 4; col = ++_l) {
          d = data[col][row];
          if (d >= 3) {
            total += d ^ 2;
          }
        }
      }
      return total;
    };
    score = 0;
    update_score = function() {
      score = get_score();
      console.log('===> score: ', score);
      return $("#total_score").html(score);
    };
    add_rank = function() {
      return $("#last_scores").prepend("<li>" + score + "</li>");
    };
    ACTIONS = {
      l: swipe_left,
      r: swipe_right,
      u: swipe_up,
      d: swipe_down
    };
    random_action = function() {
      var actions;
      actions = Object.keys(ACTIONS);
      return actions[Math.floor(Math.random() * actions.length)];
    };
    do_action = function(action) {
      return ACTIONS[action]();
    };
    state_clone = function() {
      var column, _k, _results;
      _results = [];
      for (column = _k = 0; _k < 4; column = ++_k) {
        _results.push(data[column].slice(0));
      }
      return _results;
    };
    learner = new QLearner();
    return step = function() {
      var action, current_state, next_state, rand;
      current_state = state_clone();
      rand = random_action();
      action = learner.bestAction(current_state);
      if (!action || (!learner.knowsAction(current_state, rand) && Math.random() < 0.2)) {
        action = rand;
      }
      do_action(action);
      next_state = state_clone();
      if (!can_move()) {
        learner.add(current_state, next_state, -1000, action);
        add_rank();
        reset();
      } else {
        learner.add(current_state, next_state, score, action);
      }
      return learner.learn(10);
    };
  });

}).call(this);
