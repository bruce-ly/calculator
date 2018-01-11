
var lilv1 = 0.049, lilv2 = 0.0325;

//浮点数加法运算
function FloatAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}

//浮点数减法运算
function FloatSub(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    //动态控制精度长度
    n=(r1>=r2) ? r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
}

//浮点数乘法运算
function FloatMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}

//浮点数除法运算
function FloatDiv(arg1,arg2){
    var t1=0,t2=0,s1=arg1.toString(),s2=arg2.toString();
    try{t1=s1.split(".")[1].length}catch(e){}
    try{t2=s2.split(".")[1].length}catch(e){}
    return (t1>=t2) ? Number(s1.replace(".",""))/Number(s2.replace(".",""))/Math.pow(10,t1-t2):Number(s1.replace(".",""))/Number(s2.replace(".",""))*Math.pow(10,t2-t1);
}

function exc_js(v){
    if (v==1){
        document.getElementById('calc1_js_div1').style.display='block';
        document.getElementById('calc1_js_div2').style.display='none';
    }else{
        document.getElementById('calc1_js_div1').style.display='none';
        document.getElementById('calc1_js_div2').style.display='block';
    }
}

function formReset(fmobj){
    setTimeout(function(){
        if(fmobj.type.value == 1) {
            fmobj.lilv.value = lilv1*100 + '%';
        }else if(fmobj.type.value == 2) {
            fmobj.lilv.value = lilv2*100 + '%';
        }else if(fmobj.type.value == 3) {
            fmobj.lilv1.value = lilv1*100 + '%';
            fmobj.lilv2.value = lilv2*100 + '%';
        }
    },100);
    if(fmobj.type.value == 3) return;
    document.getElementById('calc1_js_div1').style.display='block';
    document.getElementById('calc1_js_div2').style.display='none';
}

//验证是否为数字
function reg_Num(str){
	if (str <= 0){return false;}
	if (str.length==0){return false;}
	var Letters = "1234567890.";
	for (i=0;i<str.length;i++){
		var CheckChar = str.charAt(i);
		if (Letters.indexOf(CheckChar) == -1){return false;}
	}
	return true;
}

//得到利率
function getlilv(type){
    var _discount = $('#discount').val();
    if (type == 1){
        return FloatMul(lilv1,_discount);
    }else{
        return FloatMul(lilv2,_discount);
    }
}

//本金还款的月还款额(参数: 年利率 / 贷款总额 / 贷款总月份 / 贷款当前月0～length-1)
function getMonthMoney2(lilv,total,month,cur_month){
	var lilv_month = lilv / 12;//月利率
	//return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
	var benjin_money = total/month;
	return (total - benjin_money * cur_month) * lilv_month + benjin_money;
}


//本息还款的月还款额(参数: 年利率/贷款总额/贷款总月份)
function getMonthMoney1(lilv,total,month){
	var lilv_month = lilv / 12;//月利率
	return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
}

