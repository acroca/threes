$ ->
  $board = $("#board")
  $cells = [[],[],[],[]]
  data = [[],[],[],[]]
  for row in [0...4]
    $tr = $("<tr></tr>")
    for col in [0...4]
      do (row, col) ->
        $td = $("<td></td>")

        $up = $("<a class='up' href='#'></a>")
        $down = $("<a class='down' href='#'></a>")

        $up.click -> inc(col, row)
        $down.click -> decr(col, row)

        $cells[col][row] = $value = $("<span class='value'></span>")
        data[col][row] = 0

        $td.append($up)
        $td.append($down)
        $td.append($value)

        $tr.append($td)
    $board.append($tr)

  set_val = (col, row, val) ->
    data[col][row] = val
    val = "" if val == 0
    $cells[col][row].html(val)

  inc = (col, row) ->
    value = data[col][row]
    value *= 2 if value >= 3
    value = 3 if value == 2
    value = 2 if value == 1
    value = 1 if value == 0
    set_val(col, row, value)

  decr = (col, row) ->
    value = data[col][row]
    return if value == 0
    value = 0 if value == 1
    value = 1 if value == 2
    value = 2 if value == 3
    value /= 2 if value > 3
    set_val(col, row, value)

  swipe_columns = (row_diff, row_start, row_end, scroll_fun) ->
    for col in [0...4]
      joined = false

      for row in [row_start...row_end]
        if !joined && data[col][row] == 0
          joined = true
          scroll_fun(col, row, row_end)

        if !joined && can_join(col, row, col, row+row_diff)
          joined = true
          set_val(col, row, data[col][row] + data[col][row+row_diff])
          scroll_fun(col, row+row_diff, row_end)

      if joined
        set_val(col, row_end, 0)

  swipe_rows = (col_diff, column_start, column_end, scroll_fun) ->
    for row in [0...4]
      joined = false

      for col in [column_start...column_end]
        if !joined && data[col][row] == 0
          joined = true
          scroll_fun(col, column_end, row)

        if !joined && can_join(col, row, col+col_diff, row)
          joined = true
          set_val(col, row, data[col][row] + data[col+col_diff][row])
          scroll_fun(col+col_diff, column_end, row)

      if joined
        set_val(column_end, row, 0)

  swipe_up = -> swipe_columns(1, 0, 3, scroll_up)
  swipe_down = -> swipe_columns(-1, 3, 0, scroll_down)
  swipe_left = -> swipe_rows(1, 0, 3, scroll_left)
  swipe_right = -> swipe_rows(-1, 3, 0, scroll_right)

  scroll_up  = (col, from, to) -> set_val(col, i, data[col][i+1]) for i in [from...to]
  scroll_down = (col, from, to) -> set_val(col, i, data[col][i-1]) for i in [from...to]
  scroll_left  = (from, to, row) -> set_val(i, row, data[i+1][row]) for i in [from...to]
  scroll_right = (from, to, row) -> set_val(i, row, data[i-1][row]) for i in [from...to]

  can_join = (col1, row1, col2, row2) ->
    return true if data[col1][row1] == 2 && data[col2][row2] == 1
    return true if data[col1][row1] == 1 && data[col2][row2] == 2
    return false if data[col1][row1] == 0
    return false if data[col2][row2] == 0
    return false if data[col1][row1] < 3
    return false if data[col2][row2] < 3
    data[col1][row1] == data[col2][row2]

  $(document).keydown (e) ->
    switch e.keyCode
      when 37 then swipe_left()
      when 38 then swipe_up()
      when 39 then swipe_right()
      when 40 then swipe_down()
