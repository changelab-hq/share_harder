const makeBubble = ($origin, icon) => {
  var $bubble = $('<div class="bubble"><img class="bub" src="/images/bubble.png"><img src="/images/bubble-icon-'+icon+'.png" class="icon"></div>')
  $origin.append($bubble);

  var x = $origin.width() * Math.random();
  var y = $origin.height() * Math.random();
  var dx = 0;
  var dy = -5;
  var dx2 = 0;
  var dy2 = 0;

  $bubble.css({left: x, top: y, width: '20px'})
  var interval = setInterval(function(){
    dx2 = dx2 - 10 + Math.random() * 20
    dy2 = dy2 - 7 + Math.random() * 4
    dx = dx + dx2
    dy = dy + dy2
    x = x + dx
    y = y + dy
    $bubble.css({left: x, top: y})
  }, 300)

  setTimeout(function(){
    $bubble.css({opacity: 1, width: '50px'})
  }, 300)

  setTimeout(function(){
    $bubble.css({transition: 'all 0.3s linear, opacity 0.6s linear', opacity: 0})
  }, 1200)

  setTimeout(function(){
    $bubble.remove();
    clearInterval(interval);
  }, 3000)
}

export default makeBubble