function ext_total(fmobj){

	var years = fmobj.years.value;
	var month = fmobj.years.value * 12;

	fmobj.month1.value = month;
	fmobj.month2.value = month;
	if (fmobj.type.value == 3 ){
		//--  组合型贷款(组合型贷款的计算，只和商业贷款额、和公积金贷款额有关，和按贷款总额计算无关)
		if (!reg_Num(fmobj.total_sy.value)){alert("请填写正确商贷比例");fmobj.total_sy.focus();return false;}
		if (!reg_Num(fmobj.total_gjj.value)){alert("请填写正确公积金比例");fmobj.total_gjj.focus();return false;}
		if (!reg_Num(fmobj.discount.value?fmobj.discount.value:(function(){
            fmobj.discount.value = 1;
            return fmobj.discount.value;
        })())){alert("请填写正确折扣");fmobj.discount.focus();return false;}
		if (fmobj.total_sy.value==null){fmobj.total_sy.value=0;}
		if (fmobj.total_gjj.value==null){fmobj.total_gjj.value=0;}

		fmobj.fangkuan_total1.value = "略";//房款总额
		fmobj.fangkuan_total2.value = "略";//房款总额
		fmobj.money_first1.value = 0;//首期付款
		fmobj.money_first2.value = 0;//首期付款

		//贷款总额
		var total_sy = fmobj.total_sy.value*1;
		var total_gjj = fmobj.total_gjj.value*1;
		var daikuan_total = total_sy + total_gjj;
		fmobj.daikuan_total1.value = daikuan_total;
		fmobj.daikuan_total2.value = daikuan_total;

		//月还款
		var lilv_sd = getlilv(1);//得到商贷利率
		var lilv_gjj = getlilv(2);//得到公积金利率
		console.log(lilv_sd+ '---' +lilv_gjj);

		//1.本金还款
		//月还款
		var all_total2 = 0;
		var month_money2 = "";
		for(j=0;j<month;j++) {
			//调用函数计算: 本金月还款额
			huankuan = getMonthMoney2(lilv_sd,total_sy,month,j) + getMonthMoney2(lilv_gjj,total_gjj,month,j);
			all_total2 += huankuan;
			huankuan = Math.round(huankuan*100)/100;
			//fmobj.month_money2.options[j] = new Option( (j+1) +"月," + huankuan + "(元)", huankuan);
			month_money2 += (j+1) +"月," + huankuan + "(元)\n";
		}
        console.log(month_money2);
        fmobj.month_money2.value = Math.round( (getMonthMoney2(lilv_sd,total_sy,month,0) + getMonthMoney2(lilv_gjj,total_gjj,month,0)) *100)/100;
        fmobj.month_money3.value = Math.round( ((getMonthMoney2(lilv_sd,total_sy,month,0) + getMonthMoney2(lilv_gjj,total_gjj,month,0)) - (getMonthMoney2(lilv_sd,total_sy,month,1) + getMonthMoney2(lilv_gjj,total_gjj,month,1))) *100)/100;
		//还款总额
		fmobj.all_total2.value = Math.round(all_total2*100)/100;
		//支付利息款
		fmobj.accrual2.value = Math.round( (all_total2 - daikuan_total) *100)/100;

		//2.本息还款
		//月均还款
		var month_money1 = getMonthMoney1(lilv_sd,total_sy,month) + getMonthMoney1(lilv_gjj,total_gjj,month);//调用函数计算
		fmobj.month_money1.value = Math.round(month_money1*100)/100;
		//还款总额
		var all_total1 = month_money1 * month;
		fmobj.all_total1.value = Math.round(all_total1*100)/100;
		//支付利息款
		fmobj.accrual1.value = Math.round( (all_total1 - daikuan_total) *100)/100;
	}else{
		if (fmobj.jisuan_radio.value == 1){
			//------------ 根据单价面积计算
			if (!reg_Num(fmobj.price.value)){alert("请填写正确单价");fmobj.price.focus();return false;}
			if (!reg_Num(fmobj.sqm.value)){alert("请填写正确面积");fmobj.sqm.focus();return false;}
            if (!reg_Num(fmobj.discount.value?fmobj.discount.value:(function(){
                fmobj.discount.value = 1;
                return fmobj.discount.value;
            })())){alert("请填写正确折扣");fmobj.discount.focus();return false;}
			//房款总额
			var fangkuan_total = fmobj.price.value * fmobj.sqm.value;
			fmobj.fangkuan_total1.value = fangkuan_total;
			fmobj.fangkuan_total2.value = fangkuan_total;
			//贷款总额
			var daikuan_total = (fmobj.price.value * fmobj.sqm.value) * (fmobj.anjie.value/10);
			fmobj.daikuan_total1.value = daikuan_total;
			fmobj.daikuan_total2.value = daikuan_total;
			//首期付款
			var money_first = fangkuan_total - daikuan_total;
			fmobj.money_first1.value = money_first
			fmobj.money_first2.value = money_first;
		}else{
			//------------ 根据贷款总额计算
			if (!reg_Num(fmobj.daikuan_tota.value)){alert("请填写正确贷款总额");fmobj.daikuan_tota.focus();return false;}
            if (!reg_Num(fmobj.discount.value?fmobj.discount.value:(function(){
                fmobj.discount.value = 1;
                return fmobj.discount.value;
            })())){alert("请填写正确折扣");fmobj.discount.focus();return false;}
			//房款总额
			fmobj.fangkuan_total1.value = "略";
			fmobj.fangkuan_total2.value = "略";
			//贷款总额
			var daikuan_total = fmobj.daikuan_tota.value;
			fmobj.daikuan_total1.value = daikuan_total;
			fmobj.daikuan_total2.value = daikuan_total;
			//首期付款
			fmobj.money_first1.value = 0;
			fmobj.money_first2.value = 0;
		}
        //--  商业贷款、公积金贷款
        var lilv = getlilv(fmobj.type.value);//得到利率
        console.log(lilv);

        //1.本金还款
		//月还款
		var all_total2 = 0;
		var month_money2 = "";
		for(j=0;j<month;j++) {
			//调用函数计算: 本金月还款额
			huankuan = getMonthMoney2(lilv,daikuan_total,month,j);
			all_total2 += huankuan;
			huankuan = Math.round(huankuan*100)/100;
			//fmobj.month_money2.options[j] = new Option( (j+1) +"月," + huankuan + "(元)", huankuan);
			month_money2 += (j+1) +"月," + huankuan + "(元)\n";
		}
        console.log(month_money2);
		fmobj.month_money2.value = Math.round(getMonthMoney2(lilv,daikuan_total,month,0)*100)/100;
		fmobj.month_money3.value = Math.round( (getMonthMoney2(lilv,daikuan_total,month,0) - getMonthMoney2(lilv,daikuan_total,month,1)) *100)/100;
		//还款总额
		fmobj.all_total2.value = Math.round(all_total2*100)/100;
		//支付利息款
		fmobj.accrual2.value = Math.round( (all_total2 - daikuan_total) *100)/100;

		//2.本息还款
		//月均还款
		var month_money1 = getMonthMoney1(lilv,daikuan_total,month);//调用函数计算
		fmobj.month_money1.value = Math.round(month_money1*100)/100;
		//还款总额
		var all_total1 = month_money1 * month;
		fmobj.all_total1.value = Math.round(all_total1*100)/100;
		//支付利息款
		fmobj.accrual1.value = Math.round( (all_total1 - daikuan_total) *100)/100;
	}
    $('#fix_box').fadeIn().find('.fix_tab').css('marginRight',0);
}

