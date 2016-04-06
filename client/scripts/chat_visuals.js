$(document).ready(function(){



	$('.chat_head').click(function(){
		$('.chat_body').slideToggle('fast');
	});

	$('body').on('click', '.close', function() {
        $(this).parent().parent().hide();
            var count_chats = jQuery(".msg_box" ).length;
            var sum_width = 20;
            jQuery.each(jQuery(".msg_box" ), function() {
                sum_width += 260;
                jQuery(this).css( "right", sum_width);
            });
	});

	$('body').on('click', '.msg_head', function() {
        $(this).next().slideToggle("fast");
	});

	

	$('body').on('click', '.user', function() {

		$('.msg_wrap').show();
		$('.msg_box').show();
	});

setTimeout(function  () {
	$('.msg_body').each(function(index, obj){
    	$(this).animate({ scrollTop: 
                $(this)[0].scrollHeight});
    })
	}, 1000)


	
})

