/**
 * Created by Bruce on 17-4-25.
 */

var $text = $('#texts'),  _numArr = ['0'];

function fnCls () {
    $text.text('0');
    _numArr = ['0'];
}

function fnMinus () {
    $text.text(-$text.text());
    if(_numArr[2]){
        _numArr[1] = $text.text();
    }else{
        _numArr[0] = $text.text();
    }
}

function fnDel () {
    var _len = $text.text().length;
    if(_len > 1){
        $text.text($text.text().substring(0,  _len- 1));
    }else{
        $text.text('0');
    }
    if(_numArr[2]){
        _numArr[1] = $text.text();
    }else{
        _numArr[0] = $text.text();
    }
}

function fnEq (_val) {
    if(_numArr[0] && _numArr[1] && _numArr[2]){
        if(_numArr[2] == '+'){
            $text.text(FloatAdd(_numArr[0], _numArr[1]));
        }else if(_numArr[2] == '-'){
            $text.text(FloatSub(_numArr[0], _numArr[1]));
        }else if(_numArr[2] == '*'){
            $text.text(FloatMul(_numArr[0], _numArr[1]));
        }else if(_numArr[2] == '/'){
            $text.text(FloatDiv(_numArr[0], _numArr[1]));
        }
        _numArr[0] = $text.text();
        _numArr[1] = false;
    }
    if(_val == '='){
        _numArr[2] = false;
    }else{
        _numArr[2] = _val;
    }
    _numArr[3] = true;
}

function fnText (_val) {
    if(_numArr[3]) {
        $text.text('0');
        _numArr[3] = false;
    }
    if($text.text().length > 10) return;
    if(_val != '.' && $text.text() == '0'){
        $text.text(_val);
    }else if(!(_val == '.' && /\./g.test($text.text()))){
        $text.text($text.text() + _val);
    }else{

    }
    if(_numArr[2]){
        _numArr[1] = $text.text();
    }else{
        _numArr[0] = $text.text();
    }
}