function fnTab(num){
    $('.js_tab').hide().eq(num).show();
}

function fnHide(){
    $('#fix_box').fadeOut().find('.fix_tab').css('marginRight','-100%');
}

$('#nav').find('td').each(function(){
    $(this).click(function(){
        $(this).addClass('click').siblings().removeClass('click');
        $('#type').val($(this).index()+1);
        if($(this).index() == 2){
            $('#calc1_js_div').hide();
            $('#calc1_js_div1').hide();
            $('#calc1_js_div2').hide();
            $('#calc1_js_div3').hide();
            $('#calc1_zuhe').show();
            $('#calc1_zuhe1').show();
            $('#lilv1').val(lilv1*100 + '%');
            $('#lilv2').val(lilv2*100 + '%');
        }else{
            $('#calc1_js_div').show().find('option')[0].selected = 'selected';
            $('#calc1_js_div1').show();
            $('#calc1_js_div2').hide();
            $('#calc1_js_div3').show();
            $('#calc1_zuhe').hide();
            $('#calc1_zuhe1').hide();
            if($(this).index() == 0){
                $('#lilv').val(lilv1*100 + '%');
            }else{
                $('#lilv').val(lilv2*100 + '%');
            }
        }
    });
}).first().click();

$('#tab').find('td').each(function(){
    $(this).click(function(){
        $(this).addClass('click').siblings().removeClass('click');
        if($(this).index() == 0){
            $('.calculator1').show();
            $('.calculator2').hide();
        }else{
            $('.calculator1').hide();
            $('.calculator2').show();
        }
    });
}).first().click();