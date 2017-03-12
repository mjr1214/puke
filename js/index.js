$(function(){
	//生成牌 1h 2h
function makepoker(){
	var poker=[];
	var colors=['h','s','c','d'];
	var biao={};
	while(poker.length<52){
		var n=Math.ceil(Math.random()*13);
		var c=colors[Math.floor(Math.random()*4)];
		var v={
			color:c,
			number:n
		}
		if(!biao[n+c]){
			poker.push(v);
			biao[n+c]=true;
		}
	}
	return poker;
}
//将牌放置在页面中 根据上面生成牌的num及花色 设置背景图片 延迟发牌
function setpoker(poker){
	var index=0;
	var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'};
	for (var i = 0,poke;i < 7; i++) {
		for (var j = 0; j < i+1; j++) {
			poke=poker[index];
			index+=1;
			$('<div>')
			.attr('id',i+'_'+j)
			.attr('data-number',poke.number)
			.addClass('pai')
			.css('background-image','url(image/'+dict[poke.number]+poke.color+'.png)')
			.appendTo('.scene')
			.delay(index*20)
			.animate({
			top:i*40,
			left:(6-i)*65+j*130+45,
			opacity:1
			})
		};
	};
	//将剩余的牌放在下面 供选择
	for (var i = index; i < poker.length; i++) {
		poke=poker[index];
		index+=1;
		$('<div>')
		.attr('data-number',poke.number)
		.addClass('pai left')
		.css('background-image','url(image/'+dict[poke.number]+poke.color+'.png)')
		.appendTo('.scene')
		.delay(index*20)
		.animate({
		top:428,
		left:200,
		opacity:1
		})
	};
}
	// 点击向右按钮 牌壹向右边 按左 牌左移
	$(document).on('mousedown',false);
	var zIndex=1;
$('.move-right').on('click',function(){
	return function(){
		if($('.left').length===0){return;}
	$('.left').last().css({'z-index':zIndex++}).animate({left:700}).queue(function(){$(this).removeClass('left').addClass('right').dequeue()})
	}
}());
	var number=0;
$('.move-left').on('click',function(){
	return function(){
		number++;
		if($('.left').length){
			return;
		}
		if(number>3){
			return;
		}
	$('.right').each(function(i){
	$(this).css('z-index',0)
	.delay(i*30)
	.animate({left:190})
	.queue(function(){
		$(this).removeClass('right').addClass('left').dequeue()
		})
	})
  }
}())
    //获取牌上面的数字
var prev=null;
function getNumber(el){
	return parseInt($(el).attr('data-number'));
}
//压住的牌不能选
function isCanclick(el){
	var x=parseInt($(el).attr('id').split('_')[0]);
	var y=parseInt($(el).attr('id').split('_')[1]);
	if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){
		return false;
	}else{
		return true;
	}
}

$('.scene').on('click','.pai',function(){
	if($(this).attr('id')&&!isCanclick(this)){
		return;
	}//如果选中的牌没有id 指的是下面24张牌，直接走下面代码，
	//如果选中牌有id，指的是上面28张牌，还需要判断他是否被其他牌压住，压住的话，返回，不执行下面代码
	//短路思想
	var number=getNumber($(this));
	console.log(number)
	//点到牌的data-number的值是13
	if(number===13){
		$(this).animate({
			top:0,
			left:700
		}).queue(function(){
			$(this).detach().dequeue();
		});
		// sco+=10;
		scobox.text('分数'+' '+(sco+=10)+'分');
		return ;
	}//扔到指定位置，返回
	if(prev){  //此时为true       null为false
		//第二个非13的情况
		console.log(prev)

		if(getNumber(prev)+getNumber(this)===13){//第一个原先保存的值加上当前点击的值
			prev.add(this) //将点击的这张牌放入prev队列中，然后一块放到指定位置
			.animate({
				top:0,
				left:700
			})
			.queue(function(){
			$(this).detach().dequeue();
			})
			scobox.text('分数'+' '+(sco+=10)+'分');
		}else{
			// if(getNumber(prev)==getNumber(this)){return}
			// if($(prev)==$(this)){return}
			$(this).animate({top:'-=10'}).animate({top:'+=10'});
			prev.delay(400).animate({top:'+=10'});
			// prev.add(this).animate({top:'+=10'});
			// prev.add(this).css('border','none');
			//如果不等于13 两张牌边框消失
		}
		prev=null;
	}else{   //此时为false  先定义的prev为false 所以先走这块
		//第一个点击值不是13的情况
		prev=$(this); //把这张牌放到prev队列中保存下来
		prev.animate({
			top:'-=10'
		})
		console.log(prev)
	}
})

//开始游戏
var start=$('.start');
start.on('click',function(){
	clearInterval(tt);
	timebox.text('计时'+' '+'00'+':'+'00')
	var sec=0;
	var min=0;
	$('.move-left').animate({'opacity':1},500)
	$('.move-right').animate({'opacity':1},500)
	$('.pai').remove();
	setpoker(makepoker());
	tt=setInterval(move,1000)
		function move(){
			sec++;
			if(sec>59){
				min+=1;
				sec=0;
			}
			sec=sec<10?'0'+sec:sec;
			minu=min<10?'0'+min:min;
			timebox.text('计时'+' '+minu+':'+sec)
		}
	sco=0;
	scobox.text('分数'+' '+'0'+'分')
		// var sco=0;
})
//重新开始
var reset=$('.reset');
reset.on('click',function(){
	$('.pai').remove();
	setpoker(makepoker());
	clearInterval(tt);
	timebox.text('计时'+' '+'00'+':'+'00')
	var sec=0;
	var min=0;
	tt=setInterval(move,1000)
		function move(){
			sec++;
			if(sec>59){
				min+=1;
				sec=0;
			}
			sec=sec<10?'0'+sec:sec;
			minu=min<10?'0'+min:min;
			timebox.text('计时'+' '+minu+':'+sec)
		}
	sco=0;
	scobox.text('分数'+' '+'0'+'分')
		// var sco=0;
})
//结束游戏
var end=$('.end');
end.on('click',function(){
	$('.move-left').animate({'opacity':0})
	$('.move-right').animate({'opacity':0})
	$('.pai').remove();
	clearInterval(tt);
	timebox.text('计时'+' '+'00'+':'+'00')
})

//计时
var timebox=$('.time');
var sec=0;
var min=0;
var minu=0;
var tt;
timebox.text('计时'+' '+'00'+':'+'00')
 	function jishi(){
		tt=setInterval(move,1000)
		function move(){
			sec++;
			if(sec>59){
				min+=1;
				sec=0;
			}
			sec=sec<10?'0'+sec:sec;
			minu=min<10?'0'+min:min;
			timebox.text('计时'+' '+minu+':'+sec)
		}
	}
var scobox=$(".score");
scobox.text('分数'+' '+'0'+'分')
var sco=0;
// if(getNumber(prev)+getNumber(this)===13||number===13){
// 	sco+=10;
// }
// scobox.text('分数'+' '+sco+'分')
})