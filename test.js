var strings = document.querySelectorAll('.content');

var stamp = new Date();
for( var i = 0; i <= 100; i++ )
{
  var div = document.createElement('div');
  var str = 'ООО «Передовые 1345345555 34583475092 - технологии общения»ООО «Передовые 1345345555 34583475092 - технологии общения»ООО «Передовые 1345345555 34583475092 - технологии общения»ООО «Передовые 1345345555 34583475092 - технологии общения»';
  str = truncate({string: str, width: 400})
  div.innerHTML = str;
  div.className = 'content';
  document.body.appendChild(div);
}

console.log(new Date() - stamp)