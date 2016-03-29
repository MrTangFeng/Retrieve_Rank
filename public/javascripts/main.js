jQuery(function($) {
	$('.body_text').css('display','none');
	$('.div_answer_input_value p').css('display','none');
	$('.div_answer_input_button').on('click',function(){
		$('.body_text').css('display','block');
		$('.div_answer_input_value p').css('display','block');
	});
	$('.view_index1_title_rigth_but').on('click', function() {
		
		$('.view_index1_body').slideToggle();
		

		
	});
	$('.view_index2_title_rigth_but').on('click', function() {
		$('.view_index2_body').slideToggle();
			
			

		
	});
	$('.view_index3_title_rigth_but').on('click', function() {
		$('.view_index3_body').slideToggle();
			
			

		
	});
}); 